import React, { useState, useRef, useContext } from "react";
import { ScrollView, View, Text, TouchableOpacity, TextInput, StyleSheet, Image } from "react-native";
import { IIText } from "../../components/Text/Text";
import ParentComponent from "../../../navigators";
import { IView, Box, IFlexer } from "../../components/Flexer/Flexer";
import Icon from 'react-native-vector-icons/Ionicons'
import { Colors } from "../../components/utils/colors";
import { DefaultTheme } from "@react-navigation/native";
import { Formik, Field } from "formik";
import * as Yup from 'yup';
import PhoneInput from "react-native-phone-number-input";
import { NGN_FLAG } from "../../components/utils/Assets";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useMutation } from "react-query";
import { signUp } from "../../services/network";
import { NetworkContext } from "../../context/NetworkContext";
import NetworkModal from "../../components/Modal/Network";
import Spinner from "../../components/Spinner/Spinner";
import DeviceInfo from 'react-native-device-info';
import SuccessModal from "../../components/Modal/SuccessModal";

const SignUpValidationSchema = Yup.object().shape({
    email_address: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
        .required('Password is required'),
    first_name: Yup.string().required('First name is required'),
    last_name: Yup.string().required('Last name is required'),
    password: Yup.string().required('Password is required'),
    invite_code: Yup.string(),
    terms: Yup.boolean().required('You need to accept our terms and conditions')
});




const CustomInput = (props) => {
    const {
        field: { name, onBlur, onChange, value },
        form: { errors, touched, setFieldTouched },
        ...inputProps
    } = props;

    const hasError = errors[name] && touched[name];
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [confirmsecureTextEntry, confirmsetSecureTextEntry] = useState(true);

    return (
        <>
            <View>


                <View style={{ marginTop: 20 }}>
                    <IIText type='B' size={13.5}>
                        {name.toLowerCase() == "refered_by" ? 'Refered By (Optional)' : inputProps.placeholder}

                    </IIText>
                    <TextInput
                        value={value}
                        onBlur={() => {
                            setFieldTouched(name);
                            onBlur(name);
                        }}
                        style={styles.input}
                        placeholderTextColor='rgba(0,0,0,0.3)'
                        onChangeText={(text) => onChange(name)(text)}
                        {...inputProps}
                        secureTextEntry={name.toLowerCase() == 'password' && secureTextEntry}
                        keyboardType={
                            name.toLowerCase() == 'password' ? 'default' : 'email-address'
                        }
                    />
                </View>

                {name.toLowerCase() == 'password' && (
                    <Icon
                        onPress={() => {
                            setSecureTextEntry(!secureTextEntry);
                        }}
                        name={secureTextEntry ? 'eye-off-outline' : 'eye-outline'}
                        color="#D6D6D6"
                        size={20}
                        style={{
                            position: 'absolute',
                            top: 50,
                            right: 10,
                            padding: 5,
                        }}
                    />
                )}
                {name.toLowerCase() == 'confirm' && (
                    <Icon
                        onPress={() => {
                            setSecureTextEntry(!secureTextEntry);
                        }}
                        name={secureTextEntry ? 'eye-off-outline' : 'eye-outline'}
                        color="#D6D6D6"
                        size={20}
                        style={{
                            position: 'absolute',
                            top: 19,
                            right: 10,
                            padding: 5,
                        }}
                    />
                )}
            </View>
            {hasError && <IIText type='B' color='red' size={12} style={styles.errorText}>{errors[name]}</IIText>}
        </>
    );
};




const SignUp = ({ navigation }) => {
    const phoneInput = useRef(null);
    const [value, setValue] = useState("");
    const [formattedValue, setFormattedValue] = useState("");
    const [valid, setValid] = useState(false)
    const [accepted, setAccepted] = useState(false)
    const [visible, setVisible] = useState(false)
    const [successVisible, setSuccesVisible] = useState(false)
    const [msg, setMsg] = useState('')
    const [data, setData] = useState('')
    const [type, setType] = useState('')
    const { isConnected, setIsConnected } = useContext(NetworkContext)


    const { isLoading, isError, mutate } = useMutation(signUp, {
        
        onSuccess: data => {
            console.log(data?.data)
            if(data?.data?.flag == 1){
                setData(data?.data?.message)
                setType('success')
            } else if(data?.data?.flag == 801){
                setData(data?.data?.message)
                setType('duplicate')
            } 
            setVisible(true)
        },
        onError: error => {
            console.log('error', error)
        },
        
    })


    const handleSubmit = async values => {

        if (isConnected) {
            setType('internet')
            setVisible(true)
            return;
        }

        const ip_address = await DeviceInfo.getIpAddress();

        const payload = {
            ...values,
             phone_number: value,
             ip_address
        }
        delete payload.terms

        console.log(payload)
        setMsg('Setting up your account, Please wait....')
        mutate(payload)


        // console.log(values)
    }

    return (
        <ParentComponent>
            <ScrollView>
                <IView p={20}>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.goBack()
                        }}
                    >
                        <Icon name="close" size={30} color={Colors.DEFAULT} />
                    </TouchableOpacity>
                    <View style={styles.box}>
                        <IFlexer>
                            <IIText type='L'>Welcome to Payrizone</IIText>
                            <Image
                                source={NGN_FLAG}
                                style={{
                                    width: 60,
                                    height: 60
                                }}
                            />
                        </IFlexer>

                        <Formik
                            validationSchema={SignUpValidationSchema}
                            initialValues={{
                                first_name: '',
                                last_name: '',
                                email_address: "",
                                password: '',
                                invite_code: '',
                                terms: accepted
                            }}
                            onSubmit={(values) => {
                                handleSubmit(values);
                            }}>
                            {({ handleSubmit, isValid, values, setValues, errors }) => (
                                <>
                                    <Field
                                        component={CustomInput}
                                        name="first_name"
                                        placeholder="First Name"
                                    />
                                    <Field
                                        component={CustomInput}
                                        name="last_name"
                                        placeholder="Last Name"
                                    />
                                    <Field
                                        component={CustomInput}
                                        name="email_address"
                                        placeholder="Email"
                                    />
                                    <IView top={20}>
                                        <IIText type='B' size={13.5}>Phone Number</IIText>
                                        <PhoneInput
                                            ref={phoneInput}
                                            defaultValue={value}
                                            layout="second"
                                            autoFocus={false}
                                            defaultCode="NG"
                                            
                                            onChangeText={(text) => {
                                                setValue(text);
                                            }}
                                            onChangeFormattedText={(text) => {
                                                setFormattedValue(text);
                                            }}
                                            containerStyle={[styles.input]}
                                            placeholder='8X XXX XXXX'
                                            withDarkTheme
                                            withShadow={false}
                                            textInputStyle={{
                                                borderRadius: 10,
                                                height: 60
                                            }}

                                        />
                                    </IView>
                                    <Field
                                        component={CustomInput}
                                        name="password"
                                        placeholder="Password"
                                    />
                                    <Field
                                        component={CustomInput}
                                        name="invite_code"
                                        text='Refered By (Optional)'
                                        placeholder="Refered By (Promo code)"
                                    />

                                    <IView top={20}>
                                        <IFlexer
                                            justifyContent='flex-start'
                                        >
                                            <BouncyCheckbox
                                                fillColor={Colors.PRIMARY}
                                                onPress={() => {
                                                    setAccepted(!accepted)
                                                }} />
                                            <IIText size={13}>
                                                I have read and accepted the {' '}
                                                <IIText type='L' color={Colors.PRIMARY}>
                                                    T and Cs {' '}
                                                </IIText>
                                                and {"\n"}
                                                <IIText type='L' color={Colors.PRIMARY}>
                                                    Privacy policy
                                                </IIText>
                                            </IIText>
                                        </IFlexer>
                                    </IView>
                                    {
                                        (!accepted) && (isValid) ?
                                            <IIText type='B' color='red' size={12}>Please, accept our terms and conditions</IIText>
                                            : null

                                    }

                                    <TouchableOpacity
                                        disabled={(!accepted) && (isValid)}
                                        onPress={handleSubmit}
                                    >
                                        <Box
                                            w='100%'
                                            h={50}
                                            opacity={!isValid ? 0.2 : 1}
                                            backgroundColor={Colors.PRIMARY}
                                            r={10}
                                            marginTop={30}
                                        >
                                            <IIText size={16} color={Colors.DEFAULT}>Sign Up</IIText>
                                        </Box>
                                    </TouchableOpacity>


                                </>
                            )}
                        </Formik>
                    </View>

                    <Box
                        flexDirection='row'
                        marginTop={10}
                        marginBottom={30}
                    >
                        <IIText type='B'>Already has an account?</IIText>
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate('Login')
                            }}
                        >
                            <IIText type='L' color={Colors.PRIMARY} marginLeft={10}>Login</IIText>
                        </TouchableOpacity>
                    </Box>
                </IView>
            </ScrollView>
            <NetworkModal
                type={type}
                visible={visible}
                data={data}
                setVisible={setVisible}
            />
            {isLoading && (
                <Spinner
                    loading={msg}
                />
            )}
        </ParentComponent>
    )
}

const styles = StyleSheet.create({
    box: {
        width: '100%',
        backgroundColor: Colors.WHITE,
        borderRadius: 8,
        elevation: 0.6,
        padding: 20,
        marginTop: 10
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: DefaultTheme?.colors?.background,
        paddingLeft: 15,
        borderRadius: 10,
        color: Colors.DEFAULT
    }
})

export default SignUp