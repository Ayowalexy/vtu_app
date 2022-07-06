import React, { useState, useEffect, useContext } from "react";
import { IIText } from "../../components/Text/Text";
import { ScrollView, StyleSheet, View, TouchableOpacity, ActivityIndicator } from "react-native";
import FLexer, { IView, Box, IFlexer } from "../../components/Flexer/Flexer";
import { Colors } from "../../components/utils/colors";
import Icon from 'react-native-vector-icons/FontAwesome'
import IModal from "../../components/Modal/Modal";
import { ITextInput } from "../../components/Input/Input";
import { formatNumber } from "../../utils/formatter";
import Animated, { SlideInLeft, Layout } from "react-native-reanimated";
import { Button } from "../../components/Flexer/Flexer";
import PayStack from '../../components/PayStack/PayStack'
import NetworkModal from "../../components/Modal/Network";
import { NetworkContext } from "../../context/NetworkContext";
import { useMutation } from "react-query";
import { fundUser } from "../../services/network";
import Receipt from './Receipt'
import Flutterwave from "../../components/PayStack/Fultterwave";
import { Flut } from "../../components/PayStack/Fultterwave";



const Debit_Credit_Card = () => {
    const [showModal, setShowModal] = useState('');
    const [amount, setAmount] = useState('')
    const [showPaySstack, setShowPayStack] = useState(false)
    const [error, setError] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [visible, setVisible] = useState(false)
    const [type, setType] = useState('')
    const [data, setData] = useState('')
    const [reference, setReference] = useState('')
    const [receipt, setReciept] = useState(false)
    const [fundedAmount, setFundedAmount] = useState('')
    const [paymentChannel, setPaymentChannel] = useState('')
    const [showPayment, setShowPayment] = useState(false)
    const { isConnected } = useContext(NetworkContext)
    const [showSummary, setShowSummary] = useState(false)


    const { isLoading, mutate } = useMutation(fundUser, {
        onSuccess: data => {
            console.log(data?.data)
            if (data?.data?.flag == 1) {

                setReference(data?.data?.txf)
                setShowModal(false)
                setShowPayment(true)
                
                if(paymentChannel == 'Flutterwave'){
                    setShowSummary(true)
                }

                setShowSuccess(false)
            } else {
                setType('invalid')
                setVisible(true)
            }

        }
    })


    useEffect(() => {
        if (showSuccess) {
            setShowModal(false)
            setData('You have successfully funded your account, now enjoy Paytizone with no limit')
            setType('fund')
            setTimeout(() => {
                // setVisible(true)
                setFundedAmount(amount)
                setReciept(true)
            }, 1000);
        }
    }, [showSuccess])

    const handleVerify = () => {
        if (isConnected) {
            setType('internet')
            setVisible(true)
            return;
        }

        const payload = {
            amount,
            channel: 'paystack',
            reason: 'create',

        }
            mutate(payload)
        
    }





    return (
        <ScrollView>
            <IView top={30}>
                <IIText type='B' size={16}>Choose your preferred {"\n"}payment channel</IIText>
            </IView>

            <View style={styles.view}>
                {
                    [
                        {
                            name: 'PayStack',
                            icon: 'paypal'
                        },
                        {
                            name: 'Flutterwave',
                            icon: 'gratipay'
                        },

                    ].map((element, idx) => (
                        <TouchableOpacity
                            style={styles.box}
                            onPress={() => {
                                setPaymentChannel(element?.name)
                                setShowModal(true)
                            }}
                        >
                            <Box
                                key={idx}
                                h='100%'
                                w='100%'
                                // marginTop={20}
                                backgroundColor={Colors.PRIMARY_FADED}
                                r={20}
                                borderWidth={1}
                                borderColor={Colors.PRIMARY}
                            >
                                <Box
                                    h={50}
                                    w={50}
                                    r={10}
                                    backgroundColor={Colors.PRIMARY}
                                >
                                    <Icon name={element.icon} size={20} color={Colors.DEFAULT} />
                                </Box>
                                <IIText type='B' size={20} marginTop={10} color={Colors.DEFAULT}>{element.name}</IIText>
                            </Box>
                        </TouchableOpacity>
                    ))
                }
            </View>

            <IModal
                h={290}
                visible={showModal}
                setVisible={setShowModal}
            >
                <IView
                    p={30}
                >
                    <IIText type='L' size={16}>How Much will you like to fund?</IIText>
                    <Animated.View
                        entering={SlideInLeft.delay(100)}
                    >
                        <View style={{
                            position: 'absolute',
                            top: 57,
                            left: 10,
                            zIndex: 10,
                        }}>
                            <IIText>₦</IIText>
                        </View>
                        <ITextInput
                            value={formatNumber(amount)}
                            onChange={setAmount}
                            placeholder='Enter Amount'
                            text='Amount'
                            keyboardType='number-pad'
                            paddingLeft={30}
                            onBlur={() => {
                                if (Number(amount) < 500) {
                                    setError(true)
                                } else {
                                    setError(false)
                                }
                            }}


                        />
                        {
                            error && <IIText type='B' size={13} color={Colors.ERROR}>Minimum deposit amount is ₦500</IIText>

                        }
                        <Button
                            disabled={Number(amount) < 500}
                            onPress={handleVerify}
                        >
                            {
                                isLoading ? <ActivityIndicator size={20} color={Colors.DEFAULT} /> : 'Continue'
                            }
                        </Button>
                    </Animated.View>
                </IView>
            </IModal>

            {paymentChannel == 'PayStack' && showPayment ? (
                <PayStack
                    setAmount={setAmount}
                    setShowSuccess={setShowSuccess}
                    amount={amount}
                    setPaymentChannel={setPaymentChannel}
                    setShowPayStack={setShowPayment}
                    reference={reference}
                />) : null
            }

            <IModal
                h={300}
                visible={showSummary}
                setVisible={setShowSummary}
            >
                <IView p={30}>
                    <IIText size={16} type='L'>Payment Summary</IIText>
                    <Box w='100%' borderBottomWidth={0.2} paddingTop={10} />
                    <Box
                        paddingTop={20}
                        w='100%'
                        justifyContent='flex-start'
                        flexDirection='row'>
                        <IIText type='L'>
                            Amount:
                        </IIText>
                        <IIText paddingLeft={10} type='B'>
                            ₦{formatNumber(1000)}
                        </IIText>
                    </Box>
                    <Box
                        paddingTop={10}
                        w='100%'
                        justifyContent='flex-start'
                        flexDirection='row'>
                        <IIText type='L'>
                            Channel:
                        </IIText>
                        <IIText paddingLeft={10} type='B'>
                            Flutterwave
                        </IIText>
                    </Box>
                    <Box
                        paddingTop={10}
                        w='100%'
                        justifyContent='flex-start'
                        flexDirection='row'>
                        <IIText type='L'>
                            Reference:
                        </IIText>
                        <IIText paddingLeft={10} type='B'>
                            {reference}
                        </IIText>
                    </Box>

                    <Flutterwave
                        amount={amount}
                        setAmount={setAmount}
                        setShowSuccess={setShowSuccess}
                        reference={reference}
                        setShowPayment={setShowPayment}
                        setPaymentChannel={setPaymentChannel}
                    />
                </IView>
            </IModal>


            <NetworkModal
                type={type}
                visible={visible}
                data={data}
                setVisible={setVisible}
            />

            <Receipt
                amount={fundedAmount}
                visible={receipt}
                setVisible={setReciept}
            />
        </ScrollView>
    )
}


const styles = StyleSheet.create({
    view: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        width: '100%',
        flexDirection: 'row',
        marginTop: 30
    },
    box: {
        height: 170,
        width: '47%',
        marginTop: 20
    }
})

export default Debit_Credit_Card