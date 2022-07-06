import React, { useState } from "react";
import { Box } from "../Flexer/Flexer";
import { IIText } from "../Text/Text";
import { View } from "react-native";
import { Modal, Image, Linking } from "react-native";
import { ACCESS_DENIED } from "../utils/Assets";
import { Colors } from "../utils/colors";
import { Button } from "../Flexer/Flexer";
import { useNavigation } from "@react-navigation/native";


const AccountModal = ({ visible, setVisible }) => {
    const navigation = useNavigation()
    return (
        <Modal
            visible={true}
            onRequestClose={() => navigation.goBack()}
            animationType='fade'
            transparent={true}
        >
            <View
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0,0,0,0.5)'
                }}
            >
                <Box
                    w='90%'
                    h={500}
                    r={20}
                    backgroundColor={Colors.WHITE}
                    padding={20}
                >
                    <Image
                        source={ACCESS_DENIED}
                        style={{
                            width: '90%',
                            height: 300
                        }}
                        resizeMode='contain'
                    />

                    <IIText textAlign='center' type='B'>
                        Only users that have completed KYC {"\n"} can use this service,
                        click to complete
                    </IIText>
                    <View
                        style={{
                            width: '100%'
                        }}
                    >
                        <Button
                            onPress={() => Linking.openURL('https://vtu.payrizone.com/kyc.php')}
                        >
                            Complete KYC
                        </Button>

                    </View>
                </Box>

            </View>

        </Modal>
    )
}

export default AccountModal