import React, { useState, useContext, useEffect } from "react";
import { ITextInput } from "../../components/Input/Input";
import { IIText } from "../../components/Text/Text";
import FormView from "../../components/FormView/FormView";
import { Formik, Field } from "formik";
import * as Yup from 'yup';
import { View, ActivityIndicator } from 'react-native'
import { Button } from "../../components/Flexer/Flexer";
import { useMutation } from "react-query";
import { NetworkContext } from "../../context/NetworkContext";
import NetworkModal from "../../components/Modal/Network";
import { changePassword } from "../../services/network";
import { Colors } from "../../components/utils/colors";

const forgotPasswordSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required')
});


const ForgotPassword = () => {

    const [type, setType] = useState('')
    const [visible, setVisible] = useState(false)
    const [data, setData] = useState('')
    const {isConnected} = useContext(NetworkContext)


    const {isLoading, mutate} = useMutation(changePassword, {
        onSuccess: data => {
            console.log('res', data?.data)
            if(data?.data?.flag == 1){
                setType('reset')
                setData(data?.data?.message)
                setVisible(true)
            } else if(data?.data?.flag == 0){
                setType('invalid')
                setData(data?.data?.message)
                setVisible(true)
            }
        }
    })

   
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
                    />
                </View>


                {hasError && <IIText type='error'>{errors[name]}</IIText>}
            </>
        );
    };

    const handleSubmit = values => {

        if (isConnected) {
            setType('internet')
            setVisible(true)
            return;
        }
        console.log(values)

        mutate(values)


    }


    return (
        <FormView showBack={true}>
            <IIText textAlign='center' size={20} type='L'>
                Reset your password
            </IIText>
            <IIText paddingTop={20} textAlign='center' type='B'>
                Enter your email and we'll send
                you password reset instructions
            </IIText>

            <Formik
                validationSchema={forgotPasswordSchema}
                initialValues={{
                    email: "",
                }}
                onSubmit={(values) => {
                    handleSubmit(values);
                }}>
                {({ handleSubmit, isValid, values, setValues }) => (
                    <>

                        <Field
                            component={CustomInput}
                            name="email"
                            placeholder="Email"
                        />

                        <Button
                            // disabled={isValid}
                            onPress={handleSubmit}
                        >
                            {
                                isLoading 
                                ? <ActivityIndicator size={20} color={Colors.DEFAULT} />
                                : 'Send Reset Link'
                            }
                            
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
            
        </FormView>
    )
}

export default ForgotPassword