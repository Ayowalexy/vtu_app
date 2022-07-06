import React, { useState } from "react";
import { Modal, View, StyleSheet, TouchableOpacity, StatusBar } from "react-native";
import { IIText } from "../Text/Text";
import { Box } from "../Flexer/Flexer";
import { Colors } from "../utils/colors";
import { useNavigation } from "@react-navigation/native";


const NetworkModal = (props) => {
    const { visible, setVisible, type, data } = props


    const navigation = useNavigation();
    return (
        <Modal
            visible={visible}
            onRequestClose={() => setVisible(!visible)}
            animationType='fade'
            transparent={true}
        >

            <View style={styles.container}>
                <StatusBar
                    backgroundColor='rgba(0,0,0,0.4)'
                />
                <Box
                    h={250}
                    w='80%'
                    r={20}
                    backgroundColor={Colors.WHITE}
                >
                    <IIText type='L' size={18}>
                        {
                                type == 'duplicate'
                                ? 'Something went wrong'
                                : type == 'success'
                                ? 'Now the fun Begins!!'
                                : type == 'invalid'
                                ? 'Invalid'
                                : type == 'verified'
                                ? 'Verified'
                                : type == 'not available'
                                ? 'Service Unavailable'
                                : type == 'added'
                                ? 'Success'
                                : type == 'verify'
                                ? 'Success'
                                : type == 'change'
                                ? 'Success'
                                : type == 'fund'
                                ? 'Success'
                                : type == 'delete'
                                ? 'Success'
                                : 'Something went wrong'
                        }
                    </IIText>
                    <IIText
                        type='B'
                        width={200} t
                        textAlign='center'
                        marginBottom={20}
                    >
                        {
                            type == 'success' ?
                            data
                            : type == 'duplicate'
                            ? data
                            : type == 'internet'
                            ? 'Please check your internet connection and try again'
                            : type == 'invalid'
                            ? data
                            : type == 'added'
                            ? data
                            : type == 'verified'
                            ? data
                            : type == 'not available'
                            ? data
                            : type == 'change'
                            ? data
                            : type == 'fund'
                            ? data
                            : type == 'delete'
                            ? data
                            : type == 'verify'
                            ? 'Your Details has been recorded'
                            : 'Something went wrong, please try again'

                        }
                    </IIText>

                    <Box
                        h={45}
                        w='70%'
                        r={20}
                        backgroundColor={
                            type 
                                == 'success' 
                                || type == 'added' 
                                || type == 'verified' 
                                || type == 'change' 
                                || type == 'fund'
                                || type == 'delete'
                                || type == 'verify'
                                ?
                                Colors.SUCCESS
                                : Colors.PRIMARY
                        }
                    >
                        <TouchableOpacity
                            style={{
                                width: '100%',
                            }}
                            onPress={() => {
                                setVisible(false)
                                if (type == 'success') {
                                    navigation.navigate('Login')
                                } else if (type == 'added') {
                                    navigation.navigate('Airtime Or Data')
                                } else if(type == 'verified'){
                                    navigation.navigate('Tabs')
                                } else if( type == 'change' || type == 'verify'){
                                    navigation.goBack()
                                }
                            }}
                        >
                            <Box
                                h={45}
                            >
                                <IIText
                                    color={
                                        type == 'success'
                                        ? Colors.WHITE
                                        : Colors.DEFAULT
                                    }
                                    type='L' size={17}>
                                    {
                                        type == 'success'
                                            ? 'Login'
                                            : 'Close'
                                    }
                                </IIText>
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


export default NetworkModal