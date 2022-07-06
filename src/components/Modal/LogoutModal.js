import React, { useState } from "react";
import { IIText } from "../Text/Text";
import { Box, IView } from "../Flexer/Flexer";
import IModal from "./Modal";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "../utils/colors";

const LogoutModal = ({visible, setVisible}) => {
    const navigation = useNavigation()
    return (
        <IModal
            visible={visible}
            setVisible={setVisible}
            h={150}
        >
            <IView p={50}>
                <IIText type='B'>Are you sure you want to logout?</IIText>
                <Box
                    flexDirection='row'
                    w={100}
                    paddingTop={20}
                    justifyContent='space-between'
                >
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Login')}
                    >
                        <IIText type='L' color={Colors.ERROR}>Yes</IIText>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setVisible(false)}>
                        <IIText type='L' color={Colors.DEFAULT}>No</IIText>
                    </TouchableOpacity>
                </Box>
            </IView>
        </IModal>
    )
}

export default LogoutModal