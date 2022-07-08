import React, { useState, useEffect, useContext } from "react";
import { Box } from "../../components/Flexer/Flexer";
import { IIText } from "../../components/Text/Text";
import { IView } from "../../components/Flexer/Flexer";
import ParentComponent from "../../../navigators";
import { Header } from "../../components/Flexer/Flexer";
import { ScrollView, TouchableOpacity, StyleSheet, View, Dimensions, FlatList, ViewBase } from "react-native";
import { Colors } from "../../components/utils/colors";
import { useSelector } from "react-redux";
import Icon from 'react-native-vector-icons/Ionicons'
import { selectCurrentUser } from "../../redux/store/user/user.selector";
import { ITextInput } from "../../components/Input/Input";
import { Button } from "../../components/Flexer/Flexer";
import { useMutation } from "react-query";
import { listOfBanks } from "../../services/network";
import Spinner from "../../components/Spinner/Spinner";
import { NetworkContext } from "../../context/NetworkContext";
import NetworkModal from "../../components/Modal/Network";
import Animated, { SlideInLeft, Layout } from "react-native-reanimated";
import IModal from "../../components/Modal/Modal";
import Search from "../../components/Search/Search";
import { Confirm } from "../AirtimeOrData/CablePayment";
import Confirmation from "../../components/Confirmation/Confirmation";
import SwitchToggle from "react-native-switch-toggle";
import Receipt from "../Wallet/Receipt";
import AccountModal from "../../components/Modal/AccountModal";
import { selectSystemRates } from "../../redux/store/user/user.selector";


const TransferToOtherBanks = ({ route }) => {
    const user = useSelector(selectCurrentUser)
    const [msg, setMsg] = useState('')
    const [type, setType] = useState('')
    const [data, setData] = useState('')
    const [visible, setVisible] = useState(false)
    const [account_number, setAccountNumber] = useState('')
    const [banks, setBanks] = useState([''])
    const [showBankModal, setShowBankModal] = useState(false)
    const [selectedBank, setSelectedBank] = useState('')
    const [search, setSearch] = useState('')
    const [verifiedBank, setVerifiedBank] = useState('')
    const [showConfirmation, setShowConfirmation] = useState(false)
    const [confirmationData, setConfirmationData] = useState('')
    const [amount, setAmount] = useState('')
    const [on, off] = useState(false)
    const [receipt, showReceipt] = useState(false)
    const [receiptData, setReceiptdata] = useState({})
    const [index, setIndex] = useState(0)
    const rates = useSelector(selectSystemRates)
    const [price, setPrice] = useState(0)

    console.log('rates', rates)


    const { isConnected } = useContext(NetworkContext)


    const { isLoading, mutate } = useMutation(listOfBanks, {
        onSuccess: data => {
            if (data?.data?.flag == 1) {
                setBanks(data?.data?.result?.banks)
            } else {
                setType('invalid')
                setData(data?.data?.message)
                setVisible(true)
            }
        }
    })

    const handleVerifyMutation = useMutation(listOfBanks, {
        onSuccess: data => {
            console.log(data?.data)
            if (data?.data?.["flag"] == 1) {
                setVerifiedBank(data?.data?.result)
            } else {
                setType('invalid')
                setData(data?.data?.message)
                setVisible(true)
            }
        }
    })

    const handleTransferMutation = useMutation(listOfBanks, {
        onSuccess: data => {
            console.log(data?.data)
            if (data?.data?.flag == 1) {
                setReceiptdata({
                    ['Account number']: account_number,
                    type: 'Transfer',
                    ['Bank name']: verifiedBank?.target_bankName,
                    ['Account name']: verifiedBank?.target_accountName,
                    ['Account number']: verifiedBank?.target_accountNumber
                })
                showReceipt(true)
                // setVerifiedBank(data?.data?.result)
            } else {
                setType('invalid')
                setData(data?.data?.message)
                setVisible(true)
            }
        }
    })

    useEffect(() => {
        setPrice(((Number(rates?.service_fee?.other_bank_transfer_fee) / 100 ) * Number(amount) + Number(Math.floor(verifiedBank?.transaction_fee))))
    }, [amount])


    useEffect(() => {
        if (account_number.length == 10) {
            handleVerify()
        }
    }, [account_number])

    const handleVerify = () => {
        if (isConnected) {
            setType('internet')
            setVisible(true)
            return
        }

        setMsg('Verifying account, please wait...')
        const payload = {
            shortcode: selectedBank?.sortCode || banks[index]?.sortCode,
            account_number: account_number,
            type: 'validate'
        }

        handleVerifyMutation.mutate(payload)
    }

    const handleFetchBanks = () => {
        if (isConnected) {
            setType('internet')
            setVisible(true)
            return
        }

        if (user?.account_type == 'Personal') {
            return
        }

        setMsg('Loading details, please wait...')
        const payload = {
            type: 'banks'
        }

        mutate(payload)
    }


    useEffect(() => {
        handleFetchBanks()
    }, [])

    const handleConfirm = () => {
        const payload = {
            ['Account Number']: account_number,
            amount: amount,
            ['Account name']: verifiedBank?.target_accountName,
            ['Bank name']: verifiedBank?.target_bankName,
            beneficiary: on ? verifiedBank?.target_accountName : '',
        }
        setConfirmationData(payload)
        setShowConfirmation(true)
    }

    const handleTransfer = () => {

        if (isConnected) {
            setType('internet')
            setVisible(true)
            return
        }

        setMsg('Making transaction ...')

        const payload = {
            shortcode: selectedBank?.sortCode || banks[index]?.sortCode,
            account_number,
            type: 'transfer',
            amount,
            transfer_to_other_bank_fee: price
        }

        console.log("payload", payload)
        handleTransferMutation.mutate(payload)
    }

    useEffect(() => {
        if (route?.params?.verified) {
            handleTransfer()
        }
    }, [route])


    return (
        <ParentComponent>
            <Header>Transfer to other Banks</Header>
            <ScrollView>
                <IView p={20}>



                    <Box
                        justifyContent='flex-start'
                        w='100%'
                        h={140}
                        r={10}
                        marginTop={40}
                        backgroundColor={Colors.WHITE}
                        elevation={0.7}
                    >
                        <Box
                            h={50}
                            w='100%'
                            borderTopRightRadius={10}
                            borderTopLeftRadius={10}
                            backgroundColor={Colors.ASH}
                            alignItems='flex-start'
                        >
                            <IIText type='B' paddingLeft={20}>Transfer To:</IIText>
                        </Box>
                        <Animated.View
                            layout={Layout.springify()}
                            style={{
                                // paddingLeft: 20
                            }}
                        >
                            <Box
                                w='100%'
                                flexDirection='row'
                                justifyContent='space-between'
                                paddingLeft={20}
                                marginTop={20}
                                alignItems='center'
                            >
                                <TouchableOpacity
                                    onPress={() => {
                                        if (index == 0) {
                                            setIndex(0)
                                        } else {
                                            setIndex(prevState => prevState - 1)
                                        }
                                    }}
                                    style={styles.box}
                                >
                                    <Icon name='ios-chevron-back-outline' size={20} color={Colors.PRIMARY} />
                                </TouchableOpacity>
                                <Animated.View
                                    entering={SlideInLeft.delay(100)}
                                >
                                    <TouchableOpacity
                                        onPress={() => setShowBankModal(true)}
                                    >
                                        <IIText width={200} textAlign='center' size={18} type='B'>
                                            {selectedBank?.name ? selectedBank?.name : banks[index]?.name}
                                        </IIText>
                                    </TouchableOpacity>
                                </Animated.View>

                                <TouchableOpacity
                                    onPress={() => {
                                        if (index == banks?.length) {
                                            setIndex(banks?.length)
                                        } else {
                                            setIndex(prevState => prevState + 1)
                                        }
                                    }}
                                    style={styles.box}
                                >
                                    <Icon name='ios-chevron-forward-outline' size={20} color={Colors.PRIMARY} />
                                </TouchableOpacity>

                            </Box>
                        </Animated.View>
                    </Box>

                    <Box
                        justifyContent='flex-start'
                        w='100%'
                        h={120}
                        r={10}
                        marginTop={40}
                        backgroundColor={Colors.WHITE}
                        elevation={0.7}
                    >
                        <Box
                            h={50}
                            w='100%'
                            borderTopRightRadius={10}
                            borderTopLeftRadius={10}
                            backgroundColor={Colors.ASH}
                            alignItems='flex-start'
                        >
                            <IIText type='B' paddingLeft={20}>Account Number:</IIText>
                        </Box>
                        <Box

                        >
                            <View style={{
                                width: Dimensions.get('window').width - 70,
                                marginTop: -30
                            }}>
                                <ITextInput
                                    value={account_number}
                                    onChangeText={setAccountNumber}
                                    placeholder='Account Number'
                                    keyboardType='numeric'
                                />
                            </View>
                        </Box>
                    </Box>

                    <Animated.View
                        layout={Layout.springify()}
                        style={{
                            marginTop: 30
                        }}
                    >
                        {
                            Boolean(verifiedBank) && (
                                <>
                                    <Animated.View
                                        entering={SlideInLeft.delay(100)}
                                    >
                                        <Confirm
                                            name={verifiedBank?.target_accountName}
                                            decoderNumber={verifiedBank?.target_accountNumber}
                                            usePackage={verifiedBank?.target_bankName}
                                            type='bank'
                                        />
                                    </Animated.View>

                                    <Box
                                        justifyContent='flex-start'
                                        w='100%'
                                        h={120}
                                        r={10}
                                        marginTop={40}
                                        backgroundColor={Colors.WHITE}
                                        elevation={0.7}
                                    >
                                        <Box
                                            h={50}
                                            w='100%'
                                            borderTopRightRadius={10}
                                            borderTopLeftRadius={10}
                                            backgroundColor={Colors.ASH}
                                            alignItems='flex-start'
                                        >
                                            <IIText type='B' paddingLeft={20}>Amount:</IIText>
                                        </Box>
                                        <Box

                                        >
                                            <View style={{
                                                width: Dimensions.get('window').width - 70,
                                                marginTop: -30
                                            }}>
                                                <ITextInput
                                                    value={amount}
                                                    onChangeText={setAmount}
                                                    keyboardType='numeric'
                                                    placeholder='Amount to transfer'
                                                />
                                            </View>
                                        </Box>
                                    </Box>

                                    <IIText type='B' paddingTop={20} color={Colors.DEFAULT} >
                                        You will be charged a fee of ₦{ 

                                        price
                                        } for this {"\n"} transaction
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
                                </>
                            )
                        }


                    </Animated.View>




                    <View
                        style={{
                            marginBottom: 80
                        }}
                    >
                        <Button
                            disabled={amount?.length < 1 ? true : false}
                            onPress={handleConfirm}
                        >
                            Confirm
                        </Button>
                    </View>

                </IView>

                <IModal
                    visible={showBankModal}
                    setVisible={setShowBankModal}
                    h={500}
                >
                    <IView
                        p={20}
                        paddingTop={50}

                    >
                        <Search
                            value={search}
                            onChangeText={setSearch}
                            placeholder='Search bank'
                        />
                    </IView>
                    <ScrollView>
                        <IView
                            p={30}
                        >
                            <IIText paddingTop={-30} size={19} type='L'>Banks</IIText>
                            <FlatList
                                data={banks?.filter(element => element?.name?.toLowerCase()?.includes(search?.toLowerCase()))}
                                renderItem={({ item, index }) => (
                                    <TouchableOpacity
                                        onPress={() => {
                                            setSelectedBank(item)
                                            setShowBankModal(false)
                                        }}
                                    >
                                        <Box

                                            flexDirection='row'
                                            justifyContent='flex-start'
                                            alignItems='center'
                                            w='100%'
                                            marginBottom={15}
                                        >
                                            <IIText type='L'>{Number(index) + 1}. </IIText>
                                            <IIText type='B'>{item?.name}</IIText>
                                        </Box>
                                    </TouchableOpacity>
                                )}
                                showsVerticalScrollIndicator={false}
                                keyExtractor={({ item, idx }) => idx}
                            />


                        </IView>
                    </ScrollView>

                </IModal>

                <Confirmation
                    visible={showConfirmation}
                    setVisible={setShowConfirmation}
                    data={confirmationData}
                    verified={route?.params?.verified}
                    page='Transfer to Other Banks'
                />
                <Receipt
                    amount={amount}
                    visible={receipt}
                    setVisible={showReceipt}
                    channel='Wallet'
                    number={account_number}
                    data={receiptData}

                />
                <NetworkModal
                    type={type}
                    visible={visible}
                    data={data}
                    setVisible={setVisible}
                />
                {
                    user?.account_type == 'Personal' && (
                        <AccountModal />
                    )
                }
                {isLoading && (<Spinner
                    loading={msg}
                />)}
                {handleVerifyMutation.isLoading && (<Spinner
                    loading={msg}
                />)}
                {handleTransferMutation.isLoading && (<Spinner
                    loading={msg}
                />)}
            </ScrollView>
        </ParentComponent>
    )
}



const styles = StyleSheet.create({
    box: {
        width: 40,
        height: 40,
        backgroundColor: Colors.WHITE,
        elevation: 5,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20
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

export default TransferToOtherBanks