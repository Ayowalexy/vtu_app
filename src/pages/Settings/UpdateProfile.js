import React, { useState, useEffect, useContext } from "react";
import { Formik, Field } from "formik";
import * as Yup from 'yup';
import { IIText } from "../../components/Text/Text";
import { ITextInput } from "../../components/Input/Input";
import { Button } from "../../components/Flexer/Flexer";
import { View } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons'
import { Colors } from "../../components/utils/colors";
import Spinner from "../../components/Spinner/Spinner";
import { NetworkContext } from "../../context/NetworkContext";
import NetworkModal from "../../components/Modal/Network";
import { useMutation } from "react-query";
import { resetProfile } from "../../services/network";






const UpdateProfileSchema = Yup.object().shape({
    first_name: Yup.string().required("Please, enter your first name"),
    last_name: Yup.string().required('Please, enter your last name'),
    phone_number: Yup.string().required("Phone number is required")
})




const UpdateProfile = () => {

    const [type, setType] = useState('')
    const [data, setData] = useState('')
    const [visible, setVisible] = useState(false)
    const [msg, setMsg] = useState('')


    const { isConnected } = useContext(NetworkContext)


    const { isLoading, mutate } = useMutation(resetProfile, {
        onSuccess: data => {
            console.log("data?.data", data?.data)
        }
    })



    const handleSubmit = values => {
        if (isConnected) {
            setType('internet')
            setVisible(true)
            return;
        }

        setMsg('Updating your Profile, Please wait....')

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
                        
                    />
                </View>


                {hasError && <IIText type='B' color='red' size={13}>{errors[name]}</IIText>}
            </>
        );
    };

    return (
        <>
            <Formik
                validationSchema={UpdateProfileSchema}
                initialValues={{
                    last_name: '',
                    first_name: '',
                    phone_number: ''

                }}
                onSubmit={(values) => {
                    handleSubmit(values);
                }}>
                {({ handleSubmit, isValid, values, setValues }) => (
                    <>
                        <IIText textAlign='center'>
                            <Icon name='ios-person-circle-sharp' color={Colors.DEFAULT_FADED_2} size={50} />

                        </IIText>
                        <IIText
                            color={Colors.DEFAULT_FADED_3}
                            type='L' size={20} textAlign='center'>
                            Let's Update your {"\n"} profile
                        </IIText>
                        <Field
                            component={CustomInput}
                            name='last_name'
                            placeholder='Last Name'
                            text='Last Name'
                        />
                        <Field
                            component={CustomInput}
                            name='first_name'
                            placeholder='First Name'
                            text='First Name'
                        />
                        <Field
                            component={CustomInput}
                            name='phone_number'
                            placeholder='Phone Number'
                            text='Phone Number'
                        />

                        <Button
                            onPress={handleSubmit}
                        >
                            Change
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
        </>
    )
}


export default UpdateProfile