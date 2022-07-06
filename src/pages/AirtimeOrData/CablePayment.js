import React, { useState, useRef, useEffect, useContext } from "react";
import FLexer, { Box, IFlexer, IIcon, IView } from "../../components/Flexer/Flexer";
import { ScrollView, View, StyleSheet, Text, FlatList, Dimensions, Pressable, TouchableOpacity } from "react-native";
import IText, { IIText } from "../../components/Text/Text";
import { Colors } from "../../components/utils/colors";
import Input from "../../components/Input/Input";
import Tooltip from 'rn-tooltip';
import { NetworkContext } from "../../context/NetworkContext";
import IModal from "../../components/Modal/Modal";
import Search from "../../components/Search/Search";
import { formatNumber, unFormatNumber } from "../../utils/formatter";
import { Header } from "../../components/Flexer/Flexer";
import SwitchToggle from "react-native-switch-toggle";
import Spinner from '../../components/Spinner/Spinner'
import NetworkModal from "../../components/Modal/Network";
import { useMutation } from "react-query";
import { verifyMultiChoice, verifyStarTimes, getCables, getStartimes, getAllPhoneBooks } from "../../services/network";
import { useSelector } from "react-redux";
import { topupCable } from "../../services/network";
import { Button } from "../../components/Flexer/Flexer";
import { selectServices, selectSystemRates, selectCurrentUser } from "../../redux/store/user/user.selector";
import axios from "axios";
import Receipt from "../Wallet/Receipt";
import { verifyStartimes } from "../../services/network";
import Confirmation from "../../components/Confirmation/Confirmation";

export const Confirm = ({ name, decoderNumber, usePackage, type }) => {
    const user = useSelector(selectCurrentUser)
    return (
        <View style={styles.flexer}>
            <View style={styles.flexer_2}>
                <View style={styles.box}>

                    <IText>{
                        type == 'bank' ? 'Transfer from' : 'Decoder Number'
                    }</IText>
                    <IIText type='B' color={Colors.DEFAULT}>
                        {
                            type == 'bank'
                            ? (
                                <>
                                    {user?.account_number}
                                </>
                            )
                            :
                            {decoderNumber}
                        }
                    </IIText>
                </View>

                <View style={styles.box}>
                    <IText>
                        {
                            type == 'bank'
                                ? 'Beneficiary'
                                : 'Customer Name'
                        }
                    </IText>
                    <IIText width={170} textAlign='right' type='B' color={Colors.DEFAULT}>
                        {
                            type == 'bank'
                                ? (<>
                                    {name}{"\n"}{decoderNumber}
                                </>)

                                : { name }
                        }
                    </IIText>
                </View>
            </View>
            <View style={styles.flexer_3}>
                <View />
                <View style={styles.box}>
                    <IText styling={{ textAlign: 'right' }} textAlign='right'>
                        {
                            type == 'bank'
                                ? 'Bank'
                                : 'Current Package'
                        }
                    </IText>
                    <IIText type='B' color={Colors.DEFAULT} >{usePackage}</IIText>
                </View>
            </View>
        </View>


    )
}


const CablesPayment = ({ route }) => {
    const { data, saved_data = {}, product_id = '' } = route?.params;
    const [meterNumber, setMeterNumber] = useState('')
    const [whatDoYouWantToDo, setWhatDoYouWantToDo] = useState('Renew my current Bouquet');
    const [amount, setAmount] = useState('')
    const tooltipRef = useRef(null);
    const [history, setShowhistory] = useState(false)
    const [search, setSearch] = useState('')
    const [bouquet, setBouquet] = useState('')
    const [showBouquet, setShowBouquet] = useState(false)
    const [on, off] = useState(false)
    const [fetchData, setFetchData] = useState(false)

    const [visible, setVisible] = useState(false)
    const [type, setType] = useState('')
    const [useData, setUseData] = useState('')
    const [msg, setMsg] = useState('')
    const services = useSelector(selectServices)
    const [card, setCard] = useState('')
    const [cabledata, setcableData] = useState([])
    const [startimesPackages, setStarTimesPackages] = useState([])
    const [savedCables, setSavedCables] = useState([])
    const [isLoadingCables, setIsLoadingCables] = useState(false)
    const [confirmationData, setConfirmationData] = useState('')
    const [showConfirmation, setShowConfirmation] = useState(false)
    const [productID, set_product_id] = useState('')
    const [receipt, showReceipt] = useState(false)
    const [receiptData, setReceiptdata] = useState({})
    const [productType, setProductType] = useState('')
    const [startTimesID, setStarTimesId] = useState('')
    const [StartTimeswhatDoYouWantToDo, setStartTimesWhatDoYouWantToDo] = useState('Renew my current Bouquet')


    const { isConnected } = useContext(NetworkContext)

    const rates = useSelector(selectSystemRates)


    const { isLoading, mutate } = useMutation(verifyMultiChoice, {
        onSuccess: data => {
            console.log('dstv', data?.data)
            if (data?.data?.flag == 1) {
                setCard(data?.data?.result)
                setAmount(data?.data?.result?.total_amount)
            } else {
                setType('invalid')
                setUseData(data?.data?.message)
                setVisible(true)
            }
        }
    })

    const StarTimesMutation = useMutation(verifyStartimes, {
        onSuccess: data => {
            console.log(data?.data)
            if (data?.data?.flag == 1) {
                setCard(data?.data?.data)
                setAmount(data?.data?.data?.due_balance)
            } else {
                setType('invalid')
                setUseData(data?.data?.message)
                setVisible(true)
            }
        }
    })


    const getCableMutation = useMutation(getCables, {
        onSuccess: data => {
            console.log(data?.data)
            if (data?.data?.flag == 1) {
                setcableData(data?.data?.result)
            } else {
                setType('invalid')
                setVisible(true)
            }
        }
    })

    const getStartimesPackages = useMutation(getStartimes, {
        onSuccess: data => {
            console.log(data?.data)
            if (data?.data?.flag == 1) {

                // setcableData(data?.data?.result)
            } else {
                setType('invalid')
                setVisible(true)
            }
        }
    })

    const payCablesMutation = useMutation(topupCable, {
        onSuccess: data => {
            console.log("data?.data", data?.data)
            if (data?.data?.flag == 1) {

                console.log(data?.data?.result?.reference)
                setReceiptdata({
                    ['Cable Number']: meterNumber,
                    type: 'Cable Payment',
                    ['Operator name']: data?.data?.result?.operator_name,
                })
                showReceipt(true)
            } else if (data?.data?.flag == 0) {
                setType('invalid')
                setUseData(data?.data?.message)
                setVisible(true)
            }
        }
    })


    const savedCableList = useMutation(getAllPhoneBooks, {
        onSuccess: data => {
            if (data.status == 200) {
                const filter = data?.data?.filter(element => element.book_type == 'Cable')
                setSavedCables(filter)
            }
        }
    })


    useEffect(() => {
        setProductType(data)
    }, [])

    useEffect(() => {
        if (data == 'StarTimes' || saved_data?.network == 'StarTimes') {
            console.log('this is startimes')


        }
    }, [])

    useEffect(() => {

        const multichoice = ['GOTV', 'DSTV']
        if (data == 'StarTimes' || saved_data?.network == 'StarTimes') {
            if (meterNumber.length == 11) {
                // handleVerifyStarTimes()
                handleStartimes()
            }
        } else if (
            multichoice.includes(data) ||
            multichoice.includes(saved_data?.network)) {
            if (meterNumber.length == 10) {
                handleVerify()
            }
        }

    }, [meterNumber])


    useEffect(() => {
        handleCablesFetch()
    }, [])

    const handleCablesFetch = async () => {
        if (isConnected) {
            setType('internet')
            setVisible(true)
            return;
        }

        savedCableList.mutate({ type: 'fetch' })
    }





    const handleFetchStarTimes = async () => {
        if (isConnected) {
            setType('internet')
            setVisible(true)
            return;
        }

        setMsg('Getting providers, Please wait....')


        const cable = services?.find(element => element.module_name == 'TV Cable')

        const cables = await getCables({ module_id: cable?.module_id })

        const useProductID = cables?.data?.result?.find(element => element.product_name == 'StarTimes')


        const payload = {
            module_id: cable?.module_id,
            smart_no: meterNumber,
            service_id: 'dstv',
            product_id: product_id


        }

    }


    useEffect(() => {
        if (Object.keys(saved_data)?.length) {
            setMeterNumber(saved_data?.number)
        }
    }, [saved_data])

    useEffect(() => {
        if (route?.params?.product_id) {
            // set_product_id(route?.params?.product_id)
        }
    }, [route?.params?.product_id])



    const handleConfirm = () => {
        const cable = services?.find(element => element.module_name == 'TV Cable')

        const payload = {
            ['Meter Number']: meterNumber,
            module_id: Number(cable.module_id),
            amount: amount,
            operator: card?.current_plan || card?.primary_package,
            beneficiary: on ? card?.name || card?.customer_name : ''
        }

        setConfirmationData(payload)
        setShowConfirmation(true)
    }

    const handleVerify = () => {


        if (isConnected) {
            setType('internet')
            setVisible(true)
            return;
        }

        setMsg('Verifying your Decoder, Please wait....')


        const cable = services?.find(element => element.module_name == 'TV Cable')

        const payload = {
            module_id: cable?.module_id,
            smart_no: meterNumber
        }

        console.log(payload)
        mutate(payload)

    }

    const handleTopupCable = () => {
        if (isConnected) {
            setType('internet')
            setVisible(true)
            return;
        }

        setMsg('Toping up your decoder, please wait ...')
        const cable = services?.find(element => element.module_name == 'TV Cable')
        // is_multichoice: false, 
        // smart_no:234557343, 
        // bouquet_type: "renew", 
        // plan_id;354545, 
        // startimes_id:3232,
        //  module_id:7

        const startimesPayload = {
            smart_no: meterNumber,
            is_multichoice: false,
            bouquet_type: 'renew',
            plan_id: productID,
            module_id: cable?.module_id,
            startimes_id: startTimesID,
            decoder_type: "startimes",

        }

        const renewPayload = {
            smart_no: meterNumber,
            module_id: cable?.module_id,
            decoder_type: "multchoic",
            is_multichoice: true,
            bouquet_type: whatDoYouWantToDo == 'Renew my current Bouquet' ? 'renew' : "change",

        }



        const changePayload = {
            plan_id: productID,
            smart_no: meterNumber,
            package: 'package',
            module_id: cable?.module_id,
            decoder_type: "multchoic",
            is_multichoice: true,
            bouquet_type: whatDoYouWantToDo == 'Renew my current Bouquet' ? 'renew' : "change",

        }

        if (productType == 'StarTimes') {
            payCablesMutation.mutate(startimesPayload)
        } else {
            if (whatDoYouWantToDo == 'Renew my current Bouquet') {
                payCablesMutation.mutate(renewPayload)
            } else {
                payCablesMutation.mutate(changePayload)
            }
        }
    }


    useEffect(() => {
        if (route?.params?.verified) {
            setShowConfirmation(false)
            handleTopupCable()
        }
    }, [route?.params?.verified])

    const handleStartimes = async () => {
        if (isConnected) {
            setType('internet')
            setVisible(true)
            return;
        }

        setMsg('Verifying your Decoder, Please wait....')
        const cable = services?.find(element => element.module_name == 'TV Cable')

        const cables = await getCables({ module_id: cable?.module_id })
        const useProductID = cables?.data?.result?.find(element => element.product_name == 'StarTimes')



        const payload = {
            module_id: cable?.module_id,
            smart_no: meterNumber,
            product: useProductID?.product_id,
        }

        StarTimesMutation.mutate(payload)
    }


    const handleVerifyStarTimes = async () => {
        if (isConnected) {
            setType('internet')
            setVisible(true)
            return;
        }

        setMsg('Verifying your Decoder, Please wait....')



        const cable = services?.find(element => element.module_name == 'TV Cable')


        setIsLoadingCables(true)
        const cables = await getCables({ module_id: cable?.module_id })

        const useProductID = cables?.data?.result?.find(element => element.product_name == 'StarTimes')

        setIsLoadingCables(false)

        const getPackagesPayload = {
            service_id: 'dstv',
            product_id: useProductID?.product_id,
            module_id: cable?.module_id
        }


        if (cables?.status == 200) {
            const startTimesPackages = await getStartimes(getPackagesPayload)

            setStarTimesPackages(startTimesPackages?.data?.data?.products)
        }

        const payload = {
            module_id: cable?.module_id,
            smart_no: meterNumber,
            service: 'dstv',
            product: product_id || useProductID?.product_id


        }

        console.log(payload)


        StarTimesMutation.mutate(payload)
    }





    return (
        <>
            <Header>{productType || saved_data?.network}</Header>
            <ScrollView style={styles.container}>
                <View>
                    <IIText
                        size={17}
                        type='B'
                        paddingTop={20}

                    >
                        Decoder Number</IIText>
                    <View>
                        <Input
                            value={meterNumber}
                            onChange={setMeterNumber}
                            marginTop={-60}
                            keyboardType='number-pad'
                            p='Decoder Number'

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
                        Boolean(card) && (
                            <Confirm
                                decoderNumber={meterNumber}
                                name={card?.name || card?.customer_name}
                                usePackage={card?.current_plan || card?.primary_package}
                            />
                        )
                    }

                    {
                        productType == 'StarTimes' || saved_data?.network == 'StarTimes' ?
                            (
                                <>
                                    <>
                                        {/* <IIText
                                            size={17}
                                            type='B'
                                            paddingTop={20}
                                            paddingBottom={20}

                                        >
                                            What do you want to do?</IIText>
                                        <Tooltip
                                            withPointer={false}
                                            ref={tooltipRef}
                                            backgroundColor="rgba(0,0,0,0)"
                                            containerStyle={{
                                                width: 300,
                                                marginLeft: -100,

                                            }}
                                            popover={
                                                <View style={styles.view}>
                                                    {
                                                        ['Renew my current Bouquet', 'Change Bouquet']
                                                            .map((element, idx) => (
                                                                <Pressable
                                                                    key={idx}
                                                                    onPress={() => {
                                                                        setStartTimesWhatDoYouWantToDo(element)
                                                                        if (element == 'Change Bouquet') {
                                                                            setAmount('')
                                                                        }
                                                                        tooltipRef.current.toggleTooltip();
                                                                    }}
                                                                >
                                                                    <IIText type='B'>{element}</IIText>
                                                                </Pressable>
                                                            ))
                                                    }


                                                </View>
                                            }
                                        >
                                            <IFlexer w='100%'>
                                                <IIText type='B' opacity={0.4}>{StartTimeswhatDoYouWantToDo}</IIText>
                                                <IIcon
                                                    name='ios-chevron-down-sharp'
                                                    size={20}
                                                    color={Colors.SEARCH}
                                                />
                                            </IFlexer>
                                        </Tooltip>

                                        <Box
                                            w='100%'
                                            borderBottomWidth={1}
                                        /> */}
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
                                            p='Enter Amount'
                                        />

                                        <IView top={30}>
                                            <Pressable
                                                onPress={() => {
                                                    setShowBouquet(true)
                                                }}
                                            >
                                                <IIText type='B' >
                                                    {
                                                        bouquet.length ? bouquet : 'Select a Bouquet'
                                                    }
                                                </IIText>
                                                <Box
                                                    w='100%'
                                                    borderBottomWidth={1}
                                                />
                                            </Pressable>

                                        </IView>

                                    </>
                                </>
                            )

                            :

                            (

                                <>

                                    <IIText
                                        size={17}
                                        type='B'
                                        paddingTop={20}
                                        paddingBottom={20}

                                    >
                                        What do you want to do?</IIText>
                                    <Tooltip
                                        withPointer={false}
                                        ref={tooltipRef}
                                        backgroundColor="rgba(0,0,0,0)"
                                        containerStyle={{
                                            width: 300,
                                            marginLeft: -100,

                                        }}
                                        popover={
                                            <View style={styles.view}>
                                                {
                                                    ['Renew my current Bouquet', 'Change Bouquet']
                                                        .map((element, idx) => (
                                                            <Pressable
                                                                key={idx}
                                                                onPress={() => {
                                                                    setWhatDoYouWantToDo(element)
                                                                    if (element == 'Change Bouquet') {
                                                                        setAmount('')
                                                                    }
                                                                    tooltipRef.current.toggleTooltip();
                                                                }}
                                                            >
                                                                <IIText type='B'>{element}</IIText>
                                                            </Pressable>
                                                        ))
                                                }


                                            </View>
                                        }
                                    >
                                        <IFlexer w='100%'>
                                            <IIText type='B' opacity={0.4}>{whatDoYouWantToDo}</IIText>
                                            <IIcon
                                                name='ios-chevron-down-sharp'
                                                size={20}
                                                color={Colors.SEARCH}
                                            />
                                        </IFlexer>
                                    </Tooltip>

                                    <Box
                                        w='100%'
                                        borderBottomWidth={1}
                                    />



                                    {
                                        whatDoYouWantToDo == 'Renew my current Bouquet' ?
                                            (
                                                <>
                                                    <IIText
                                                        size={17}
                                                        type='B'
                                                        paddingTop={50}

                                                    >
                                                        Amount</IIText>
                                                    <Input
                                                        value={formatNumber(Math.floor(Number(amount)))}
                                                        onChange={setAmount}
                                                        marginTop={-60}
                                                        type='money'
                                                        keyboardType='number-pad'
                                                        p='0.00'
                                                    />
                                                </>
                                            ) :

                                            // <ChangeBouquet upgrades={card?.upgrades} />

                                            (
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
                                                    />

                                                    <IView top={30}>
                                                        <Pressable
                                                            onPress={() => {
                                                                setShowBouquet(true)
                                                            }}
                                                        >
                                                            <IIText type='B' >
                                                                {
                                                                    bouquet.length ? bouquet : 'Select a Bouquet'
                                                                }
                                                            </IIText>
                                                            <Box
                                                                w='100%'
                                                                borderBottomWidth={1}
                                                            />
                                                        </Pressable>

                                                    </IView>

                                                </>
                                            )
                                    }
                                </>
                            )
                    }

                    <IIText type='B' paddingTop={20} color={Colors.DEFAULT} >
                        You will be charged a fee of ₦{rates?.service_fee?.cable_fee}.00 for this {"\n"} transaction
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

                    <View
                        style={{
                            marginBottom: 40
                        }}
                    >
                        <Button
                            onPress={handleConfirm}
                        >
                            Next
                        </Button>
                    </View>

                    <IModal
                        visible={history}
                        setVisible={setShowhistory}
                        h={savedCables?.length > 2 ? 500 : 250}
                    >
                        <IView p={20}>
                            <IView top={40}>
                                <Search
                                    value={search}
                                    onChange={setSearch}
                                    color={Colors.SEARCH}
                                />
                            </IView>

                            <ScrollView>
                                {
                                    savedCableList.isLoading ? <IIText paddingTop={10} textAlign='center' type='B'>Loading Saved cable list</IIText> : (
                                        <>
                                            {
                                                savedCables?.length == 0 ? <IIText paddingTop={10} textAlign='center' type='B'>No Saved Cable</IIText> : (<>
                                                    {
                                                        data == 'StarTimes' || saved_data?.network == 'StarTimes'
                                                            ? (

                                                                <>
                                                                    {
                                                                        savedCables?.filter(a => a?.operator_name == 'StarTimes')?.map((element, idx) => (
                                                                            <TouchableOpacity
                                                                                onPress={() => {
                                                                                    setMeterNumber(element?.beneficiary_number)
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
                                                                </>
                                                            )
                                                            : (<>
                                                                {
                                                                    savedCables?.filter(a => a?.operator_name !== 'StarTimes')?.map((element, idx) => (
                                                                        <TouchableOpacity
                                                                            onPress={() => {
                                                                                setMeterNumber(element?.beneficiary_number)
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
                                                            </>)
                                                    }

                                                </>)
                                            }
                                        </>)
                                }
                            </ScrollView>
                        </IView>
                    </IModal>


                    <IModal
                        visible={showBouquet}
                        setVisible={setShowBouquet}
                        h='60%'
                    >
                        <IView p={30} top={40}>
                            {

                                <FlatList

                                    data={card?.upgrades}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            onPress={() => {
                                                console.log(item)
                                                set_product_id(item?.product_id)
                                                setBouquet(item?.description)
                                                setAmount(item?.topup_value)
                                                setShowBouquet(false)
                                            }}
                                        >
                                            <IFlexer
                                                alignItems='flex-start'
                                                borderBottomWidth={0.2}
                                                borderBottomColor='rgba(0,0,0,0.3)'
                                                paddingTop={20}
                                            >
                                                <IIText size={13} type='B'>{item?.description}</IIText>
                                                <IText>₦{formatNumber(item?.topup_value)}</IText>
                                            </IFlexer>
                                        </TouchableOpacity>
                                    )}
                                    showsVerticalScrollIndicator={false}
                                    keyExtractor={({ item, idx }) => idx}
                                />

                            }

                            {
                                (data == 'StarTimes' || saved_data?.network == 'StarTimes') ? (
                                    <>
                                        <FlatList
                                            data={card?.packages || []}
                                            renderItem={({ item }) => (
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        set_product_id(item?.code)
                                                        setBouquet(item?.name)
                                                        setAmount(item?.topup_value)
                                                        setShowBouquet(false)
                                                    }}
                                                >
                                                    <IFlexer
                                                        alignItems='flex-start'
                                                        borderBottomWidth={0.2}
                                                        borderBottomColor='rgba(0,0,0,0.3)'
                                                        paddingTop={20}
                                                    >
                                                        <IIText size={13} type='B'>{item?.name}</IIText>
                                                        <IText>₦{formatNumber(item?.topup_value)}</IText>
                                                    </IFlexer>
                                                </TouchableOpacity>
                                            )}

                                            showsVerticalScrollIndicator={false}
                                            keyExtractor={({ item, idx }) => idx}
                                        />
                                    </>
                                ) : null
                            }
                        </IView>
                    </IModal>
                </View>
            </ScrollView>

            {
                fetchData && (
                    <Spinner
                        loading='Cables'
                    />
                )
            }
            <Confirmation
                visible={showConfirmation}
                setVisible={setShowConfirmation}
                data={confirmationData}
                verified={route?.params?.verified}
                page='Cables Payment'
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
            {
                isLoading && (<Spinner
                    loading={msg}
                />)
            }
            {
                StarTimesMutation.isLoading && (<Spinner
                    loading={msg}
                />)
            }
            {
                getCableMutation.isLoading && (<Spinner
                    loading={msg}
                />)
            }
            {
                isLoadingCables && (<Spinner
                    loading='Loading StartTimes bundles'
                />)
            }
            {
                payCablesMutation.isLoading && (<Spinner
                    loading='Subscribing your bouquet'
                />)
            }

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
        // marginLeft: 300,
        // marginTop: 20,
        position: 'absolute',
        // display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'flex-start',
        padding: 15
    },
    flexer: {
        width: '100%',
        height: 150,
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

export default CablesPayment