import React, { useState, useEffect, useContext } from "react";
import { IIText } from "../../components/Text/Text";
import { ScrollView } from "react-native";
import ParentComponent from "../../../navigators";
import { Header } from "../../components/Flexer/Flexer";
import FormView from "../../components/FormView/FormView";
import { TextInput, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Formik, Field } from "formik";
import * as Yup from 'yup';
import { Colors } from "../../components/utils/colors";
import { Box } from "../../components/Flexer/Flexer";
import { ITextInput } from "../../components/Input/Input";
import Animated, { SlideInLeft, Layout } from "react-native-reanimated";
import { useMutation } from "react-query";
import { getAllPhoneBooks } from "../../services/network";
import Spinner from "../../components/Spinner/Spinner";
import { useSelector } from "react-redux";
import { NetworkContext } from "../../context/NetworkContext";
import { selectServices } from "../../redux/store/user/user.selector";
import NetworkModal from "../../components/Modal/Network";


const PhoneSchema = Yup.object().shape({
    phone_number: Yup.string().required("Please, enter phone number")
})

const PhoneForm = ({ navigation, route }) => {

    const [network, setNetwork] = useState({})
    const [msg, setMsg] = useState('')
    const [type, setType] = useState('')
    const [visible, setVisible] = useState(false)
    const [data, setData] = useState('')
    const [phone_number, set_phone_number] = useState('')
    const [name, setName] = useState('')
    const [saving, setSaving] = useState(false)
    const [verified, setVerified] = useState('')
    const [hasError, setHasError] = useState(false)


    const { isConnected } = useContext(NetworkContext)
    const services = useSelector(selectServices)

    const { isLoading, mutate } = useMutation(getAllPhoneBooks, {
        onSuccess: data => {
            console.log(data?.data)
            if (data?.data?.flag == 1) {
                setNetwork(data?.data?.result)
            } else if (data?.data?.flag == 0) {
                setType('invalid')
                setData(data?.data?.message)
                setVisible(true)
            }
        }
    })


    const handleVerify = (number) => {

        if (isConnected) {
            setType('internet')
            setVisible(true)
            return;
        }

        setMsg('Verifying your number, please wait...')
        set_phone_number(number)
        const filter = services.find(element => element.module_name == 'Airtime')
        const payload = {
            type: 'verify',
            phone_number: number,
            module_id: Number(filter.module_id),
        }

        mutate(payload)
    }

    const handleSave = async () => {

        setSaving(true)
        const payload = {
            phone_number: phone_number,
            operator_name: network?.network,
            name,
            phonebook_type: "Number",
            type: 'add',
            last_product: null,
            expiry_date: null,
        }

        console.log('saving payload', payload)

        if (isConnected) {
            setType('internet')
            setVisible(true)
            return;
        }

        setMsg('Saving your number, please wait...')

        const save = await getAllPhoneBooks(payload)

        if (save?.status == 200) {
            if (save?.data?.flag == 2) {
                setType('invalid')
                setData(save?.data?.message)
                setVisible(true)
            } else if (save?.data?.flag == 1) {
                setType('added')
                setData(save?.data?.message)
                setVisible(true)
            }
        }

        setSaving(false)
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


                {hasError && <IIText type='B' color='red' size={13}>{errors[name]}</IIText>}
            </>
        );
    };



    const handleSubmit = values => {
        handleVerify(values.phone_number)
    }

    return (
        <ParentComponent>
            <Header>Add new Phone Number</Header>
            <FormView>
                <>
                    <Formik
                        validationSchema={PhoneSchema}
                        initialValues={{
                            phone_number: ''

                        }}
                        onSubmit={(values) => {
                            handleSubmit(values);
                        }}>
                        {({ handleSubmit, isValid, values, setValues }) => (
                            <Animated.View
                                layout={Layout.springify()}
                            >
                                <Field
                                    component={CustomInput}
                                    name="phone_number"
                                    text='Enter your phone number'
                                />

                                {
                                    Boolean(Object.values(network)?.length) && (
                                        <>
                                            <Animated.View
                                                entering={SlideInLeft.delay(100)}

                                            >
                                                <Field
                                                    component={CustomInput}
                                                    name="network"
                                                    text='Network'
                                                    editable={false}
                                                    value={network?.network}
                                                />
                                            </Animated.View>

                                            <Animated.View
                                                entering={SlideInLeft.delay(200)}
                                            >
                                                <>
                                                    <View>
                                                        <ITextInput
                                                            value={name}
                                                            onBlur={() => {
                                                                if (name == '') {
                                                                    setHasError(true)
                                                                } else {
                                                                    setHasError(false)
                                                                }
                                                            }}
                                                            onChange={() => {
                                                                setHasError(false)
                                                            }}
                                                            text='Name'
                                                            placeholderTextColor='rgba(0,0,0,0.3)'
                                                            onChangeText={setName}
                                                        />
                                                    </View>


                                                    {hasError && <IIText type='B' color='red' size={13}>Please, enter a name to save with</IIText>}
                                                </>
                                            </Animated.View>

                                        </>
                                    )
                                }

                                <TouchableOpacity
                                    onPress={() => {
                                        if (Object.values(network)?.length) {

                                            if (route?.params?.verified) {
                                                handleSave()
                                            } else {
                                                navigation.navigate('Pin', {
                                                    page: 'Phone Form'
                                                })
                                            }
                                        } else {
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
            {(isLoading || saving) && (<Spinner
                loading={msg}
            />)}


        </ParentComponent>
    )
}


const styles = StyleSheet.create({

})
export default PhoneForm