import React, { useState, useEffect, useContext, useRef } from "react";
import IText, { IIText } from "../../components/Text/Text";
import { NetworkContext } from "../../context/NetworkContext";
import { Image, ScrollView, TouchableOpacity, View, Animated, Text, StyleSheet, Dimensions } from "react-native";
import FLexer, { IIcon, IView, Box, IFlexer } from "../../components/Flexer/Flexer";
import { Colors } from "../../components/utils/colors";
import GoBack from "../../components/GoBack/GoBack";
import Input from "../../components/Input/Input";
import { Header } from "../../components/Flexer/Flexer";
import ParentComponent from "../../../navigators";
import { AIRTEL_LOGO, GLO_LOGO, MTN_LOGO, NINE_MOBILE } from "../../components/utils/Assets";
import { formatNumber } from "../../utils/formatter";
import SwitchToggle from "react-native-switch-toggle";
import { useSelector } from "react-redux";
import { selectSystemRates, selectServices, selectCurrentUser } from "../../redux/store/user/user.selector";
import IModal from "../../components/Modal/Modal";
import Search from "../../components/Search/Search";
import axios from "axios";
import { getAllPhoneBooks } from "../../services/network";
import Confirmation from "../../components/Confirmation/Confirmation";
import { useMutation } from "react-query";
import { fundAirtimeAndData } from "../../services/network";
import NetworkModal from "../../components/Modal/Network";
import Spinner from "../../components/Spinner/Spinner";
import { unFormatNumber } from "../../utils/formatter";
import Receipt from "../Wallet/Receipt";




const Airtime = ({ navigation, route }) => {
    const [network, setNetwork] = useState('')
    const [amount, setAmount] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const rates = useSelector(selectSystemRates)
    const services = useSelector(selectServices)
    const [on, off] = useState(false)
    const [history, setShowhistory] = useState(false)
    const [search, setSearch] = useState('')
    const { isConnected } = useContext(NetworkContext)
    const [savedNumber, setSavedNumbers] = useState([])
    const [showConfirmation, setShowConfirmation] = useState(false)
    const [confirmationData, setConfirmationData] = useState('')
    const [type, setType] = useState('')
    const [visible, setVisible] = useState(false)
    const [msg, setMsg] = useState('')
    const [beneficiaryName, setBeneficiaryName] = useState('')
    const [confirmed, setConfirmed] = useState(false)
    const user = useSelector(selectCurrentUser)
    const [receipt, showReceipt] = useState(false)
    const [data, setData] = useState('')
    const [phone, setphone] = useState('')
    const [receiptData, setReceiptdata] = useState('')
    const [verifiedNumber, setVerifiedNumber] = useState('')

    const sizeAnim = useRef(new Animated.Value(0)).current;

    const reduceAnim = () => {
        Animated.timing(sizeAnim, {
            toValue: 0,
            duration: 5000,
            useNativeDriver: true
        }).start()
    }


    const { isLoading, mutate } = useMutation(fundAirtimeAndData, {
        onSuccess: data => {
            console.log('airtime res', data?.data)
            if (data?.data?.flag == 1) {
                setReceiptdata({
                    method: 'Wallet',
                    ['Phone Number']: phoneNumber,
                    type: 'Airtime'
                })
                setphone(phoneNumber)
                showReceipt(true)

            } else if (data?.data?.flag == 0) {
                setType('invalid')
                setData(data?.data?.message)
                setVisible(true)
            }
        }
    })


    const hanldeVerifyNumberMutation = useMutation(getAllPhoneBooks, {
        onSuccess: data => {
            if (data?.data?.flag == 1) {
                console.log('res', data?.data)
                setVerifiedNumber(data?.data?.result?.network)
                setNetwork(data?.data?.result)
                reduceAnim()
            } else {
                setType('invalid')
                setVisible(true)
            }
        }
    })



    const handleVerify = (phoneNumber) => {

        if (isConnected) {
            setType('internet')
            setVisible(true)
            return;
        }

        setMsg('Verifying your number, please wait...')
        const filter = services.find(element => element.module_name == 'Airtime')
        const payload = {
            type: 'verify',
            phone_number: phoneNumber,
            module_id: Number(filter.module_id),
        }

        console.log(payload)

        hanldeVerifyNumberMutation.mutate(payload)
    }


    useEffect(() => {
        if (isConnected) {
            return
        }

        handleFetch()

    }, [])



    useEffect(() => {
        if (phoneNumber.startsWith(2)) {
            if (phoneNumber.length == 13) {
                handleVerify(phoneNumber)
            }
        } else if (phoneNumber.startsWith(0)) {
            if (phoneNumber.length == 11) {
                let num = phoneNumber.replace('0', '234')
                handleVerify(num)
            }
        } else if (phoneNumber.startsWith('+')) {
            if (phoneNumber.length == 14) {
                let num = phoneNumber.slice(1,);
                handleVerify(num)
            }
        } else if (phoneNumber.startsWith('+') && phoneNumber.includes(' ')) {
            if (phoneNumber.length == 17) {
                let num = phoneNumber.slice(1,).split(' ').join()
                handleVerify(num)
            }
        }
    }, [phoneNumber])

    const handleFetch = async () => {
        const res = await getAllPhoneBooks({ type: "fetch" })
        if (res?.status == 200) {
            const filter = res?.data?.filter(element => element.book_type == 'Number')
            setSavedNumbers(filter)

        }
    }

    useEffect(() => {
        if (route?.params?.number) {
            setNetwork('')
            setPhoneNumber(route?.params?.number)
        }
    }, [route])


    const handPayment = () => {
        if (isConnected) {
            setType('internet')
            setVisible(true)
            return
        }

        setMsg('Recharging you number, please wait...')
        console.log( 'airtime',{
            ...confirmationData,
            amount: Number(amount) + Number(rates?.service_fee?.airtime_fee),
            type: 'airtime',
            beneficiary: beneficiaryName ? beneficiaryName : phoneNumber,
            fee: rates?.service_fee?.airtime_fee,
            auto_save: on ? 1 : 0,
            product_id: network?.product_id

        })
        mutate({
            ...confirmationData,
            amount: Number(amount) + Number(rates?.service_fee?.airtime_fee),
            type: 'airtime',
            beneficiary: beneficiaryName ? beneficiaryName : phoneNumber,
            fee: rates?.service_fee?.airtime_fee,
            auto_save: on ? 1 : 0,
            product_id: network?.product_id
        })
        setConfirmed(false)
    }


    console.log(search)

    const handleFundAirtime = () => {


        const airtime = services?.find(element => element.module_name == 'Airtime')

        const payload = {
            phone: phoneNumber,
            module_id: Number(airtime.module_id),
            amount: amount,
            operator: verifiedNumber,
            beneficiary: on ? beneficiaryName : ''
        }

        setConfirmationData(payload)
        setShowConfirmation(true)

    }

    useEffect(() => {
        if (route?.params?.verified) {
            setShowConfirmation(false)
            handPayment()
        }
}, [route?.params?.rand])



    return (
        <ParentComponent>
            <Header>Airtime</Header>

            <ScrollView>
                <IView p={20}>

                    <FLexer
                        w='90%'
                    >
                        {
                            [
                                {
                                    name: 'MTN',
                                    img: MTN_LOGO
                                },
                                {
                                    name: 'Globacom',
                                    img: GLO_LOGO
                                },
                                {
                                    name: 'Airtel',
                                    img: AIRTEL_LOGO
                                },
                                {
                                    name: '9mobile',
                                    img: NINE_MOBILE
                                },
                            ]
                                .map((element, idx) => (
                                    <TouchableOpacity
                                        key={idx}
                                        onPress={() => {
                                            setNetwork(element.name)
                                        }}
                                    >
                                        <Animated.Image
                                            style={[style.img, {
                                                borderWidth: 1,
                                                borderColor: element.name == network ? Colors.DEFAULT : null,
                                               opacity: element?.name == verifiedNumber ? 1 : 0.1
                                            }]}
                                            source={element.img}
                                        />
                                    </TouchableOpacity>
                                ))
                        }
                    </FLexer>

                    <IIText type='L' top={17}
                        color={Colors.PRIMARY_DEEP}
                        size={14}
                    >Airtime Purchase</IIText>

                    <IFlexer
                        borderBottomWidth={1}
                        // padding={15}
                        paddingBottom={10}
                        marginTop={20}
                    >
                        <IIText type='B'>{verifiedNumber?.network} Airtime VTU</IIText>

                    </IFlexer>

                    <View style={{ width: Dimensions.get('window').width }}>
                        <Input
                            value={phoneNumber}
                            onChange={setPhoneNumber}
                            size='B'
                            text='Phone Number'
                            p='Enter Phone number'
                            keyboardType={'number-pad'}
                        />




                        <View style={style.contact}>
                            <Box
                                flexDirection='row'
                            >
                                <TouchableOpacity

                                    onPress={() => setShowhistory(true)}
                                >
                                    <Box
                                        h={40}
                                        w={40}
                                        r={10}
                                        marginRight={10}
                                        borderWidth={1}
                                        borderColor={Colors.DEFAULT_FADED}
                                    >
                                        <IIcon
                                            name='ios-chevron-down-sharp'
                                            size={20}
                                            color={Colors.SEARCH}
                                        />
                                    </Box>
                                </TouchableOpacity>



                                <TouchableOpacity
                                    onPress={() => {
                                        navigation.navigate('Contact', {
                                            page: 'Airtime'
                                        })
                                    }}
                                // style={style.contact}
                                >
                                    <Box
                                        w={40}
                                        h={40}
                                        borderWidth={1}
                                        borderRadius={10}
                                        marginRight={90}
                                    >
                                        <IIcon
                                            name='person'
                                            size={20}
                                            color={Colors.DEFAULT}
                                        />
                                    </Box>
                                </TouchableOpacity>
                            </Box>
                        </View>


                    </View>

                    <IIText size={16} type='B'>Select Amount</IIText>
                    <IFlexer
                        w='100%'
                        flexWrap='wrap'
                    >
                        {
                            ['100', '200', '500', '1000', '1500', '2000']
                                .map((element, idx) => (
                                    <Box
                                        w='30%'
                                        h={50}
                                        marginBottom={20}
                                        borderWidth={amount == element ? 0 : 1}
                                        borderColor={amount == element ? null : Colors.PRIMARY}
                                        backgroundColor={amount == element ? Colors.PRIMARY : Colors.PRIMARY_FADED}
                                        key={idx}
                                    >
                                        <TouchableOpacity
                                            onPress={() => {
                                                setAmount(element)
                                            }}
                                        >
                                            <IIText type='B'
                                                width={100}
                                                textAlign='center'
                                                paddingTop={15}
                                                height={50}
                                                color={amount == element ? Colors.WHITE : Colors.DEFAULT} >
                                                ₦{formatNumber(element)}
                                            </IIText>
                                        </TouchableOpacity>
                                    </Box>
                                ))
                        }

                    </IFlexer>

                    <View style={style.view_1}>
                        <View style={style.view_2} />
                        <Text style={style.or}>
                            OR
                        </Text>
                        <View style={style.view_3} />
                    </View>


                    <View style={{ marginTop: -60 }}>
                        <Input
                            value={formatNumber(amount)}
                            onChange={setAmount}
                            size='B'
                            text='Amount'
                            keyboardType={'number-pad'}
                            p='Enter Amount'


                        />
                    </View>


                    <IIText type='B' paddingTop={20} color={Colors.DEFAULT} >
                        You will be charged a fee of ₦{rates?.service_fee?.airtime_fee}.00 for this {"\n"} transaction
                    </IIText>

                    <Box
                        w='100%'
                        alignItems='flex-end'
                    >
                        <IIText type='B' marginBottom={-10}>Save Beneficiary?</IIText>

                        <SwitchToggle
                            switchOn={on}
                            onPress={() => off(!on)}
                            circleColorOff={Colors.PRIMARY}
                            circleColorOn={Colors.PRIMARY}
                            backgroundColorOn={Colors.PRIMARY_FADED}
                            backgroundColorOff='#C4C4C4'
                            containerStyle={style.container_style}
                            circleStyle={style.circleStyle}
                        />



                    </Box>
                    {
                        on && (
                            <Box>
                                <View style={{ width: '100%', marginTop: -60 }}>
                                    <Input
                                        value={beneficiaryName}
                                        onChange={setBeneficiaryName}
                                        size='B'
                                        text='Beneficiary Name'
                                        p='Enter Name'


                                    />
                                </View>
                            </Box>
                        )
                    }

                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={handleFundAirtime}
                        disabled={phoneNumber.length && amount.length && network ? false : true}
                    >
                        <Box
                            w='100%'
                            h={45}
                            backgroundColor={Colors.PRIMARY}
                            marginTop={30}
                            marginBottom={50}
                            opacity={phoneNumber.length && amount.length && network ? 1 : 0.4}
                        >
                            <IIText type='B' color={Colors.DEFAULT} size={17}>
                                {
                                    route?.params?.verified ? 'NEXT' : 'CONTINUE'
                                }
                            </IIText>
                        </Box>
                    </TouchableOpacity>

                </IView>
            </ScrollView>

            <IModal
                visible={history}
                setVisible={setShowhistory}
                h={250}
            >
                <IView p={20}>
                    <IView top={40}>
                        <Search
                            value={search}
                            onChangeText={setSearch}
                            color={Colors.SEARCH}
                        />
                    </IView>

                    {
                        savedNumber?.filter(ele => ele.beneficiary_name.toLowerCase().includes(search.toLowerCase()))?.map((element, idx) => (
                            <TouchableOpacity
                                onPress={() => {
                                    setPhoneNumber(element?.beneficiary_number)
                                    setNetwork(element?.operator_name)
                                    setShowhistory(false)
                                }}
                                key={idx}>
                                <IFlexer
                                    w='100%'
                                    justifyContent='flex-start'
                                    flexDirection='column'
                                    alignItems='flex-start'
                                    marginTop={10}
                                    borderBottomWidth={1}
                                    paddingBottom={10}
                                >
                                    <IText>{element?.beneficiary_name}</IText>
                                    <IIText>{element?.beneficiary_number}</IIText>
                                </IFlexer>
                            </TouchableOpacity>
                        ))
                    }
                </IView>
            </IModal>
            <NetworkModal
                type={type}
                data={data}
                visible={visible}
                setVisible={setVisible}
            />
            {isLoading && (<Spinner
                loading={msg}
            />)}
            {hanldeVerifyNumberMutation.isLoading && (<Spinner
                loading={msg}
            />)}
            <Confirmation
                visible={showConfirmation}
                setVisible={setShowConfirmation}
                data={confirmationData}
                setConfirmed={setConfirmed}
                verified={route?.params?.verified}
                page='Airtime'
            />
            <Receipt
                amount={amount}
                visible={receipt}
                setVisible={showReceipt}
                channel='Wallet'
                number={phone}
                data={receiptData}

            />
        </ParentComponent>
    )
}


const style = StyleSheet.create({
    header: {
        width: '100%',
        height: 150,
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
        backgroundColor: Colors.PRIMARY
    },
    img: {
        width: 50,
        height: 50,
        borderRadius: 10
    },
    box: {
        width: 100,
        height: 50
    },
    view_1: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginTop: 10,
        marginBottom: 10
    }, view_2: {
        borderWidth: 0.25,
        borderColor: 'rgba(0,0,0,0.2)',
        flexGrow: 1
    },
    or: {
        padding: 10,
        borderWidth: 0.25,
        borderColor: 'rgba(0,0,0,0.2)',
        borderRadius: 50,
        color: Colors.DEFAULT
    },
    view_3: {
        borderWidth: 0.3,
        borderColor: 'rgba(0,0,0,0.2)',
        flexGrow: 1
    },
    contact: {
        position: 'absolute',
        right: -50,
        top: 40,


    },
    container_style: {
        marginTop: 16,
        width: 70,
        height: 38,
        borderRadius: 25,
        padding: 5,
        borderWidth: 1
    },
    circleStyle: {
        width: 30,
        height: 30,
        borderRadius: 20,
    }
})


export default Airtime