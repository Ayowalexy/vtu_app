import React, { useState, useRef, useContext } from "react";
import { IIText } from "../../components/Text/Text";
import NetworkModal from "../../components/Modal/Network";
import { NetworkContext } from "../../context/NetworkContext";
import Spinner from "../../components/Spinner/Spinner";
import { ScrollView } from "react-native";
import ParentComponent from "../../../navigators";
import { Header, IView } from "../../components/Flexer/Flexer";
import FormView from "../../components/FormView/FormView";
import { TextInput, View, Text, StyleSheet, Pressable, TouchableOpacity } from "react-native";
import { Formik, Field } from "formik";
import * as Yup from 'yup';
import { Colors } from "../../components/utils/colors";
import { Box } from "../../components/Flexer/Flexer";
import { ITextInput } from "../../components/Input/Input";
import { useMutation } from "react-query";
import { setPin } from "../../services/network";
import Receipt from '../../pages/Wallet/Receipt'

const PhoneSchema = Yup.object().shape({
    voucher_pin: Yup.string().required("Please, enter Voucher PIN"),
    serial_number: Yup.string().required('Please, enter the Serial Number'),
    security_code: Yup.string().required('Please, enter the security code')

})

const VoucherForm = () => {
    const { isConnected } = useContext(NetworkContext)
    const [type, setType] = useState('')
    const [visible, setVisible] = useState(false)
    const [msg, setMsg] = useState('')
    const [fundedAmount, setFundedAmount] = useState('')
    const [receipt, setReciept] = useState(false)
    const [data, setData] = useState('')
    const [receiptData, setReceiptdata] = useState('')


    const { isLoading, mutate } = useMutation(setPin, {
        onSuccess: data => {
            console.log("data?.data", data?.data)
            if(data?.data?.flag == 1){
                setFundedAmount(data?.data?.amount)
                setReceiptdata({
                    method: 'Voucher',
                })
                setReciept(true)
            } else if(data?.data?.flag == 0){
                setType('invalid')
                setData(data?.data?.message)
                setVisible(true)
            }
        }
    })


    const handleSubmit = values => {
        if (isConnected) {
            setType('internet')
            setVisible(true)
            return
        }

        setMsg('Loading your Voucher, please wait...')
        console.log({ ...values, type: 'load' })
        mutate({ ...values, type: 'load' })
    }



    const CustomInput = (props) => {
        const {
            field: { name, onBlur, onChange, value },
            form: { errors, touched, setFieldTouched },
            ...inputProps
        } = props;

        const hasError = errors[name] && touched[name];
        const [secureTextEntry, setSecureTextEntry] = useState(true);

        return (
            <>
                <View>
                    <ITextInput
                        value={value}
                        onBlur={() => {
                            setFieldTouched(name);
                            onBlur(name);
                        }}
                        placeholderTextColor='rgba(0,0,0,0.3)'
                        onChangeText={(text) => onChange(name)(text)}
                        {...inputProps}
                        secureTextEntry={name.toLowerCase() == 'password' && secureTextEntry}
                        keyboardType='number-pad'
                    />
                </View>


                {hasError && <Text style={styles.errorText}>{errors[name]}</Text>}
            </>
        );
    };

    return (
        <ParentComponent>
            <Header>Load A Voucher</Header>
            <IView p={20}
                marginBottom={-30}
            >
                <IIText type='L' textAlign='center'>
                    To add money to your Payrizone account, {"\n"}
                    You can redeem your Voucher by entering {"\n"}
                    your Voucher details below
                </IIText>
            </IView>
            <FormView>
                <>
                    <Formik
                        validationSchema={PhoneSchema}
                        initialValues={{
                            voucher_pin: '',
                            serial_number: '',
                            security_code: ''

                        }}
                        onSubmit={(values) => {
                            handleSubmit(values);
                        }}>
                        {({ handleSubmit, isValid, values, setValues }) => (
                            <>


                                <Field
                                    component={CustomInput}
                                    name="voucher_pin"
                                    text='Enter Voucher PIN'
                                />

                                <Field
                                    component={CustomInput}
                                    name="serial_number"
                                    text='Enter Serial Number'
                                />

                                <Field
                                    component={CustomInput}
                                    name="security_code"
                                    text='Enter Security Code'
                                />




                                <TouchableOpacity
                                    onPress={handleSubmit}
                                >
                                    <Box
                                        w='100%'
                                        h={50}
                                        backgroundColor={Colors.PRIMARY}
                                        r={10}
                                        marginTop={30}
                                    >
                                        <IIText size={16} color={Colors.DEFAULT}>Verify</IIText>
                                    </Box>
                                </TouchableOpacity>

                            </>
                        )}
                    </Formik>
                </>
            </FormView>
            <NetworkModal
                type={type}
                visible={visible}
                data={data}
                setVisible={setVisible}
            />
            {isLoading && (<Spinner
                loading={msg}
            />)}

            <Receipt
                amount={fundedAmount}
                channel='Voucher'
                visible={receipt}
                setVisible={setReciept}
                data={receiptData}
            />


        </ParentComponent>
    )
}


const styles = StyleSheet.create({
    view: {
        width: 250,
        backgroundColor: Colors.WHITE,
        elevation: 20,
        height: 120,
        // marginRight: 30,
        // marginTop: 20,
        position: 'absolute',
        // display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'flex-start',
        padding: 15
    }
})
export default VoucherForm