import React, { useState, useRef, useEffect, useContext } from "react";
import FLexer, { Box, IFlexer, IIcon, IView } from "../../components/Flexer/Flexer";
import { ScrollView, View, StyleSheet, Text, Dimensions, Pressable, TouchableOpacity } from "react-native";
import IText, { IIText } from "../../components/Text/Text";
import { Colors } from "../../components/utils/colors";
import Input from "../../components/Input/Input";
import Tooltip from 'rn-tooltip';
import IModal from "../../components/Modal/Modal";
import Search from "../../components/Search/Search";
import { formatNumber, unFormatNumber } from "../../utils/formatter";
import { Header } from "../../components/Flexer/Flexer";
import Spinner from "../../components/Spinner/Spinner";
import NetworkModal from "../../components/Modal/Network";
import { NetworkContext } from "../../context/NetworkContext";
import { useMutation } from "react-query";
import { useSelector } from "react-redux";
import { selectServices, selectSystemRates } from "../../redux/store/user/user.selector";
import { verifyMeter, getAllPhoneBooks } from "../../services/network";
import SwitchToggle from "react-native-switch-toggle";
import { topupElectricity } from "../../services/network";
import { Button } from "../../components/Flexer/Flexer";
import Confirmation from "../../components/Confirmation/Confirmation";
import Receipt from "../Wallet/Receipt";



const Confirm = ({ data }) => {
    console.log("data", data)
    return (
        <View style={styles.flexer}>
            <View style={styles.flexer_2}>
                <View style={styles.box}>

                    <IText>Product</IText>
                    <IIText type='B' color={Colors.DEFAULT}>
                        {
                            data?.product
                        }
                    </IIText>
                </View>

                <View style={styles.box}>
                    <IText>Customer Name</IText>
                    <IIText type='B' color={Colors.DEFAULT}>
                        {
                            data?.customer_name
                        }
                    </IIText>
                </View>
            </View>
            <View style={styles.flexer_3}>
                <View />
                <View style={styles.box}>
                    <IText styling={{ textAlign: 'right' }} textAlign='right'>Customer Address</IText>
                    <IIText type='B' color={Colors.DEFAULT} >
                        {
                            data?.customer_address
                        }
                    </IIText>
                </View>
            </View>
        </View>


    )
}


const ElectricityPayment = ({ route, navigation }) => {
    const { data, saved_data = {}, product_id = '', service = 'electricity' } = route?.params;
    const [meterNumber, setMeterNumber] = useState('')
    const [whatDoYouWantToDo, setWhatDoYouWantToDo] = useState('Select Meter type');
    const [amount, setAmount] = useState('')
    const tooltipRef = useRef(null);
    const [history, setShowhistory] = useState(false)
    const [search, setSearch] = useState('')
    const [showBouquet, setShowBouquet] = useState(false)
    const services = useSelector(selectServices)
    const rates = useSelector(selectSystemRates)
    const [visible, setVisible] = useState('')
    const [type, setType] = useState('')
    const [msg, setMsg] = useState('')
    const [useData, setData] = useState('')
    const { isConnected } = useContext(NetworkContext)
    const [result, setResult] = useState({})
    const [on, off] = useState(false)
    const [confirmationData, setConfirmationData] = useState('')
    const [SavedElectricity, setSavedElectricity] = useState([])
    const [beneficiaryName, setBeneficiaryName] = useState('')
    const [showConfirmation, setShowConfirmation] = useState(false)
    const [productID, set_product_id] = useState('')
    const [receipt, showReceipt] = useState(false)
    const [receiptData, setReceiptdata] = useState('')
    const [meterDetail, setMeterDetails] = useState({})

    const { isLoading, mutate } = useMutation(verifyMeter, {
        onSuccess: (data) => {
            if (data?.data?.flag == 1) {
                setResult(data?.data?.result)
            } else {
                setType('invalid')
                setVisible(true)
                console.log(data?.data)
            }
        }
    })



    const fetchElectricityList = useMutation(getAllPhoneBooks, {
        onSuccess: data => {
            if (data.status == 200) {
                const filter = data?.data?.filter(element => element.book_type == 'Meter')
                setSavedElectricity(filter)
            }
        }
    })

    console.log('route?.params', route?.params)

    useEffect(() => {
        if (route?.params?.product_id) {
            set_product_id(route?.params?.product_id)
            console.log('product is', route?.params?.product_id)
        }
    }, [route?.params?.product_id])

    const payELectricityMutation = useMutation(topupElectricity, {
        onSuccess: data => {
            console.log("data?.data", data?.data)
            if(data?.data?.flag == 1){

                console.log(data?.data?.result?.reference)
                setReceiptdata({
                    ['Meter Number']: meterNumber,
                    type: 'Electricity Payment',
                    ['Operator name']: data?.data?.result?.operator_name,
                    ['Token']: data?.data?.result?.token
                })
                showReceipt(true)
            } else if(data?.data?.flag == 0){
                setType('invalid')
                setData(data?.data?.message)
                setVisible(true)
            }
        }
    })

    const handleTopupElectricity = () => {
        if (isConnected) {
            setType('internet')
            setVisible(true)
            return;
        }

        setMsg('Toping up your meter, please wait ...')
        const electricity = services?.find(element => element.module_name == 'Electricity')


        const payload = {
            service: 'electricity',
            product_id: productID,
            meter_no: meterNumber,
            amount: unFormatNumber(amount),
            module_id: electricity?.module_id,
            operator_name: result?.product,
            beneficiary: result?.customer_name,
            auto_save: on ? 1 : 0
        }

        console.log("payload", payload)

        payELectricityMutation.mutate(payload)
    }


    useEffect(() => {
        if (meterNumber.length == 11) {
            handleVerify()
        }
    }, [meterNumber])

    useEffect(() => {
        if (isConnected) {
            setType('internet')
            setVisible(true)
            return;
        }

        fetchElectricityList.mutate({ type: 'fetch' })

    }, [])


    useEffect(() => {
        if (Object.keys(saved_data)?.length) {
            setMeterNumber(saved_data?.number)
        }
    }, [saved_data])

    useEffect(() => {
        if (route?.params?.verified) {
            setShowConfirmation(false)
            handleTopupElectricity()
        }
    }, [route?.params?.rand])



    const handleVerify = () => {


        if (isConnected) {
            setType('internet')
            setVisible(true)
            return;
        }

        setMsg('Verifying meter, Please wait....')

        const cable = services?.find(element => element.module_name == 'Electricity')

        const payload = {
            module_id: cable?.module_id,
            smart_no: meterNumber,
            service,
            product: product_id || saved_data?.provider
        }

        console.log(payload)
        mutate(payload)
    }

    const handleConfirm = () => {
        const electricity = services?.find(element => element.module_name == 'Electricity')

        const payload = {
            ['Meter Number']: meterNumber,
            module_id: Number(electricity.module_id),
            amount: amount,
            operator: result.product,
            beneficiary: on ? result?.customer_name : ''
        }

        setConfirmationData(payload)
        setShowConfirmation(true)
    }



    return (
        <>
            <Header>{data || saved_data?.saved_network}</Header>
            <ScrollView style={styles.container}>
                <View>
                    <IIText
                        size={17}
                        type='B'
                        paddingTop={20}

                    >
                        Meter Number</IIText>
                    <View>
                        <Input
                            value={meterNumber}
                            onChange={setMeterNumber}
                            marginTop={-60}
                            keyboardType='number-pad'
                            p="Enter Meter Number"


                        />
                        <View style={{
                            position: 'absolute',
                            right: -10,
                            width: 50,
                            height: 50
                        }}>
                            <TouchableOpacity
                                onPress={() => setShowhistory(true)}
                            >
                                <Box
                                    h={40}
                                    w={40}
                                    r={10}
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
                        </View>
                    </View>

                    {
                        Object.keys(result)?.length ? (<Confirm data={result} />) : null
                    }


                    <>
                        <IIText
                            size={17}
                            type='B'
                            paddingTop={50}

                        >
                            Amount</IIText>
                        <Input
                            value={formatNumber(amount)}
                            onChange={setAmount}
                            marginTop={-60}
                            type='money'
                            keyboardType='number-pad'
                            p='0.00'
                        />
                    </>


                    <IIText type='B' paddingTop={20} color={Colors.DEFAULT} >
                        You will be charged a fee of ₦{rates?.service_fee?.meter_fee}.00 for this {"\n"} transaction
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

                    {/* {
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
                        } */}



                    <Button
                        disabled={(amount.length < 1 && meterNumber.length < 1) ? true : false}
                        onPress={handleConfirm}
                    >
                        Next
                    </Button>

                    <IModal
                        visible={history}
                        setVisible={setShowhistory}
                        h={250}
                    >
                        <IView p={20}>
                            <IView top={40}>
                                <Search
                                    value={search}
                                    onChange={setSearch}
                                    color={Colors.SEARCH}
                                />
                            </IView>

                            {
                                fetchElectricityList.isLoading ? <IIText>Loading Saved Meters</IIText> : (
                                    <>
                                        {
                                            SavedElectricity?.length == 0 ? <IIText>No Saved Meter</IIText> : (
                                                <>
                                                    {
                                                        SavedElectricity?.map((element, idx) => (
                                                            <TouchableOpacity
                                                                onPress={() => {
                                                                    setMeterNumber(element?.beneficiary_number)
                                                                    setShowhistory(false)
                                                                }}
                                                                key={idx}
                                                            >
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
                                                </>
                                            )
                                        }
                                    </>
                                )
                            }
                        </IView>
                    </IModal>

                    <Confirmation
                        visible={showConfirmation}
                        setVisible={setShowConfirmation}
                        data={confirmationData}
                        verified={route?.params?.verified}
                        page='Electricity Payment'
                    />

                    <Receipt
                        amount={amount}
                        visible={receipt}
                        setVisible={showReceipt}
                        channel='Wallet'
                        number={meterNumber}
                        data={receiptData}

                    />

                    <NetworkModal
                        type={type}
                        visible={visible}
                        data={useData}
                        setVisible={setVisible}
                    />
                    {isLoading && (<Spinner
                        loading={msg}
                    />)}
                    {payELectricityMutation.isLoading && (<Spinner
                        loading={msg}
                    />)}

                </View>
            </ScrollView>

        </>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20
    },
    text: { paddingTop: 20, borderBottomWidth: 1, paddingBottom: 20 },
    view: {
        width: 250,
        backgroundColor: Colors.WHITE,
        elevation: 20,
        height: 100,
        // marginRight: 30,
        // marginTop: 20,
        position: 'absolute',
        // display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'flex-start',
        padding: 15
    },
    flexer: {
        width: '100%',
        height: 140,
        borderRadius: 10,
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 10,
        flexWrap: 'wrap',
        backgroundColor: Colors.PRIMARY_FADED
    },
    box: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'flex-end'
    },
    flexer_2: {
        width: '100%',
        borderRadius: 10,
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 10,
        flexWrap: 'wrap',
        backgroundColor: Colors.PRIMARY
    },
    flexer_3: {
        width: '100%',
        borderRadius: 10,
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 10,
        flexWrap: 'wrap',
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

export default ElectricityPayment