import React, { useState, useRef, useContext, useEffect } from "react";
import { IIText } from "../../components/Text/Text";
import { ScrollView } from "react-native";
import ParentComponent from "../../../navigators";
import { Header } from "../../components/Flexer/Flexer";
import FormView from "../../components/FormView/FormView";
import { TextInput, View, Text, StyleSheet, Pressable, TouchableOpacity, Image } from "react-native";
import { Formik, Field } from "formik";
import * as Yup from 'yup';
import { Colors } from "../../components/utils/colors";
import { Box } from "../../components/Flexer/Flexer";
import { ITextInput } from "../../components/Input/Input";
import Tooltip from "rn-tooltip";
import { IFlexer } from "../../components/Flexer/Flexer";
import { IIcon } from "../../components/Flexer/Flexer";
import { DefaultTheme } from "@react-navigation/native";
import Spinner from "../../components/Spinner/Spinner";
import NetworkModal from "../../components/Modal/Network";
import { NetworkContext } from "../../context/NetworkContext";
import { useSelector } from "react-redux";
import { selectServices } from "../../redux/store/user/user.selector";
import { useMutation } from "react-query";
import { verifyMultiChoice, verifyStarTimes } from "../../services/network";
import Animated, { SlideInLeft, Layout } from "react-native-reanimated";
import { getAllPhoneBooks, getCables } from "../../services/network";
import { DSTV, GOTV, STARTIMES } from "../../components/utils/Assets";

const PhoneSchema = Yup.object().shape({
    decoder_number: Yup.string().required("Please, enter decoder number")
})

const CableForm = ({navigation, route}) => {
    const tooltipRef = useRef(null);
    const [cableType, setCableType] = useState('')
    const [type, setType] = useState('')
    const [visible, setVisible] = useState('')
    const [msg, setMsg] = useState('')
    const [data, setData] = useState('')
    const [result, setResult] = useState('')
    const [cableData, setcableData] = useState([])


    const { isConnected } = useContext(NetworkContext)
    const services = useSelector(selectServices)

    const { isLoading, mutate } = useMutation(verifyMultiChoice, {
        onSuccess: data => {
            console.log("data?.data", data?.data)
            if (data?.data?.flag == 1) {
                setResult(data?.data?.result)
            } else {
                setType('invalid')
                setVisible(true)
            }
        }
    })

    const saveCableMutation = useMutation(getAllPhoneBooks, {
        onSuccess: (data) => {
            console.log(data?.data)
            if (data?.data?.flag == 2) {
                setType('invalid')
                setData(data?.data?.message)
                setVisible(true)
            } else if (data?.data?.flag == 1) {
                setType('added')
                setData(data?.data?.message)
                setVisible(true)
            }
        }
    })


    const getCableMutation = useMutation(getCables, {
        onSuccess: data => {
            console.log('Cable list', data?.data)
            if(data?.data?.flag == 1){
                setcableData(data?.data?.result)
            }else {
                setType('invalid')
                setVisible(true)
            }
        }
    })

    const StarTimesMutation = useMutation(verifyStarTimes, {
        onSuccess: data => {
            console.log("data?.data?.result", data?.data)
            if (data?.data?.flag == 1) {
                setResult(data?.data?.data?.name)
            } else {
                setType('invalid')
                setVisible(true)
            }
        }
    })

    useEffect(() => {
        handleFetchCables()
    }, [])


    const handleFetchCables = () => {


        if (isConnected) {
            setType('internet')
            setVisible(true)
            return;
        }

        setMsg('Loading cables, Please wait....')
        const cables = services?.find(element => element.module_name == 'TV Cable')

        const payload = {
            module_id: cables?.module_id
        }

        getCableMutation.mutate(payload)
    }

    const handleVerify = (meterNumber) => {


        if (isConnected) {
            setType('internet')
            setVisible(true)
            return;
        }

        setMsg('Verifying your Decoder, Please wait....')


        const cable = services?.find(element => element.module_name == 'TV Cable')

        const payload = {
            module_id: cable?.module_id,
            smart_no: meterNumber
        }

        console.log(payload)

        mutate(payload)

    }


    const handleVerifyStarTimes = (meterNumber) => {
        if (isConnected) {
            setType('internet')
            setVisible(true)
            return;
        }

        setMsg('Verifying your Decoder, Please wait....')


        const cable = services?.find(element => element.module_name == 'TV Cable')

        const useProductID = cableData?.find(element => element.product_name == 'StarTimes')




        const payload = {
            module_id: cable?.module_id,
            smart_no: meterNumber,
            service: 'dstv',
            product: useProductID?.product_id


        }

        console.log('start times payload', payload)

        StarTimesMutation.mutate(payload)
    }


    console.log('result', result)

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


                {hasError && <Text style={styles.errorText}>{errors[name]}</Text>}
            </>
        );
    };


    const handleSubmit = values => {
        
        if(cableType == 'DSTV' || cableType == 'GOTV'){
            handleVerify(values?.decoder_number)
        } else {
            handleVerifyStarTimes(values?.decoder_number)
        }
    }



    const handleSave = (decoder) => {

        const payload = {
            phone_number: decoder,
            operator_name: cableType,
            name: result?.first_name?.concat(' ', result?.last_name) || result?.customer_name || result,
            phonebook_type: "Cable",
            type: 'add',
            last_product: result?.primary_product_name,
            expiry_date: result?.total_due_date
        }

        if (isConnected) {
            setType('internet')
            setVisible(true)
            return;
        }

        setMsg('Saving your Cable, please wait...')

        saveCableMutation.mutate(payload)
    }


    return (
        <ParentComponent>
            <Header>Add new Cable TV</Header>
            <FormView>
                <>
                    <Formik
                        validationSchema={PhoneSchema}
                        initialValues={{
                            decoder_number: '',


                        }}
                        onSubmit={(values) => {
                            handleSubmit(values);
                        }}>
                        {({ handleSubmit, isValid, values, setValues }) => (
                            <Animated.View
                                layout={Layout.springify()}
                            >

                                <Tooltip
                                    withPointer={false}
                                    ref={tooltipRef}
                                    popover={
                                        <View style={styles.view}>
                                            {
                                                ['DSTV', 'GOTV', 'StarTimes']
                                                    .map((element, idx) => (
                                                        <Pressable
                                                            style={{
                                                                display: 'flex',
                                                                flexDirection: 'row',
                                                                paddingTop: 5
                                                            }}
                                                            key={idx}
                                                            onPress={() => {
                                                                setCableType(element)
                                                                tooltipRef.current.toggleTooltip();
                                                            }}
                                                        >
                                                            <Image
                                                                source={
                                                                    element == 'DSTV'
                                                                    ? DSTV
                                                                    : element == 'GOTV'
                                                                    ? GOTV
                                                                    : element == 'StarTimes'
                                                                    ? STARTIMES
                                                                    : null
                                                                }

                                                                style={{
                                                                    width: 30,
                                                                    height: 30,
                                                                    borderRadius: 20,
                                                                    marginBottom: 10
                                                                }}
                                                                resizeMode='contain'
                                                            />
                                                            <IIText paddingLeft={10} type='B'>{element}</IIText>
                                                        </Pressable>
                                                    ))
                                            }


                                        </View>
                                    }
                                >
                                    <>
                                        <IIText marginTop={20} type='B'>
                                            Select Cable Type
                                        </IIText>
                                        <Box
                                            w='100%'
                                            h={50}
                                            alignItems='flex-start'
                                            r={10}
                                            backgroundColor={DefaultTheme?.colors?.background}


                                        >
                                            <IIText paddingLeft={20} type='B'>
                                                {cableType}
                                            </IIText>
                                        </Box>
                                    </>

                                </Tooltip>
                                {
                                    cableType == 'DSTV' || cableType == 'GOTV' || cableType == 'StarTimes' ?   (
                                        <>
                                            <Animated.View
                                                entering={SlideInLeft.delay(100)}
                                            >
                                                <Field
                                                    component={CustomInput}
                                                    name="decoder_number"
                                                    text='Enter your Decoder number'
                                                />

                                                <Field
                                                    component={CustomInput}
                                                    name="name"
                                                    text='Name'
                                                    value={result?.first_name?.concat(' ', result?.last_name) || result?.customer_name || result}
                                                    editable={false}
                                                />

                                            </Animated.View>

                                        </>
                                    ) : null
                                }




                                <TouchableOpacity
                                    disabled={values?.decoder_number?.length < 10 && true}
                                    onPress={() => {
                                        if(Boolean(result?.first_name) || Boolean(result?.customer_name) || Boolean(result)){
                                            if (route?.params?.verified) {
                                                handleSave(values?.decoder_number)
                                            } else {
                                                navigation.navigate('Pin', {
                                                    page: 'Cable Form'
                                                })
                                            }
                                        }else {
                                            handleSubmit()
                                        }
                                    }}
                                >
                                    <Box
                                        w='100%'
                                        h={50}
                                        backgroundColor={Colors.PRIMARY}
                                        r={10}
                                        marginTop={30}
                                        opacity={values?.decoder_number?.length < 10 ? 0.4 : 1}
                                    >
                                        <IIText size={16} color={Colors.DEFAULT}>
                                            {
                                                route?.params?.verified ? 'Save' : 'Verify'
                                            }
                                        </IIText>
                                    </Box>
                                </TouchableOpacity>

                            </Animated.View>
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
             {saveCableMutation?.isLoading && (<Spinner
                loading={msg}
            />)}
            {getCableMutation?.isLoading && (<Spinner
                loading={msg}
            />)}
            {StarTimesMutation?.isLoading && (<Spinner
                loading={msg}
            />)}
        </ParentComponent>
    )
}


const styles = StyleSheet.create({
    view: {
        width: 200,
        backgroundColor: Colors.WHITE,
        elevation: 20,
        height: 150,
        // marginRight: 30,
        // marginTop: 20,
        position: 'absolute',
        // display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'flex-start',
        padding: 15
    }
})
export default CableForm