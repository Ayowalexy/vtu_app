import React, { useState, useRef, useContext } from "react";
import NetworkModal from "../../components/Modal/Network";
import { NetworkContext } from "../../context/NetworkContext";
import Spinner from "../../components/Spinner/Spinner";
import { IIText } from "../../components/Text/Text";
import { ScrollView } from "react-native";
import ParentComponent from "../../../navigators";
import { Header } from "../../components/Flexer/Flexer";
import FormView from "../../components/FormView/FormView";
import { TextInput, View, Text, StyleSheet, Pressable, TouchableOpacity } from "react-native";
import { Formik, Field } from "formik";
import * as Yup from 'yup';
import { Colors } from "../../components/utils/colors";
import { Box } from "../../components/Flexer/Flexer";
import { ITextInput } from "../../components/Input/Input";
import Tooltip from "rn-tooltip";
import { IFlexer } from "../../components/Flexer/Flexer";
import { IIcon } from "../../components/Flexer/Flexer";
import { DefaultTheme } from "@react-navigation/native";
import ElectricityModal from "./ElectricityModal";
import { useMutation } from "react-query";
import { getElectricity } from "../../services/network";
import { useSelector } from "react-redux";
import Animated, { SlideInLeft, Layout } from "react-native-reanimated";
import { selectServices } from "../../redux/store/user/user.selector";
import { verifyMeter } from "../../services/network";
import { getAllPhoneBooks } from "../../services/network";



const PhoneSchema = Yup.object().shape({
    meter_number: Yup.string().required("Please, enter meter number")
})

const ElectricityForm = ({ navigation, route }) => {
    const tooltipRef = useRef(null);
    const [cableType, setCableType] = useState('')
    const [visible, setVisible] = useState(false)
    const [provider, setProvider] = useState('')
    const [type, setType] = useState('')
    const [showNetwork, setShowNetwork] = useState(false)
    const [data, setData] = useState([])
    const [msg, setMsg] = useState('')
    const [result, setResult] = useState('')
    const [useData, setUseData] = useState('')

    const { isConnected } = useContext(NetworkContext)
    const services = useSelector(selectServices)

    const { isLoading, mutate } = useMutation(getElectricity, {
        onSuccess: data => {
            console.log(data?.data?.flag)
            if (data?.data?.flag == 1) {
                setData(data?.data?.result?.products)
                setVisible(true)
            } else {
                setType('invalid')
                showNetwork(true)
            }
        }
    })


    const verifyMeterMutation = useMutation(verifyMeter, {
        onSuccess: (data) => {
            if (data?.data?.flag == 1) {
                console.log(data?.data?.result)
                setResult(data?.data?.result)
            } else {
                setType('invalid')
                setShowNetwork(true)
            }
        }
    })


    const saveMeterMutation = useMutation(getAllPhoneBooks, {
        onSuccess: (data) => {
            if (data?.data?.flag == 2) {
                setType('invalid')
                setUseData(data?.data?.message)
                setShowNetwork(true)
            } else if (data?.data?.flag == 1) {
                setType('added')
                setUseData(data?.data?.message)
                setShowNetwork(true)
            }
        }
    })

    const handleVerify = (smart_no, product_id) => {


        if (isConnected) {
            setType('internet')
            setVisible(true)
            return;
        }

        setMsg('Verifying meter, Please wait....')


        const cable = services?.find(element => element.module_name == 'Electricity')

        const payload = {
            module_id: cable?.module_id,
            smart_no: smart_no,
            service: 'electricity',
            product: product_id
        }


        verifyMeterMutation.mutate(payload)

    }

    const handleFetch = () => {

        if (isConnected) {
            setType('internet')
            setShowNetwork(true)
            return;
        }

        setMsg('Fetching Electricity provider, Please wait....')


        const cables = services?.find(element => element.module_name == 'Electricity')

        const payload = {
            module_id: cables?.module_id
        }

        mutate(payload)

    }

    const handleSubmit = values => {
        handleVerify(values?.meter_number, provider?.product_id)
    }

    console.log(provider)
    const handleSave = (meterNumber) => {

        const payload = {
            phone_number: meterNumber,
            operator_name: provider?.product_id,
            name: result?.customer_name,
            phonebook_type: "Meter",
            type: 'add',
            last_product: result?.product,
            expiry_date: null
        }

        console.log('result', result)
        if (isConnected) {
            setType('internet')
            setShowNetwork(true)
            return;
        }

        setMsg('Saving your meter, please wait...')

        saveMeterMutation.mutate(payload)
    }


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


                {hasError && <IIText type='B' size={13} color='red'>{errors[name]}</IIText>}
            </>
        );
    };

    return (
        <ParentComponent>
            <Header>Add new Meter Number</Header>
            <FormView>
                <>
                    <Formik
                        validationSchema={PhoneSchema}
                        initialValues={{
                            meter_number: '',


                        }}
                        onSubmit={(values) => {
                            handleSubmit(values);
                        }}>
                        {({ handleSubmit, isValid, values, setValues }) => (
                            <>
                                <>
                                    <IIText marginTop={20} type='B'>
                                        Select Provider
                                    </IIText>
                                    <TouchableOpacity
                                        onPress={() => {
                                            // setVisible(true)
                                            handleFetch()
                                        }}
                                    >
                                        <Box
                                            w='100%'
                                            h={50}
                                            alignItems='flex-start'
                                            r={10}
                                            backgroundColor={DefaultTheme?.colors?.background}


                                        >
                                            <IIText paddingLeft={20} type='B'>
                                                {provider?.name}
                                            </IIText>
                                        </Box>
                                    </TouchableOpacity>
                                </>
                                {
                                    Boolean(provider) && (
                                        <>
                                            <Animated.View
                                                entering={SlideInLeft.delay(100)}
                                            >

                                                <Field
                                                    component={CustomInput}
                                                    name="meter_number"
                                                    text='Enter your Meter number'
                                                />
                                            </Animated.View>
                                            <Animated.View
                                                entering={SlideInLeft.delay(200)}
                                            >
                                                <Field
                                                    component={CustomInput}
                                                    name="name"
                                                    text='Name'
                                                    editable={false}
                                                    value={result?.customer_name}
                                                />
                                            </Animated.View>
                                        </>
                                    )
                                }




                                <TouchableOpacity
                                    disabled={values?.meter_number?.length < 11 ? true : false}
                                    onPress={() => {
                                        if (Boolean(result?.customer_name)) {
                                            if (route?.params?.verified) {
                                                handleSave(values?.meter_number)
                                            } else {
                                                navigation.navigate('Pin', {
                                                    page: 'Electricity Form'
                                                })
                                            }
                                        } else {
                                            handleSubmit()
                                        }

                                    }}>
                                    <Box
                                        w='100%'
                                        h={50}
                                        backgroundColor={Colors.PRIMARY}
                                        r={10}
                                        marginTop={30}
                                        opacity={values?.meter_number?.length < 11 ? 0.4 : 1}
                                    >
                                        <IIText size={16} color={Colors.DEFAULT}>
                                            {
                                                Boolean(result?.customer_name) ? 'Save' : 'Verify'
                                            }
                                        </IIText>
                                    </Box>
                                </TouchableOpacity>

                            </>
                        )}
                    </Formik>
                    <NetworkModal
                        type={type}
                        visible={showNetwork}
                        data={useData}
                        setVisible={setShowNetwork}
                    />
                    {isLoading && (<Spinner
                        loading={msg}
                    />)}

                    {verifyMeterMutation.isLoading && (<Spinner
                        loading={msg}
                    />)}
                    {saveMeterMutation.isLoading && (<Spinner
                        loading={msg}
                    />)}
                </>
            </FormView>

            <ElectricityModal
                visible={visible}
                setVisible={setVisible}
                setProvider={setProvider}
                providers={data}
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
export default ElectricityForm