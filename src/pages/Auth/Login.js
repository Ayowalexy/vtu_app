import React, { useState, useRef, useContext } from "react";
import { ScrollView, View, Text, TouchableOpacity, Dimensions, LogBox, TextInput, StyleSheet, Image } from "react-native";
import { IIText } from "../../components/Text/Text";
import ParentComponent from "../../../navigators";
import { IView, Box, IFlexer } from "../../components/Flexer/Flexer";
import Icon from 'react-native-vector-icons/Ionicons'
import { Colors } from "../../components/utils/colors";
import { DefaultTheme } from "@react-navigation/native";
import { Formik, Field } from "formik";
import * as Yup from 'yup';
import { NGN_FLAG } from "../../components/utils/Assets";
import BiometricPopup from '../../components/Fingerprint/Fingerprint'
import { login } from '../../services/network'
import { useMutation } from "react-query";
import Spinner from '../../components/Spinner/Spinner'
import { NetworkContext } from "../../context/NetworkContext";
import NetworkModal from "../../components/Modal/Network";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from 'react-redux';
import { selectFingerprint } from "../../redux/store/user/user.selector";
import { setAllTicketsActionsAsync } from "../../redux/store/support/support.actions";
import { setCurrentUserUserActionAsync, setLoginActionAsync } from '../../redux/store/user/user.actions'

LogBox.ignoreAllLogs()


const loginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
        .required('Password is required'),
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
                        {name.toLowerCase() == "email" ? 'Email' : inputProps.placeholder}

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

            </View>
            {hasError && <IIText type='B' color='red' size={13}>{errors[name]}</IIText>}
        </>
    );
};



const Login = ({ navigation }) => {
    const [visible, setVisible] = useState(false);
    const [msg, setMsg] = useState('')
    const [data, setData] = useState('')
    const [type, setType] = useState('')
    const [showNetwork, setShowNetwork] = useState(false)
    const { isConnected } = useContext(NetworkContext)
    const dispatch = useDispatch();
    const fingerprintState = useSelector(selectFingerprint)

    console.log('finger print', fingerprintState)

    const { isLoading, mutate } = useMutation(login, {
        onSuccess: async data => {
            console.log(data?.data)
            if (data?.data?.flag == 1) {
                const userData = {
                    ...data?.data?.customer,
                    token: data?.data?.token
                }

                await AsyncStorage.setItem('userData', JSON.stringify(userData))
                dispatch(setCurrentUserUserActionAsync())
                dispatch(setLoginActionAsync())
                dispatch(setAllTicketsActionsAsync())
                navigation.navigate("Tabs")
            } else if (data?.data?.flag == 0) {
                setType('invalid')
                setData(data?.data?.message)
                setShowNetwork(true)
            }
            // setVisible(true)
        },
    })


    const handleSubmit = values => {

        if (isConnected) {
            setType('internet')
            setShowNetwork(true)
            return;
        }

        setMsg('Fetching your data, Please wait....')

        const payload = {
            username: values.email,
            password: values.password
        }

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
                                <IIText type='L'>Welcome Back to Payrizone</IIText>
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

                                    email: "",
                                    password: '',

                                }}
                                onSubmit={(values) => {
                                    handleSubmit(values);
                                }}>
                                {({ handleSubmit, isValid, values, setValues }) => (
                                    <>

                                        <Field
                                            component={CustomInput}
                                            name="email"
                                            placeholder="Email / Phone"
                                        />

                                        <Field
                                            component={CustomInput}
                                            name="password"
                                            placeholder="Password"
                                        />

                                        <IFlexer
                                            justifyContent='flex-end'
                                            marginTop={20}
                                        >
                                            <TouchableOpacity>
                                                <IIText
                                                    type='B'
                                                    size={13}
                                                    color={Colors.DEFAULT}
                                                >
                                                    Forgot Password?
                                                </IIText>
                                            </TouchableOpacity>
                                        </IFlexer>


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
                                                <IIText size={16} color={Colors.DEFAULT}>Login</IIText>
                                            </Box>
                                        </TouchableOpacity>


                                    </>
                                )}
                            </Formik>
                        </View>
                    </Box>

                    {
                        fingerprintState && (
                            <TouchableOpacity
                                onPress={() => {
                                    setVisible(true)
                                }}
                            >
                                <Box
                                    w='100%'
                                    h={50}
                                    r={10}
                                    flexDirection='row'
                                    marginTop={20}
                                    borderWidth={1}
                                    borderColor={Colors.DEFAULT}
                                >
                                    <Icon name="finger-print-outline" size={20} color={Colors.DEFAULT} />
                                    <IIText type='B' marginLeft={10} >Biometric Login</IIText>
                                </Box>
                            </TouchableOpacity>
                        )
                    }


                    <>
                        {visible &&
                            <BiometricPopup
                                visible={visible}
                                setVisible={setVisible}
                            />
                        }
                    </>



                    <Box
                        flexDirection='row'
                        marginTop={10}
                        marginBottom={30}
                    >
                        <IIText type='B'>New User? </IIText>
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate('Sign Up')
                            }}
                        >
                            <IIText type='L' color={Colors.PRIMARY} marginLeft={10}>SignUp</IIText>
                        </TouchableOpacity>
                    </Box>
                </IView>
                <NetworkModal
                    type={type}
                    visible={showNetwork}
                    data={data}
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
        color: Colors.DEFAULT
    },

})



export default Login