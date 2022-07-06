import React, { useEffect, useState } from "react";
import { IIText } from "../../components/Text/Text";
import { Box } from "../../components/Flexer/Flexer";
import { Modal, Image, TouchableOpacity, Linking } from "react-native";
import { APP_UPDATE } from "../../components/utils/Assets";
import { IView } from "../../components/Flexer/Flexer";
import { Colors } from "../../components/utils/colors";
import { useNavigation } from "@react-navigation/native";



const AppUpdate = ({ route , type}) => {
    const [visible, setVisible] = useState(true)
    const navigation = useNavigation()

    return (
        <Modal
            visible={visible}
            onRequestClose={() => {
                if (type == '0') {
                    setVisible(!visible)
                } else {
                    setVisible(true)
                }
            }}
            animationType='fade'
            transparent={false}
        >
            <IView
                p={20}
            >
                <Image
                    source={APP_UPDATE}
                    style={{
                        width: '90%',
                        height: 400
                    }}
                    resizeMode='contain'
                />

                <IIText size={20} type='L' color={Colors.PRIMARY} textAlign='center'>
                    Time to Update!!
                </IIText>

                <IIText textAlign='center' type='B'>
                    There's a newer version of Payrizone available for download,
                    with new and interesting features added, click to download
                </IIText>

                <TouchableOpacity>
                    <Box
                        w='100%'
                        h={50}
                        backgroundColor={Colors.PRIMARY}
                        r={10}
                        marginTop={40}
                    >
                        <IIText type='B'>
                            UPDATE
                        </IIText>
                    </Box>
                </TouchableOpacity>

                {
                    type == '0'
                        ? (
                            <TouchableOpacity
                                onPress={() => setVisible(false)}
                            >
                                <IIText paddingTop={20} textAlign='center' type='B' color={Colors.PRIMARY}>
                                    Skip
                                </IIText>
                            </TouchableOpacity>
                        )
                        : null
                }
            </IView>

        </Modal>
    )
}

export default AppUpdate