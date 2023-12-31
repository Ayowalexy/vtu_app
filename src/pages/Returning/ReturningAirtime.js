import React, { useState, useEffect, useContext } from "react";
import IText, { IIText } from "../../components/Text/Text";
import { Image, ScrollView, TouchableOpacity, View, Text, StyleSheet, Dimensions } from "react-native";
import FLexer, { IIcon, IView, Box, IFlexer } from "../../components/Flexer/Flexer";
import { Colors } from "../../components/utils/colors";
import GoBack from "../../components/GoBack/GoBack";
import Input from "../../components/Input/Input";
import { Header } from "../../components/Flexer/Flexer";
import ParentComponent from "../../../navigators";
import { useSelector } from "react-redux";
import Confirmation from "../../components/Confirmation/Confirmation";
import { selectServices } from "../../redux/store/user/user.selector";
import Receipt from "../Wallet/Receipt";
import { useMutation } from "react-query";
import Spinner from "../../components/Spinner/Spinner";
import { fundAirtimeAndData } from "../../services/network";
import NetworkModal from "../../components/Modal/Network";
import { NetworkContext } from "../../context/NetworkContext";
import { selectSystemRates } from "../../redux/store/user/user.selector";
import { AIRTEL_LOGO, GLO_LOGO, MTN_LOGO, NINE_MOBILE } from "../../components/utils/Assets";
import { getAllPhoneBooks } from "../../services/network";

const ReturningAirtime = ({ navigation, route }) => {
    const [network, setNetwork] = useState('')
    const [amount, setAmount] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const services = useSelector(selectServices)
    const [confirmationData, setConfirmationData] = useState('')
    const [showConfirmation, setShowConfirmation] = useState(false)
    const [receipt, showReceipt] = useState(false)
    const [receiptData, setReceiptdata] = useState('')
    const rates = useSelector(selectSystemRates)
    const [type, setType] = useState('')
    const [data, setData] = useState('')
    const [visible, setVisible] = useState(false)
    const [msg, setMsg] = useState('')
    const { isConnected } = useContext(NetworkContext)
    const [number, setNumber] = useState('')
    const [saved_network, setSaved_network] = useState('')
    const [name, setName] = useState('')


    useEffect(() => {
        // const { number, saved_network, name } = route?.params?.data;

        if (route?.params?.data?.number) {
            setNumber(route?.params?.data?.number)
            setSaved_network(route?.params?.data?.saved_network)
            setName(route?.params?.data?.name)
        }

    }, [route?.params?.data?.number])


    const { isLoading, mutate } = useMutation(fundAirtimeAndData, {
        onSuccess: data => {
            console.log('airtime res', data?.data)
            if (data?.data?.flag == 1) {
                setReceiptdata({
                    method: 'Wallet',
                    ['Phone Number']: phoneNumber,
                    type: 'Airtime'
                })
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
                setNetwork(data?.data?.result)
            } else {
                setType('invalid')
                setVisible(true)
            }
        }
    })


    const handleVerify = (number) => {

        if (isConnected) {
            setType('internet')
            setVisible(true)
            return;
        }

        setMsg('Verifying your number, please wait...')
        const filter = services.find(element => element.module_name == 'Airtime')
        const payload = {
            type: 'verify',
            phone_number: number,
            module_id: Number(filter.module_id),
        }

        hanldeVerifyNumberMutation.mutate(payload)
    }




    useEffect(() => {
        if (route?.params?.data?.number) {
            setPhoneNumber(route?.params?.data?.number)
            handleVerify(route?.params?.data?.number)
        }
    }, [route?.params?.data?.number])


    const handleFundAirtime = () => {


        const airtime = services?.find(element => element.module_name == 'Airtime')

        const payload = {
            phone: number,
            module_id: Number(airtime.module_id),
            amount: amount,
            operator: saved_network,
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


    const handPayment = () => {
        if (isConnected) {
            setType('internet')
            setVisible(true)
            return
        }

        setMsg('Recharging you number, please wait...')

        mutate({
            ...confirmationData,
            amount: Number(amount) + Number(rates?.service_fee?.airtime_fee),
            type: 'airtime',
            fee: rates?.service_fee?.airtime_fee,
            product_id: network?.product_id
        })
        // setConfirmed(false)
    }


    return (
        <ParentComponent>
            <Header>Airtime</Header>

            <ScrollView>
                <IView p={20}>

                    <FLexer
                        w='90%'
                        justifyContent='flex-start'
                    >

                        <TouchableOpacity>
                            <Image
                                style={[style.img, {
                                }]}
                                source={
                                    saved_network == 'MTN' ?
                                        MTN_LOGO
                                        : saved_network == 'Globacom'
                                            ? GLO_LOGO
                                            : saved_network == 'Airtel'
                                                ? AIRTEL_LOGO
                                                : saved_network == '9mobile'
                                                    ? NINE_MOBILE
                                                    : null

                                }
                            />
                        </TouchableOpacity>

                    </FLexer>

                    <IIText type='L' top={20}
                        color={Colors.PRIMARY_DEEP}
                        size={17}
                    >Airtime Purchase</IIText>

                    <IFlexer
                        borderBottomWidth={1}
                        // padding={15}
                        paddingBottom={10}
                        marginTop={20}
                    >
                        <IIText type='B'>{saved_network} Airtime VTU</IIText>
                        <IIcon
                            name='ios-chevron-down-sharp'
                            size={20}
                            color={Colors.PRIMARY}
                        />
                    </IFlexer>

                    <View style={{ width: Dimensions.get('window').width }}>
                        <Input
                            value={phoneNumber}
                            onChange={setPhoneNumber}
                            size='B'
                            text='Phone Number'
                            keyboardType={'number-pad'}
                        />
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate('Contact')
                            }}
                            style={style.contact}>
                            <Box
                                w={50}
                                h={50}
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
                    </View>

                    <IIText size={16} type='B'>Select Amount</IIText>
                    <IFlexer
                        w='100%'
                        flexWrap='wrap'
                    >
                        {
                            ['₦100', '₦200', '₦500', '₦1,000', '₦1,500', '₦2,000']
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
                                                {element}
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
                            value={amount}
                            onChange={setAmount}
                            size='B'
                            text='Amount'
                            keyboardType={'number-pad'}

                        />
                    </View>

                    <TouchableOpacity
                        onPress={handleFundAirtime}
                        activeOpacity={0.8}
                    >
                        <Box
                            w='100%'
                            h={45}
                            backgroundColor={Colors.PRIMARY}
                            marginTop={30}
                            marginBottom={50}
                        >
                            <IIText type='B' color={Colors.DEFAULT} size={17}>NEXT</IIText>
                        </Box>
                    </TouchableOpacity>

                </IView>
                <Confirmation
                    visible={showConfirmation}
                    setVisible={setShowConfirmation}
                    data={confirmationData}
                    verified={route?.params?.verified}
                    page='Returning Airtime'
                />
                <Receipt
                    amount={amount}
                    visible={receipt}
                    setVisible={showReceipt}
                    channel='Wallet'
                    number={number}
                    data={receiptData}

                />
                {isLoading && (<Spinner
                    loading={msg}
                />)}
                 {hanldeVerifyNumberMutation.isLoading && (<Spinner
                    loading={msg}
                />)}
            </ScrollView>
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
        width: 70,
        height: 70,
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
        top: 40

    }
})


export default ReturningAirtime