import React, { useState, useEffect, useContext } from 'react'
import { Box } from '../../components/Flexer/Flexer'
import { NetworkContext } from '../../context/NetworkContext'
import { IIText } from '../../components/Text/Text'
import { Image } from 'react-native'
import { IView } from '../../components/Flexer/Flexer'
import { TouchableOpacity, ScrollView, StyleSheet, View, FlatList, Dimensions } from 'react-native'
import { MTN_LOGO, GLO_LOGO, AIRTEL_LOGO, NINE_MOBILE } from '../../components/utils/Assets'
import { Header } from '../../components/Flexer/Flexer'
import { Colors } from '../../components/utils/colors'
import { IFlexer } from '../../components/Flexer/Flexer'
import { IIcon } from '../../components/Flexer/Flexer'
import Input from '../../components/Input/Input'
import IModal from '../../components/Modal/Modal'
import Search from '../../components/Search/Search'
import { useMutation } from 'react-query'
import NetworkModal from '../../components/Modal/Network'
import { getAllPhoneBooks, getDataAndVerify, fundAirtimeAndData } from '../../services/network'
import IText from '../../components/Text/Text'
import Animated, { SlideInLeft, Layout, SlideInDown, BounceInDown } from "react-native-reanimated";
import Spinner from '../../components/Spinner/Spinner'
import { useSelector } from 'react-redux'
import { selectServices, selectSystemRates, selectCurrentUser } from '../../redux/store/user/user.selector'
import { formatNumber } from '../../utils/formatter'
import { Button } from '../../components/Flexer/Flexer'
import Confirmation from '../../components/Confirmation/Confirmation'
import SwitchToggle from 'react-native-switch-toggle'
import Receipt from '../Wallet/Receipt'



const Data = ({ route, navigation }) => {
    const [network, setNetwork] = useState('')
    const [history, setShowhistory] = useState(false)
    const [savedNumber, setSavedNumbers] = useState([])
    const [phoneNumber, setPhoneNumber] = useState('')
    const [search, setSearch] = useState('')
    const [type, setType] = useState('')
    const [showNetwork, setShowNetwork] = useState(false)
    const [fomatedNumber, setFOrmattedNumber] = useState('')
    const { isConnected } = useContext(NetworkContext)
    const services = useSelector(selectServices)
    const [msg, setMsg] = useState('')
    const [showBundle, setShowBundle] = useState(false)
    const [selectedBundle, setSelectedBundle] = useState('')
    const [confirmationData, setConfirmationData] = useState('')
    const [showConfirmation, setShowConfirmation] = useState(false)
    const [confirmed, setConfirmed] = useState(false)
    const rates = useSelector(selectSystemRates)
    const [on, off] = useState(false)
    const user = useSelector(selectCurrentUser)
    const [beneficiaryName, setBeneficiaryName] = useState('')
    const [phone, setPhone] = useState('')
    const [receipt, showReceipt] = useState(false)
    const [receiptData, setReceiptdata] = useState('')
    const [useData, setUseData] = useState('')



    const rechargeMutation = useMutation(fundAirtimeAndData, {
        onSuccess: data => {
            console.log("data?.data", data?.data)
            if (data?.data?.flag == 1) {
                setReceiptdata({
                    method: 'Wallet',
                    ['Phone Number']: phoneNumber,
                    type: 'Data'
                })
                setPhone(phoneNumber)
                showReceipt(true)

            } else if (data?.data?.flag == 0) {
                setType('invalid')
                setUseData(data?.data?.message)
                setShowNetwork(true)
            }
        }
    })


    const handleRecharge = () => {

        const data = services?.find(element => element.module_name == 'Data')

        const payload = {
            phone: phoneNumber,
            module_id: Number(data.module_id),
            amount: selectedBundle?.topup_value,
            ['Data Value']: Number(selectedBundle?.data_amount) > 1000 ? (Number(selectedBundle?.data_amount) / 1000).toFixed(2) + 'GB' : selectedBundle?.data_amount + 'MB',
            operator: network?.network,
            beneficiary: on ? beneficiaryName : ''
        }
        setConfirmationData(payload)
        setShowConfirmation(true)
    }

    useEffect(() => {
        if (isConnected) {
            return
        }

        handleFetch()

    }, [])

    const handPayment = () => {
        if (isConnected) {
            setType('internet')
            setShowNetwork(true)
            return
        }

        setMsg('Recharging you number, please wait...')
        rechargeMutation.mutate({
            ...confirmationData,
            amount: Number(selectedBundle?.topup_value) + Number(rates?.service_fee?.data_fee),
            type: 'data',
            name: beneficiaryName ? beneficiaryName : user?.first_name,
            fee: rates?.service_fee?.data_fee

        })
        // setConfirmed(false)
    }

    useEffect(() => {
        if (route?.params?.verified) {
            setShowConfirmation(false)
            handPayment()
        }
    }, [route?.params?.verified])




    const handleFetch = async () => {
        const res = await getAllPhoneBooks({ type: "fetch" })
        if (res?.status == 200) {
            const filter = res?.data?.filter(element => element.book_type == 'Number')
            setSavedNumbers(filter)

        }
    }

    useEffect(() => {
        if (route?.params?.number) {
            setPhoneNumber(route?.params?.number)
        }
    }, [route])

    useEffect(() => {
        if (phoneNumber.startsWith(2)) {
            if (phoneNumber.length == 13) {
                handleData(phoneNumber)
            }
        } else if (phoneNumber.startsWith(0)) {
            if (phoneNumber.length == 11) {
                let num = phoneNumber.replace('0', '234')
                handleData(num)
            }
        } else if (phoneNumber.startsWith('+')) {
            if (phoneNumber.length == 14) {
                let num = phoneNumber.slice(1,);
                handleData(num)
            }
        } else if (phoneNumber.startsWith('+') && phoneNumber.includes(' ')) {
            if (phoneNumber.length == 17) {
                let num = phoneNumber.slice(1,).split(' ').join()
                handleData(num)
            }
        }
    }, [phoneNumber])

    const { isLoading, mutate } = useMutation(getDataAndVerify, {
        onSuccess: data => {
            if (data?.data?.flag == 1) {
                setNetwork(data?.data?.result)
            } else {
                setType('invalid')
                setShowNetwork(true)
            }
        }
    })

    const handleData = async (number) => {
        if (isConnected) {
            setType('internet')
            setShowNetwork(true)
            return
        }

        const DataID = services?.find(element => element?.module_name == 'Data')
        const payload = {
            module_id: DataID.module_id,
            phone: number
        }

        setMsg('Loading Data Bundles...')



        mutate(payload)
        setSelectedBundle('')


    }





    return (
        <View>
            <Header>Data</Header>
            <ScrollView>
                <IView p={20}>

                    <Animated.View
                        entering={BounceInDown}

                    >
                        {
                            Boolean(network) && (
                                <>
                                    <Image
                                        style={styles.img}
                                        source={
                                            network?.network == 'MTN'
                                                ? MTN_LOGO
                                                : network?.network == 'Globacom'
                                                    ? GLO_LOGO
                                                    : network?.network == 'Airtel'
                                                        ? AIRTEL_LOGO
                                                        : network?.network == '9mobile'
                                                            ? NINE_MOBILE
                                                            : null
                                        }
                                    />
                                </>
                            )
                        }
                    </Animated.View>

                    <IIText type='L' top={20}
                        color={Colors.PRIMARY_DEEP}
                        size={17}
                    >Data Purchase</IIText>

                    <IFlexer
                        borderBottomWidth={1}
                        // padding={15}
                        paddingBottom={10}
                        marginTop={20}
                    >
                        <IIText type='B'>{network?.network} Data VTU</IIText>

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




                        <View style={styles.contact}>
                            <Box
                                flexDirection='row'
                            >
                                <TouchableOpacity

                                    onPress={() => {
                                        setShowhistory(true)
                                    }}
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
                                            page: 'Data'
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
                    {
                        Boolean(network) && (
                            <>
                                <View style={{ marginBottom: 30 }}>
                                    <IIText size={16} paddingTop={50} type='B'>Select A bundle</IIText>

                                    <TouchableOpacity onPress={() => setShowBundle(true)}>

                                        {
                                            Boolean(selectedBundle) ? (
                                                <>
                                                    <IFlexer
                                                        paddingTop={10}
                                                    >
                                                        <Box
                                                            alignItems='flex-start'
                                                            justifyContent='flex-start'
                                                        >
                                                            <IIText type='B'>₦{formatNumber(selectedBundle?.topup_value)}</IIText>
                                                            <IIText type='B'>{selectedBundle?.validity}</IIText>
                                                        </Box>
                                                        <IIText type='L'>
                                                            {
                                                                Number(selectedBundle?.data_amount) > 950 ? (Number(selectedBundle?.data_amount) / 950).toFixed(1) + 'GB' : selectedBundle?.data_amount + 'MB'
                                                            }
                                                        </IIText>

                                                    </IFlexer>
                                                </>
                                            ) :
                                                <IIText opacity={0.6} paddingTop={10} paddingBottom={5} type='B'>
                                                    Click Here
                                                </IIText>
                                        }
                                        <Box w='100%' borderBottomWidth={1} borderBottomColor={Colors.DEFAULT} />
                                    </TouchableOpacity>


                                    <IIText type='B' paddingTop={20} color={Colors.DEFAULT} >
                                        You will be charged a fee of ₦{rates?.service_fee?.data_fee}.00 for this {"\n"} transaction
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
                                            containerStyle={styles.container_style}
                                            circleStyle={styles.circleStyle}
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

                                    <View style={{ marginBottom: 40 }}>
                                        <Button
                                            disabled={!Boolean(selectedBundle)}
                                            onPress={handleRecharge}>
                                            CONTINUE
                                        </Button>
                                    </View>
                                </View>
                            </>
                        )
                    }
                </IView>
                <IModal
                    visible={history}
                    setVisible={setShowhistory}
                    h={savedNumber?.length > 2 ? 400 : 250}
                >
                    <ScrollView>
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

                            {
                                !Boolean(savedNumber?.length) && (<IIText paddingTop={10} type='B' size={13} textAlign='center'>No Saved Number</IIText>)
                            }
                           
                        </IView>
                    </ScrollView>
                </IModal>
                <IModal
                    visible={showBundle}
                    setVisible={setShowBundle}
                    h={500}
                >
                    <IView p={30}>
                        <IIText type='L' size={18}>Data Bundles</IIText>
                        <FlatList
                            data={network?.products}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => {
                                        setSelectedBundle(item)
                                        setShowBundle(false)
                                    }}
                                >
                                    <IFlexer
                                        borderBottomWidth={0.4}
                                        borderBottomColor='rgba(0,0,0,0.3)'
                                        paddingTop={10}
                                    >
                                        <Box
                                            alignItems='flex-start'
                                            justifyContent='flex-start'
                                        >
                                            <IIText type='L'>
                                                {
                                                    Number(item?.data_amount) > 950 ? (Number(item?.data_amount) / 950).toFixed(1) + 'GB' : item?.data_amount + 'MB'
                                                }
                                            </IIText>
                                            <IIText type='B'>{item?.validity}</IIText>

                                        </Box>
                                        <IIText type='B'>₦{formatNumber(item?.topup_value)}</IIText>



                                    </IFlexer>
                                </TouchableOpacity>
                            )}
                            keyExtractor={({ item, idx }) => idx}
                            showsVerticalScrollIndicator={false}
                        />
                    </IView>

                </IModal>
                <NetworkModal
                    type={type}
                    data={useData}
                    visible={showNetwork}
                    setVisible={setShowNetwork}
                />
                {rechargeMutation.isLoading && (<Spinner
                    loading={msg}
                />)}
                {isLoading && (<Spinner
                    loading={msg}
                />)}
                <Confirmation
                    visible={showConfirmation}
                    setVisible={setShowConfirmation}
                    data={confirmationData}
                    setConfirmed={setConfirmed}
                    verified={route?.params?.verified}
                    page='Data'
                />
                <Receipt
                    amount={selectedBundle?.topup_value}
                    visible={receipt}
                    setVisible={showReceipt}
                    channel='Wallet'
                    number={phone}
                    data={receiptData}

                />
            </ScrollView>
        </View>
    )
}


const styles = StyleSheet.create({
    img: {
        width: 50,
        height: 50,
        borderRadius: 10
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

export default Data