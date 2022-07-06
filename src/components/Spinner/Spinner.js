import React, { useRef, useEffect } from "react";
import { Modal, TouchableOpacity, Image, View, Animated, ActivityIndicator, StyleSheet } from "react-native";
import { APP_LOGO } from "../utils/Assets";
import { IIText } from "../Text/Text";
import { Colors } from "../utils/colors";

const Spinner = ({ visible, setVisible, loading = 'Loading Data, Please wait....' }) => {

    const anim = useRef(new Animated.Value(1)).current;


    const _start = () => {
        Animated.loop(Animated.sequence([
            Animated.timing(anim, {
                toValue: 1.2,
                duration: 1000,
                useNativeDriver: true
            }),
            Animated.timing(anim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true
            })

        ]),

            { iterations: 1000 }
        ).start()
    }

    useEffect(() => {
        _start()
    }, [])


    return <Modal
        visible={visible}
        // onRequestClose={() => setVisible(true)}
        animationType='fade'
        transparent={true}
    >
        <View
            style={style.container}
        >
            <Animated.View
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    transform: [
                        {
                            scale: anim
                        }
                    ]
                }}
            >


                <View
                    style={{
                        position: 'absolute'
                    }}
                >
                    <ActivityIndicator size={120} color={Colors.WHITE} />
                </View>
                <Image
                    source={APP_LOGO}
                    style={style.img}
                />
                <IIText
                    color={Colors.WHITE}
                    size={14}
                    marginTop={22}
                    type="B"
                    textAlign='center'

                >{loading} </IIText>
            </Animated.View>


        </View>
    </Modal>
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    img: {
        width: 60,
        marginTop: 40,
        height: 60,
        borderRadius: 70
    }
})

export default Spinner