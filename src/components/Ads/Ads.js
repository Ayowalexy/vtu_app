import React, { useState } from "react";
import Icon from 'react-native-vector-icons/Ionicons'
import { Image, TouchableOpacity, Modal, View, StyleSheet } from 'react-native'
import { Box } from "../Flexer/Flexer";
import { Colors } from "../utils/colors";
import { PROMOTION } from "../utils/Assets";
import { IIText } from "../Text/Text";


const Promotion = ({image}) => {
    const [visible, setVisible] = useState(true)
    return (
        <Modal
            visible={visible}
            onRequestClose={() => setVisible(!visible)}
            transparent={false}
            animationType='fade'
        >
            <View style={styles.container}>
                <TouchableOpacity 
                    onPress={() => setVisible(!visible)}
                    style={styles.position}>
                    <Box
                        h={40}
                        w={100}
                        flexDirection='row-reverse'
                    >
                        <IIText type='b'>Close AD</IIText>
                        <Icon name='close' size={20} color={Colors.DEFAULT} />
                    </Box>
                </TouchableOpacity>

                <Image
                    source={PROMOTION}
                    style={styles.img}
                />
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.WHITE,
        justifyContent: 'center',
        alignItems: 'center'
    },
    position: {
        position: 'absolute',
        top: 20,
        right: 20
    },
    img: {
        width: '100%',
        height:'80%'
    }
})


export default Promotion