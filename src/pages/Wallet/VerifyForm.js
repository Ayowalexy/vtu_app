import React, { useState, useEffect, useContext } from "react";
import { Formik, Field } from "formik";
import * as Yup from 'yup';
import { IIText } from "../../components/Text/Text";
import { ITextInput } from "../../components/Input/Input";
import { Button, IFlexer } from "../../components/Flexer/Flexer";
import { View, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome'
import { Colors } from "../../components/utils/colors";
import Spinner from "../../components/Spinner/Spinner";
import { NetworkContext } from "../../context/NetworkContext";
import NetworkModal from "../../components/Modal/Network";
import { useMutation, useQuery } from "react-query";
import { addPaymentProof } from "../../services/network";
import DatePicker from 'react-native-date-picker'
import { Header } from "../../components/Flexer/Flexer";
import { IView } from "../../components/Flexer/Flexer";
import Input from "../../components/Input/Input";
import FormView from "../../components/FormView/FormView";
import { DefaultTheme } from "@react-navigation/native";
import { Box } from "../../components/Flexer/Flexer";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/store/user/user.selector";
import { getAllBanks } from "../../services/network";
import IModal from "../../components/Modal/Modal";
import { SvgXml } from "react-native-svg";


const VerifyDepositSchema = Yup.object().shape({
    amount_paid: Yup.string().required('Amount is required'),
    account_name: Yup.string().required("Please, enter your account name")

})




const VerifyForm = () => {

    const [type, setType] = useState('')
    const [data, setData] = useState('')
    const [visible, setVisible] = useState(false)
    const [msg, setMsg] = useState('')
    const [date, setDate] = useState(new Date())
    const [open, setOpen] = useState(false)
    const user = useSelector(selectCurrentUser)
    const [bankModal, showBankModal] = useState(false)
    const { isConnected } = useContext(NetworkContext)
    const [selectedBank, setSelectedBank] = useState('')
    const [Banks, setBanks] = useState([])

    const { isLoading: loading, data: banks } = useQuery('banks', getAllBanks)

    const { isLoading, mutate } = useMutation(addPaymentProof, {
        onSuccess: data => {
            console.log("data?.data", data?.data)
            if (data?.data?.flag == 1) {
                setType('verify')
                setVisible(true)
            } else {
                setType('invalid')
                setVisible(true)
            }
        }
    })


    const handleSubmit = values => {
        if (isConnected) {
            setType('internet')
            setVisible(true)
            return;
        }

        setMsg('Submitting, Please wait....')

        const payload = {
            ...values,
            bank_name: selectedBank,
            customer_account_number: user.account_number,
            date_paid: new Date(date).toLocaleDateString()
        }

        mutate(payload)

    }

    useEffect(() => {
        if (banks?.data?.data?.banks?.length) {
            setBanks(banks?.data?.data?.banks)
        }
    }, [banks])






    const CustomInput = (props) => {
        const {
            field: { name, onBlur, onChange, value },
            form: { errors, touched, setFieldTouched },
            ...inputProps
        } = props;

        const hasError = errors[name] && touched[name];

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

                    />
                </View>


                {hasError && <IIText type='B' color='red' size={13}>{errors[name]}</IIText>}
            </>
        );
    };

    return (
        <>
            <Header> Verify Payment</Header>
            <ScrollView>
                <IView>

                    <IIText
                        paddingTop={20}
                        color={Colors.DEFAULT_FADED_3}
                        type='L' size={20} textAlign='center'>
                        Enter your Bank Details {"\n"} for us to verify transfer
                    </IIText>
                    <FormView>


                        <DatePicker
                            modal
                            open={open}
                            date={date}
                            onConfirm={(date) => {
                                setOpen(false)
                                setDate(date)
                            }}
                            onCancel={() => {
                                setOpen(false)
                            }}
                        />
                        <>
                            <IIText marginTop={20} type='B'>
                                Select Date
                            </IIText>
                            <TouchableOpacity onPress={() => setOpen(true)}>
                                <Box
                                    w='100%'
                                    h={50}
                                    alignItems='flex-start'
                                    r={10}
                                    backgroundColor={DefaultTheme?.colors?.background}


                                >
                                    <IIText paddingLeft={20} type='B'>
                                        {date.toLocaleDateString()}
                                    </IIText>
                                </Box>
                            </TouchableOpacity>
                        </>
                        <Formik
                            validationSchema={VerifyDepositSchema}
                            initialValues={{
                                amount_paid: '',
                                account_name: '',
                                

                            }}
                            onSubmit={(values) => {
                                handleSubmit(values);
                            }}>
                            {({ handleSubmit, isValid, values, setValues }) => (
                                <>

                                    <IIText marginTop={20} type='B'>
                                        Bank name
                                    </IIText>
                                    <TouchableOpacity onPress={() => showBankModal(true)}>
                                        <Box
                                            w='100%'
                                            h={50}
                                            r={10}
                                            alignItems='center'
                                            flexDirection='row'
                                            justifyContent='space-between'
                                            paddingLeft={10}
                                            paddingRight={10}
                                            backgroundColor={DefaultTheme?.colors?.background}

                                        >
                                            <IIText type='B'>
                                                {selectedBank ? selectedBank : 'Select your bank'}
                                            </IIText>
                                            
                                            <Icon name='bank' size={25} color={Colors.PRIMARY} />
                                        </Box>
                                    </TouchableOpacity>
                                    <Field
                                        component={CustomInput}
                                        name='amount_paid'
                                        placeholder='Amount Paid'
                                        text='Amount Paid'
                                        keyboardType='number-pad'
                                    />
                                    <Field
                                        component={CustomInput}
                                        name='account_name'
                                        placeholder='Account Name'
                                        text='Account Name'

                                    />

                                    <Button
                                        onPress={handleSubmit}
                                    >
                                        Submit
                                    </Button>

                                    <NetworkModal
                                        type={type}
                                        visible={visible}
                                        data={data}
                                        setVisible={setVisible}
                                    />
                                    {isLoading && (<Spinner
                                        loading={msg}
                                    />)}
                                </>
                            )}
                        </Formik>
                    </FormView>
                </IView>
                <IModal
                    h={500}
                    visible={bankModal}
                    setVisible={showBankModal}
                >
                    <IView p={30}>
                        <IIText type='L'>Select your bank</IIText>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {

                                Banks?.length ? (
                                    <>
                                        {Banks?.map((element, idx) => (
                                            <TouchableOpacity
                                                onPress={() => {
                                                    setSelectedBank(element?.name)
                                                    showBankModal(false)
                                                }}
                                            >
                                                <Box
                                                    key={idx}
                                                    flexDirection='row'
                                                    w='100%'
                                                    h={60}
                                                    alignItems='center'
                                                    borderBottomWidth={0.4}
                                                    justifyContent='flex-start'
                                                >
                                                    <Box>
                                                        <SvgXml
                                                            xml={element?.v2_logo}
                                                            width={30}
                                                            height={30}
                                                        />
                                                    </Box>
                                                    <IIText width={200} paddingLeft={15} type='B'>
                                                        {element?.name}
                                                    </IIText>
                                                </Box>
                                            </TouchableOpacity>
                                        ))
                                        }
                                    </>
                                ) : null
                            }
                        </ScrollView>
                    </IView>
                </IModal>
            </ScrollView>
        </>
    )
}


export default VerifyForm