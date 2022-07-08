import React, { useState, useEffect, useContext } from 'react';
import ParentComponent from '../../../navigators';
import { Box } from '../../components/Flexer/Flexer';
import { Header } from '../../components/Flexer/Flexer';
import { IIText } from '../../components/Text/Text';
import { ScrollView, TouchableOpacity, StyleSheet, FlatList, View, Dimensions } from 'react-native';
import { IView } from '../../components/Flexer/Flexer';
import { Colors } from '../../components/utils/colors';
import { selectCurrentUser } from '../../redux/store/user/user.selector';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons'
import Animated, { SlideInLeft, Layout } from "react-native-reanimated";
import IModal from '../../components/Modal/Modal';
import Search from '../../components/Search/Search';
import { Confirm } from '../AirtimeOrData/CablePayment';
import { ITextInput } from '../../components/Input/Input';
import { Button } from '../../components/Flexer/Flexer';
import { useMutation } from 'react-query';
import { listOfBanks } from '../../services/network';
import Confirmation from '../../components/Confirmation/Confirmation';
import Receipt from '../Wallet/Receipt';
import NetworkModal from '../../components/Modal/Network';
import { NetworkContext } from '../../context/NetworkContext';
import Spinner from '../../components/Spinner/Spinner';


const ReturningTransfer = ({ route }) => {
    const user = useSelector(selectCurrentUser)
    const [selectedBank, setSelectedBank] = useState('')
    const [banks, setBanks] = useState([])
    const [showBankModal, setShowBankModal] = useState(false)
    const [search, setSearch] = useState('')
    const [amount, setAmount] = useState('')
    const [showConfirmation, setShowConfirmation] = useState(false)
    const [confirmationData, setConfirmationData] = useState('')
    const [receiptData, setReceiptdata] = useState('')
    const [receipt, showReceipt] = useState(false)
    const [msg, setMsg] = useState('')
    const { isConnected } = useContext(NetworkContext)
    const [type, setType] = useState('')
    const [visible, setVisible] = useState(false)
    const [userData, setUserData] = useState('')
    


    const handleConfirm = () => {
        const payload = {
            ['Account Number']: route?.params?.data?.number,
            amount: amount,
            ['Account name']: route?.params?.data?.name,
            ['Bank name']: route?.params?.data?.provider,
            beneficiary: '',
        }
        setConfirmationData(payload)
        setShowConfirmation(true)
    }

    const handleTransferMutation = useMutation(listOfBanks, {
        onSuccess: data => {
            console.log(data?.data)
            if (data?.data?.flag == 1) {
               
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
        if(route?.params?.data?.name){
            setReceiptdata({
                ['Account number']: route?.params?.data?.number,
                type: 'Transfer',
                ['Bank name']: route?.params?.data?.provider,
                ['Account name']: route?.params?.data?.name,
            })

            setUserData({
                name: route?.params?.data?.name,
                number: route?.params?.data?.number,
                provider: route?.params?.data?.provider,
                sortCode: route?.params?.data?.sortCode
            })
        }
    }, [route])


    const handleTransfer = () => {

        if (isConnected) {
            setType('internet')
            setVisible(true)
            return
        }

        setMsg('Making transaction ...')

        const payload = {
            shortcode: userData?.sortCode,
            account_number: userData?.number,
            type: 'transfer',
            amount
        }

        console.log(payload)

        handleTransferMutation.mutate(payload)
    }

    useEffect(() => {
        if (route?.params?.verified) {
            handleTransfer()
        }
    }, [route])


    return (
        <ParentComponent>
            <Header>Transfer from your account</Header>
            <ScrollView>
                <IView p={20}>
                    <Box
                        justifyContent='flex-start'
                        w='100%'
                        h={140}
                        r={10}
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
                                    style={styles.box}
                                >
                                    {/* <Icon name='ios-chevron-back-outline' size={20} color={Colors.PRIMARY} /> */}
                                </TouchableOpacity>
                                <Animated.View
                                    entering={SlideInLeft.delay(100)}
                                >
                                    <TouchableOpacity>
                                        <IIText width={200} textAlign='center' size={18} type='B'>
                                            {userData?.provider}
                                        </IIText>
                                    </TouchableOpacity>
                                </Animated.View>

                                <TouchableOpacity
                                    style={styles.box}
                                >
                                    {/* <Icon name='ios-chevron-forward-outline' size={20} color={Colors.PRIMARY} /> */}
                                </TouchableOpacity>

                            </Box>


                        </Animated.View>


                    </Box>

                    <IView paddingTop={30}>
                        <Confirm
                            name={userData?.name}
                            decoderNumber={userData?.number}
                            usePackage={userData?.provider}
                            type='bank'
                        />
                    </IView>

                    <IView>
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
                                        placeholder='Amount to transfer'
                                    />
                                </View>
                            </Box>

                        </Box>
                        <IIText type='B' paddingTop={20} color={Colors.DEFAULT} >
                            You will be charged a fee of ₦20.00 for this {"\n"} transaction
                        </IIText>

                        <IView marginBottom={100}>
                            <Button
                                disabled={amount.length < 1 ? true : false}
                                onPress={handleConfirm}
                            >
                                Confirm
                            </Button>
                        </IView>


                    </IView>

                </IView>

                <Confirmation
                    visible={showConfirmation}
                    setVisible={setShowConfirmation}
                    data={confirmationData}
                    verified={route?.params?.verified}
                    page='Returning Transfer'
                />
                <Receipt
                    amount={amount}
                    visible={receipt}
                    setVisible={showReceipt}
                    channel='Wallet'
                    number={route?.params?.data?.number}
                    data={receiptData}

                />

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
    }
})

export default ReturningTransfer