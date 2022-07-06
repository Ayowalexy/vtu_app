import React, { useState, useContext, useEffect } from "react";
import { Formik, Field } from "formik";
import * as Yup from 'yup';
import { IIText } from "../../components/Text/Text";
import { ITextInput } from "../../components/Input/Input";
import { Button } from "../../components/Flexer/Flexer";
import { View } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons'
import { Colors } from "../../components/utils/colors";
import NetworkModal from "../../components/Modal/Network";
import { NetworkContext } from "../../context/NetworkContext";
import { useMutation } from "react-query";
import { resetPassword } from "../../services/network";
import Spinner from "../../components/Spinner/Spinner";


const changePasswordSchema = Yup.object().shape({
    old_password: Yup.string().required("Please, enter your old password"),
    new_password: Yup.string().required('Please, enter your new password'),
    confirm_new_password: Yup.string()
        .test('passwords-match', 'Password must match', function (value) {
            return this.parent.new_password === value;
        }),
})




const ChangePassword = () => {

    const [type, setType] = useState('')
    const [data, setData] = useState('')
    const [visible, setVisible] = useState('')
    const [msg, setMsg] = useState('')
    const { isConnected } = useContext(NetworkContext)

    const { isLoading, mutate } = useMutation(resetPassword, {
        onSuccess: data => {
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

        setMsg('Updating your Password, Please wait....')

        const payload = {
            ...values,
        }

        console.log(values)
        mutate(values)
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
                validationSchema={changePasswordSchema}
                initialValues={{
                    old_password: '',
                    new_password: '',
                    confirm_new_password: ''

                }}
                onSubmit={(values) => {
                    handleSubmit(values);
                }}>
                {({ handleSubmit, isValid, values, setValues }) => (
                    <>
                        <IIText textAlign='center'>
                            <Icon name='lock-closed' color={Colors.DEFAULT_FADED_2} size={50} />

                        </IIText>
                        <IIText 
                        color={Colors.DEFAULT_FADED_3}
                        type='L' size={20} textAlign='center'>
                            Let's create a new {"\n"} secured Password
                        </IIText>
                        <Field
                            component={CustomInput}
                            name='old_password'
                            placeholder='Old Password'
                            text='Old Password'
                        />
                        <Field
                            component={CustomInput}
                            name='new_password'
                            placeholder='New Passsword'
                            text='New Password'
                        />
                        <Field
                            component={CustomInput}
                            name='confirm_new_password'
                            placeholder='New Password again'
                            text='Confirm New Password'
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


export default ChangePassword