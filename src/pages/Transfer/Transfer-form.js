import React, { useState, useEffect, useContext } from "react";
import { IIText } from "../../components/Text/Text";
import FormView from "../../components/FormView/FormView";
import { Header } from "../../components/Flexer/Flexer";
import { Box } from "../../components/Flexer/Flexer";
import * as Yup from 'yup'
import { useMutation } from "react-query";
import NetworkModal from "../../components/Modal/Network";
import { NetworkContext } from "../../context/NetworkContext";
import Spinner from "../../components/Spinner/Spinner";
import { Formik, Field, useField } from "formik";
import ParentComponent from "../../../navigators";
import { ScrollView, View, TouchableOpacity, StyleSheet } from "react-native";
import { ITextInput } from "../../components/Input/Input";
import { Button } from "../../components/Flexer/Flexer";
import { verifyAndTransfer } from "../../services/network";
import { Colors } from "../../components/utils/colors";
import { useSelector } from "react-redux";
import { selectCurrentUser, selectSystemRates } from "../../redux/store/user/user.selector";
import { useRoute } from "@react-navigation/native";
import Receipt from "../Wallet/Receipt";
import { formatNumber } from "../../utils/formatter";
import SwitchToggle from "react-native-switch-toggle";



const TransferForm = ({ navigation }) => {
    const [type, setType] = useState('')
    const [visible, setVisible] = useState(false)
    const [msg, setMsg] = useState('')
    const [data, setData] = useState('')
    const [detailsVerified, setDetailsVerified] = useState('')
    const { isConnected } = useContext(NetworkContext)
    const user = useSelector(selectCurrentUser)
    const [amount, setAmount] = useState('')
    const [beneficiary_account, setBeneficiaryAccount] = useState('')
    const [reason, setReason] = useState('')
    const route = useRoute();
    const [receipt, setReciept] = useState(false)
    const [receiptData, setRecieptData] = useState('')
    const rates = useSelector(selectSystemRates)
    const [on, off] = useState(false)
    const [verifiedOnce, setVerifiedOnce] = useState(false)


    const { isLoading, mutate } = useMutation(verifyAndTransfer, {
        onSuccess: data => {
            if (data?.data?.flag == 1) {
                setDetailsVerified({
                    name: data?.data?.account_name,
                    number: data?.data?.account_number
                })
            } else if (data?.data?.flag == 0) {
                setType('invalid')
                setData(data?.data?.message)
                setVisible(true)
            }
        }
    })

    const transferMutation = useMutation(verifyAndTransfer, {
        onSuccess: data => {
            console.log("res", data?.data)
            if (data?.data?.flag == 1) {
                setRecieptData({
                    method: 'Wallet',
                    ['Account Number']: beneficiary_account,
                    type: 'Transfer',
                    reason

                })
                setReciept(true)

            } else if (data?.data?.flag == 0) {
                setType('invalid')
                setData(data?.data?.message)
                setVisible(true)
            }
        }
    })

    useEffect(() => {
        if (beneficiary_account.length == 10) {
            
            setMsg('Verifying Payrizone account, please wait...')
            const payload = {
                type: 'verify',
                beneficiary_account: beneficiary_account
            }
            console.log(payload)
           
            mutate(payload)
        }
    }, [beneficiary_account])

    useEffect(() => {
        if (route?.params?.verified) {
            const payload = {
                amount,
                reason,
                beneficiary_account,
                transfer_from: user?.account_number,
                type: 'transfer',
                beneficiary: on ? detailsVerified?.name : ''
            }

            transferMutation.mutate(payload)
        }
    }, [route])


    const handleSubmit = value => {

        let bool = true;

        if (isConnected) {
            setType('internet')
            setVisible(true)
            return
        }

        if (Boolean(detailsVerified)) {
            setMsg('Transfering, Please wait...')
            if (!route?.params?.verified) {
                navigation.navigate('Pin', {
                    page: 'Transfer Form'
                })
            }
        } 
    }

    const Confirmation = ({ name, account }) => {
        return (
            <Box
                w='100%'
                padding={10}
                r={10}
                backgroundColor={Colors.PRIMARY_FADED}
            >
                <Box
                    w='100%'
                    r={10}
                    padding={10}
                    flexDirection='row'
                    justifyContent='space-between'
                    paddingLeft={10}
                    paddingRight={10}
                    backgroundColor={Colors.PRIMARY}
                >
                    <Box
                        alignItems='flex-start'
                    >
                        <IIText type='L'>Account Name</IIText>
                        <IIText type='B'>{name}</IIText>
                    </Box>
                    <Box
                        alignItems='flex-end'
                    >
                        <IIText type='L'>Account Number</IIText>
                        <IIText type='B'>{account}</IIText>
                    </Box>
                </Box>

                <Box
                    w='100%'
                    paddingRight={10}
                    paddingTop={10}
                    alignItems='flex-end'
                >
                    <IIText type='L'>Wallet Type</IIText>
                    <IIText type='B'>Payrizone</IIText>
                </Box>
            </Box>
        )
    }




    return (
        <ParentComponent>
            <Header>To Payrizone</Header>
            <ScrollView>
                <FormView>
                    <>
                        <IIText size={16} type='L'>Enter Transfer Details</IIText>

                        <View style={{ marginBottom: 50 }}>

                            <ITextInput
                                value={user?.account_number}
                                onChangeText={setAmount}
                                placeholderTextColor='rgba(0,0,0,0.3)'
                                editable={false}
                                text='Transfer from'
                                placeholder='Enter the account to transfer from'

                            />

                            <ITextInput
                                value={beneficiary_account}
                                onChangeText={setBeneficiaryAccount}
                                placeholderTextColor='rgba(0,0,0,0.3)'
                                text='Beneficiary Account'
                                keyboardType='number-pad'
                                placeholder='Beneficiary Account'
                            />


                            {
                                Boolean(detailsVerified) && (<Confirmation name={detailsVerified?.name} account={detailsVerified?.number} />)
                            }
                            <View
                                style={{
                                    opacity: Boolean(detailsVerified) ? 1 : 0.2
                                }}
                            >

                                <ITextInput
                                    value={formatNumber(amount)}
                                    onChangeText={setAmount}
                                    placeholderTextColor='rgba(0,0,0,0.3)'
                                    text='Amount'
                                    editable={Boolean(detailsVerified) && true}
                                    keyboardType='number-pad'
                                    p={25}
                                    placeholder='0.00'

                                />

                                <View style={{
                                    position: 'absolute',
                                    top: 55,
                                    left: 10
                                }}>
                                    <IIText type='B'>₦</IIText>
                                </View>
                                <ITextInput
                                    value={reason}
                                    onChangeText={setReason}
                                    placeholderTextColor='rgba(0,0,0,0.3)'
                                    editable={Boolean(detailsVerified) && true}
                                    text='Reason'
                                    placeholder='Transaction description'

                                />

                                <IIText type='B' paddingTop={20} color={Colors.DEFAULT} >
                                    You will be charged a fee of ₦{rates?.service_fee?.transfer_fee}.00 for this {"\n"} transaction
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


                            </View>



                            <Button disabled={!Boolean(detailsVerified)} onPress={handleSubmit}>
                                Continue
                            </Button>

                        </View>

                    </>
                </FormView>
            </ScrollView>
            <NetworkModal
                type={type}
                visible={visible}
                data={data}
                setVisible={setVisible}
            />
            <Receipt
                amount={amount}
                visible={receipt}
                setVisible={setReciept}
                channel='Wallet'
                data={receiptData}

            />
            {isLoading && (<Spinner
                loading={msg}
            />)}
            {transferMutation.isLoading && (<Spinner
                loading={msg}
            />)}
        </ParentComponent>
    )
}


const style = StyleSheet.create({
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


export default TransferForm