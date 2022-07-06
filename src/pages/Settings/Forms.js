import React, { useState, useEffect, useContext } from "react";
import { IIText } from "../../components/Text/Text";
import ParentComponent from "../../../navigators";
import FormView from "../../components/FormView/FormView";
import { Header } from "../../components/Flexer/Flexer";
import { Formik, Field } from "formik";
import { View } from "react-native";
import * as Yup from 'yup';
import Spinner from "../../components/Spinner/Spinner";
import NetworkModal from "../../components/Modal/Network";
import { NetworkContext } from "../../context/NetworkContext";
import { ITextInput } from "../../components/Input/Input";
import { Button } from "../../components/Flexer/Flexer";
import ChangePassword from "./ChangePassoword";
import ChangePin from "./ChangePin";
import UpdateProfile from "./UpdateProfile";
import Support from "./Support";
import Biometrics from "./Biometric";
import { useRoute } from "@react-navigation/native";



const UpdateSettings = () => {
    const route = useRoute()
    const { type } = route?.params
    const { isConnected } = useContext(NetworkContext)




    const handleSubmit = values => {
        console.log(values)
    }

    return (
        <ParentComponent>
            <Header>{type || 'Biometrics'}</Header>
            <FormView top={ type == 'Support' ? true : false}>
                {
                  type == 'Change Pin'
                    ? <ChangePin />
                    : type == 'Change Password'
                    ? <ChangePassword />
                    : type == 'Update Profile'
                    ? <UpdateProfile />
                    : type == 'Support'
                    ? <Support />
                    : type == 'Biometrics'
                    ? <Biometrics />
                    : <Biometrics verified={route?.params?.verified} />

                }
            </FormView>
        </ParentComponent>
    )
}


export default UpdateSettings