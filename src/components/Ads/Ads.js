import React, { useEffect, useState } from "react";
import Icon from 'react-native-vector-icons/Ionicons'
import { Image, TouchableOpacity, Modal, View, StyleSheet, Linking } from 'react-native'
import { Box } from "../Flexer/Flexer";
import { Colors } from "../utils/colors";
import { PROMOTION } from "../utils/Assets";
import { IIText } from "../Text/Text";
import { Button } from "../Flexer/Flexer";


const Promotion = ({ data }) => {
    const [visible, setVisible] = useState(true)
    const [count, setCount] = useState(4)

    const timer = () => {
        setTimeout(() => {
            if (count !== 0) {
                setCount(count => count - 1)
            }
        }, 1000);
    }

   

    useEffect(() => {
        if(count !== 0){
           timer()
        }else if(count == 0){
            setVisible(false)
        }
    }, [count])

   

    return (
        <Modal
            visible={visible}
            onRequestClose={() => setVisible(!visible)}
            transparent={false}
            animationType='fade'
        >
            <View style={styles.container}>
                <View style={{
                    position: 'absolute',
                    top: 30,
                    left: 20
                }}>
                    <IIText type='L'>Ad close in {count}</IIText>
                </View>
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
                    source={{
                        uri: data?.promotion_banner
                    }}
                    style={styles.img}
                    resizeMode='contain'
                />
                {
                    data?.promotion_link ? (
                        <>
                            <View
                                style={{
                                    width: 100,
                                    marginTop: -50
                                }}
                            >
                                <Button
                                    outline={true}
                                    onPress={() => Linking.openURL(`${data?.promotion_link}`)}
                                >
                                    {data?.promotion_button}
                                </Button>
                            </View>
                        </>
                    ) : null
                }
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
        height: '80%'
    }
})


export default Promotion