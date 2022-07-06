import React from "react";
import { View, Modal, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { Colors } from "../utils/colors";
import { IIcon } from "../Flexer/Flexer";


const IModal = ({ visible, setVisible, h, children }) => {
    console.log(visible)
    return (
            <Modal
                visible={visible}
                onRequestClose={() => setVisible(!visible)}
                transparent={true}
                animationType='slide'
            >
                <View style={styles.container}>
                    <View style={[styles.box, { height: h ? h : 200 }]}>
                        <TouchableOpacity
                            onPress={() => setVisible(false)}
                            style={styles.icon}>
                            <IIcon
                                name='close'
                                size={20}
                                color={Colors.DEFAULT}
                            />
                        </TouchableOpacity>
                        {children}
                    </View>
                </View>
            </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.7)'
    },
    box: {
        backgroundColor: Colors.WHITE,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,

    },
    icon: {

        position: 'absolute',
        top: 20, right: 20
    }
})

export default IModal