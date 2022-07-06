import React, { useRef, useContext, useEffect, useState } from "react"
import { NetworkContext } from "../src/context/NetworkContext"
import {  ScrollView, Alert, Text, StyleSheet, AppState, Animated, StatusBar } from 'react-native'
import IText from "../src/components/Text/Text"
import NetInfo from "@react-native-community/netinfo";
import { IIText } from "../src/components/Text/Text";
import Inactivty from "./Inactivity";
import { Box } from "../src/components/Flexer/Flexer";
import UserInactivity from 'react-native-user-inactivity';
import { Modal, View, TouchableOpacity, ActivityIndicator } from "react-native";
import { Colors } from "../src/components/utils/colors";
import CodeInput from 'react-native-confirmation-code-input';
import { useMutation } from "react-query";
import { setPin } from "../src/services/network";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";

const ParentComponent = ({ children }) => {

    const anim = useRef(new Animated.Value(-100)).current

    const [isOffline, setOfflineStatus] = useState(false);

    const { isConnected, setIsConnected } = useContext(NetworkContext)

    const appState = useRef(AppState.currentState);

    const [showInactivity, setShowInactivity] = useState(false)

    const navigation = useNavigation();

    const route = useRoute();

    const pages_not_to_show_inactivity_modal = ['Login', 'OnBoarding', 'Pin', 'Sign Up']

    const [visible, setVisible] = useState(showInactivity)
    const [active, setActive] = useState(true);
    const [timer, setTimer] = useState(2000);
    const [value, setValue] = useState('')
    const val = useRef()
    const [error, setError] = useState(false)
    const showRef = useRef(false)

    const { isLoading, mutate } = useMutation(setPin, {
        onSuccess: data => {
            console.log(data?.data)
            if(data?.data?.flag == 1){
                showRef.current == false
                setShowInactivity(false)
            } else if(data?.data?.flag == 0){
                setError(true)
            }
        }
    })


    useEffect(() => {
        const removeNetInfoSubscription = NetInfo.addEventListener((state) => {
            const offline = !(state.isConnected && state.isInternetReachable);
            setOfflineStatus(offline);
            setIsConnected(offline)
        });
        return () => removeNetInfoSubscription();
    }, []);


    const fadeAnim = useRef(new Animated.Value(0)).current;

    const fadeIn = () => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true
        }).start();
    };

    const fadeOut = () => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true
        }).start();
    };


    const NoInternet = () => {
        return (
            <Animated.View style={[styles.container, {
                // height: 0
                opacity: 1,
                transform: [{
                    translateY: fadeAnim
                }]
            }]}>
                <StatusBar
                    backgroundColor='red'
                />
                <IIText size={17} color={Colors.WHITE} type='B'>No Internet Connection</IIText>
            </Animated.View>
        )
    }

    const d_1 = useRef(0)
    const d_2 = useRef(0)
    const inittialRender = useRef(false)



    useEffect(() => {
        const subscription = AppState.addEventListener("change", async nextAppState => {

            if(pages_not_to_show_inactivity_modal.includes(route?.name)){
                return
            }
            if (inittialRender.current) {
                appState.current = nextAppState;
                if (appState.current === 'active') {
                    d_1.current = Date.now()
                    if (d_1.current - d_2.current > 3000) {
                        console.log('Inactive for more than one minutes')

                        navigation.navigate('Pin', {
                            page: 'Tabs',
                            prompt: true
                        })
                    } else {
                        console.log('Active under 1 minutes')
                        
                    }
                }

                if (appState.current === 'background') {
                    console.log('new background')
                    d_2.current = Date.now()
                }
            } else {
                inittialRender.current = true
            }
        });
        return () => {
            subscription.remove();
        };
    }, []);

    return (
        <View>

            {isOffline && <NoInternet />}
            {children}
            <Modal
                visible={showRef}
                onRequestClose={() => setShowInactivity(true)}
                animationType='fade'
                transparent={true}
            >
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0,0,0,0.5)'
                    }}
                >
                    <Box
                        w='80%'
                        h={300}
                        r={10}
                        paddingTop={20}
                        paddingBottom={30}
                        backgroundColor={Colors.WHITE}

                    >
                        <IIText width={250} textAlign='center' type='L'>
                            You have been inactive for a while,
                            please verify you are still active
                        </IIText>
                        <CodeInput
                            secureTextEntry
                            activeColor='rgba(49, 180, 4, 1)'
                            inactiveColor='rgba(49, 180, 4, 1.3)'
                            autoFocus={false}
                            codeLength={4}
                            ignoreCase={true}
                            inputPosition='center'
                            size={50}
                            onFulfill={(code) => val.current = code}
                            containerStyle={{ marginTop: 30 }}
                            codeInputStyle={{ borderWidth: 1.5, borderColor: Colors.PRIMARY, color: Colors.PRIMARY }}
                        />
                        {error && <IIText color={Colors.ERROR} type='B' size={12}>Invalid PIN</IIText>}
                        <TouchableOpacity
                            onPress={() => {

                                console.log({
                                    pin: val.current,
                                    type: 'verify'
                                })
                                mutate({
                                    pin: val.current,
                                    type: 'verify'
                                })
                            }}
                        >
                            <Box
                                w={100}
                                h={50}
                                r={10}
                                backgroundColor={Colors.PRIMARY}

                            >
                                <IIText type='B' color={Colors.DEFAULT}>
                                    {
                                        isLoading ? <ActivityIndicator size={20} color={Colors.DEFAULT} /> : 'Verify'
                                    }
                                </IIText>
                            </Box>
                        </TouchableOpacity>
                    </Box>

                </View>
            </Modal>


        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 40,
        backgroundColor: 'red',
        padding: 5,
        paddingLeft: 10,
        position: 'absolute',
        top: 0,
        zIndex: 100


    },
    font: {
        color: Colors.WHITE,
        // marginTop: -10
    }
})


export default ParentComponent