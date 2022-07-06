import React, { useState } from "react";
import { Modal, View, StyleSheet, TouchableOpacity } from "react-native";
import { IIText } from "../Text/Text";
import { Box } from "../Flexer/Flexer";
import { Colors } from "../utils/colors";


const SuccessModal = (props) => {
    const {visible, setVisible} = props
    return (
        <Modal
            visible={visible}
            onRequestClose={() => setVisible(!visible)}
            animationType='fade'
            transparent={true}
        >

            <View style={styles.container}>

                <Box
                    h={250}
                    w='80%'
                    r={20}
                    backgroundColor={Colors.WHITE}
                >
                    <IIText type='L' size={18}>Now The Fun Begins!!</IIText>
                    <IIText
                        type='B'
                        width={200} t
                        textAlign='center'
                        marginBottom={20}
                    >Your account has been set up completely, continue to Login</IIText>

                    <Box
                        h={45}
                        w='70%'
                        r={20}
                        backgroundColor={Colors.SUCCESS}
                    >
                        <TouchableOpacity
                            style={{
                                width: '100%',
                            }}
                            onPress={() => {
                                setVisible(false)
                            }}
                        >
                            <Box
                             h={45}
                            >
                                <IIText color={Colors.WHITE} type='L' size={17}>Login</IIText>
                            </Box>
                        </TouchableOpacity>

                    </Box>

                </Box>

            </View>

        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center'
    }
})


export default SuccessModal