import React, { useState, useEffect, useContext } from "react";
import { Formik, Field } from "formik";
import * as Yup from 'yup';
import { IIText } from "../../components/Text/Text";
import { ITextInput } from "../../components/Input/Input";
import { Button } from "../../components/Flexer/Flexer";
import { ColorPropType, View } from "react-native";
import Spinner from "../../components/Spinner/Spinner";
import { useMutation } from "react-query";
import NetworkModal from "../../components/Modal/Network";
import { NetworkContext } from "../../context/NetworkContext";
import { setPin } from "../../services/network";
import Icon from 'react-native-vector-icons/Ionicons'
import { Colors } from "../../components/utils/colors";




const ChangePinSchema = Yup.object().shape({
    new_pin: Yup.string().required("Please, enter your new pin"),
    password: Yup.string().required('Please, enter your password'),
    confirm_new_pin: Yup.string()
        .test('passwords-match', 'Pin must match', function (value) {
            return this.parent.new_pin === value;
        }),

})

const ChangePin = () => {
    const [type, setType] = useState('')
    const [data, setData] = useState('')
    const [visible, setVisible] = useState('')
    const [msg, setMsg] = useState('')
    const { isConnected } = useContext(NetworkContext)



    const { isLoading, mutate } = useMutation(setPin, {
        onSuccess: data => {
            console.log(data?.data)
            if (data?.data?.flag == 1) {
                setData(data?.data?.message)
                setType('change')
                setVisible(true)
            } else if (data?.data?.flag == 0) {
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
            return;
        }

        setMsg('Updating your pin, Please wait....')

        const payload = {
            ...values,
            type: 'change'
        }

        mutate(payload)
    }



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
                        keyboardType='number-pad'
                    />
                </View>


                {hasError && <IIText type='B' color='red' size={13}>{errors[name]}</IIText>}
            </>
        );
    };


    return (
        <>
            <Formik
                validationSchema={ChangePinSchema}
                initialValues={{
                    password: '',
                    new_pin: '',
                    confirm_new_pin: ''

                }}
                onSubmit={(values) => {
                    handleSubmit(values);
                }}>
                {({ handleSubmit, isValid, values, setValues }) => (
                    <>
                        <IIText  textAlign='center'>
                            <Icon name='lock-closed' color={Colors.DEFAULT_FADED_2} size={50} />

                        </IIText>
                        <IIText 
                        color={Colors.DEFAULT_FADED_3}
                        type='L' size={20} textAlign='center'>
                            Let's create a new {"\n"} secured PIN
                        </IIText>

                        <Field
                            component={CustomInput}
                            name='new_pin'
                            placeholder='New Pin'
                            text='New Pin'
                            maxLength={4}
                        />
                        <Field
                            component={CustomInput}
                            name='confirm_new_pin'
                            placeholder='New Pin again'
                            text='Confirm New Pin'
                            maxLength={4}
                        />
                        <Field
                            component={CustomInput}
                            name='password'
                            placeholder='Password'
                            text='Password'
                        />

                        <Button
                            onPress={handleSubmit}
                        >
                            Change
                        </Button>
                    </>
                )}
            </Formik>

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
    )
}


export default ChangePin