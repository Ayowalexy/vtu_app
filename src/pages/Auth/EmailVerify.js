import React, { useState, useRef, useContext } from "react";
import { ScrollView, View, Text, TouchableOpacity, Dimensions, TextInput, StyleSheet, Image } from "react-native";
import { IIText } from "../../components/Text/Text";
import { NetworkContext } from "../../context/NetworkContext";
import ParentComponent from "../../../navigators";
import { IView, Box, IFlexer } from "../../components/Flexer/Flexer";
import Icon from 'react-native-vector-icons/Ionicons'
import { Colors } from "../../components/utils/colors";
import { DefaultTheme } from "@react-navigation/native";
import { Formik, Field } from "formik";
import * as Yup from 'yup';
import { NGN_FLAG } from "../../components/utils/Assets";
import BiometricPopup from '../../components/Fingerprint/Fingerprint'
import { useMutation } from "react-query";
import { verifyOtp } from "../../services/network";
import Spinner from "../../components/Spinner/Spinner";
import NetworkModal from "../../components/Modal/Network";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/store/user/user.selector";

const loginSchema = Yup.object().shape({

    otp: Yup.string()
        .required('OTP is required'),
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
                        {name.toLowerCase() == "otp" ? 'Enter the OTP we sent you' : inputProps.placeholder}

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


            </View>
            {hasError && <IIText size={13} type='B' color='red'>{errors[name]}</IIText>}
        </>
    );
};




const EmailVerify = ({ navigation }) => {
    const [visible, setVisible] = useState(true)
    const { isConnected } = useContext(NetworkContext)
    const [type, setType] = useState('')
    const [showNetwork, setShowNetwork] = useState(false)
    const [msg, setMsg] = useState('')
    const [data, setData] = useState('')
    const user = useSelector(selectCurrentUser)


    const { isLoading, mutate } = useMutation(verifyOtp, {
        onSuccess: data => {
            console.log(data?.data)
            if(data?.data?.flag == 1){
                setType('verified')
                setData(data?.data?.message)
                setShowNetwork(true)
            } else {
                setType('invalid')
                setData(data?.data?.message)
                setShowNetwork(true)
            }
        }
    })


    const handleSubmit = values => {
        if (isConnected) {
            setType('internet')
            setShowNetwork(true)
            return;
        }

        setMsg('Verifying your OTP, Please wait....')

        const payload = {
            token: values.otp, 
            email: user?.email_address
        }

        console.log(payload)
        mutate(payload)

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

                    <Box
                        // h={Dimensions.get('screen').height}
                        marginTop={30}
                    >
                        <View style={styles.box}>
                            <IFlexer>
                                <IIText type='L'>Verify your Email</IIText>
                                <Image
                                    source={NGN_FLAG}
                                    style={{
                                        width: 60,
                                        height: 60
                                    }}
                                />
                            </IFlexer>

                            <Formik
                                validationSchema={loginSchema}
                                initialValues={{
                                    otp: ''

                                }}
                                onSubmit={(values) => {
                                    handleSubmit(values);
                                }}>
                                {({ handleSubmit, isValid, values, setValues }) => (
                                    <>


                                        <Field
                                            component={CustomInput}
                                            name="otp"
                                            placeholder="OTP"
                                            text='Enter the OTP we sent you'
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


                        </View>





                    </Box>


                </IView>

                <IView p={20}>
                    <TouchableOpacity
                        onPress={() => {
                            setVisible(true)
                        }}
                    >
                        <Box
                            w='100%'
                            h={50}
                            r={10}
                            marginTop={0}
                            borderWidth={1}
                            borderColor={Colors.DEFAULT}
                        >
                            <IIText type='B' >Resend</IIText>
                        </Box>
                    </TouchableOpacity>
                </IView>
                <NetworkModal
                    type={type}
                    data={data}
                    visible={showNetwork}
                    setVisible={setShowNetwork}
                />
                {isLoading && (<Spinner
                    loading={msg}
                />)}
            </ScrollView>
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
    }
})

export default EmailVerify