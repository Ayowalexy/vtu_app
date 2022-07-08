import React, { useState, useEffect, useRef, useContext } from "react";
import ReactNativePinView from "react-native-pin-view"
import { NetworkContext } from "../../context/NetworkContext";
import Icon from 'react-native-vector-icons/Ionicons'
import { IIText } from "../../components/Text/Text";
import { Colors } from "../../components/utils/colors";
import { IView, Box } from "../../components/Flexer/Flexer";
import { TouchableOpacity, StyleSheet, Text, View, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentUser } from "../../redux/store/user/user.selector";
import Spinner from "../../components/Spinner/Spinner";
import { useMutation } from "react-query";
import { setPin } from "../../services/network";
import { setCurrentUserUserActionAsync } from "../../redux/store/user/user.actions";
import NetworkModal from "../../components/Modal/Network";
import Animated from "react-native-reanimated";
import LogoutModal from "../../components/Modal/LogoutModal";


const Pin = ({ verified, setVerified, route }) => {
    const pinView = useRef(null)
    const [showRemoveButton, setShowRemoveButton] = useState(false)
    const [enteredPin, setEnteredPin] = useState("")
    const [showDel, setShowDel] = useState(false)
    const [confirmPin, setConfirmPin] = useState('')


    console.log(route?.params?.page)

    const [pine_1, set_pin_1] = useState('1')
    const [pine_2, set_pin_2] = useState('2 ')

    const [showCompletedButton, setShowCompletedButton] = useState(false)
    const [type, setType] = useState('')
    const [msg, setMsg] = useState('')
    const [visible, setVisible] = useState(false)
    const [initial, setInitial] = useState(true)
    const [match, setMatch] = useState(false)
    const user = useSelector(selectCurrentUser)
    const dispatch = useDispatch();
    const { isConnected } = useContext(NetworkContext)
    const [invalid, setInvalid] = useState(false)
    const shateAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;





    const { isLoading, mutate } = useMutation(setPin, {
        onSuccess: data => {
            console.log("data?.data", data?.data)
            if (data?.data?.flag == 1) {
                dispatch(setCurrentUserUserActionAsync())
                navigation.navigate(route?.params?.page, {
                    verified: true,
                    rand: Math.random()
                })
            } else if (data?.data?.flag == 0) {
                pinView.current.clearAll()
                setInvalid(true)

            }
        }
    })

    const navigation = useNavigation()


    useEffect(() => {
        if (Number(user?.transaction_pin_status)) {
            if (enteredPin.length > 0) {
                setShowRemoveButton(true)
            } else {
                setShowRemoveButton(false)
            }
            if (enteredPin.length === 4) {
                setShowCompletedButton(true)
                handleSave()
            } else {
                setShowCompletedButton(false)
                setEnteredPin('')
            }
        } else {


            if (enteredPin.length > 0) {
                setShowRemoveButton(true)
            } else {
                setShowRemoveButton(false)
            }
            if (enteredPin.length === 4 && initial) {
                setShowCompletedButton(true)
                setConfirmPin(enteredPin)
                // setEnteredPin('')
                set_pin_1(enteredPin)

                setTimeout(() => {
                    setInitial(false)
                    pinView.current.clearAll()
                }, 1000)
            } else if ((!initial) && (enteredPin.length == 4)) {
                set_pin_2(enteredPin)

                if (pine_1 == enteredPin) {
                    setMatch(false)
                    handleSave()
                } else {
                    setMatch(true)
                    pinView.current.clearAll()
                    console.log('Pin does not match')
                }

            } else {
                setShowCompletedButton(false)
                setEnteredPin('')
                // setInitial(true)
            }
        }
    }, [enteredPin])

    console.log(shateAnim)

    const startShake = () => {
        Animated.sequence([
            Animated.timing(shateAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
            Animated.timing(shateAnim, { toValue: -10, duration: 100, useNativeDriver: true }),
            Animated.timing(shateAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
            Animated.timing(shateAnim, { toValue: 0, duration: 100, useNativeDriver: true })
        ]).start();
    }


    useEffect(() => {
        // startShake()
    }, [])


    const handleSave = () => {



        if (isConnected) {
            setType('internet')
            setVisible(true)
            return;
        }

        if (Number(user?.transaction_pin_status)) {
            const payload = {
                pin: enteredPin,
                type: 'verify'
            }
            setMsg('Verifying your PIN, Please wait....')


            mutate(payload)
        } else {

            const payload = {
                pin: enteredPin,
                type: 'create'
            }

            setMsg('Setting your PIN, Please wait....')


            mutate(payload)

        }
    }


    const handleVerify = () => {

    }

    return (
        <>
            <IView p={20}>
                <TouchableOpacity
                    onPress={() => {
                        if(route?.params?.prompt){
                            setShowDel(true)
                        } else {
                            navigation.goBack()
                        }
                    }}
                >
                    <Icon name="close" size={30} color={Colors.DEFAULT} />
                </TouchableOpacity>
                <Box
                    w='100%'
                >
                    <Icon name='lock-closed-outline' size={50} color={Colors.DEFAULT} />
                    {
                        initial && (
                            <IIText type='L' size={20} textAlign='center'>
                                {
                                    !(Number(user?.transaction_pin_status))
                                        ? 'Create your Payrizone \n 4 Digit PIN'
                                        : 'Enter your Payrizone \n4 Digit PIN'
                                }

                            </IIText>
                        )
                    }

                    {
                        !initial && (
                            <IIText type='L' size={20} textAlign='center'>
                                {"\n"}Enter again to Complete
                            </IIText>
                        )
                    }
                </Box>

                {
                    match && (<IIText color={Colors.ERROR} type='B' textAlign='center'> Pin Does not Match</IIText>)
                }


                <Box
                    // h={Dimensions.get('screen').height}
                    marginTop={30}
                >
                    <View style={styles.box}>
                       
                        <View

                        >
                            <Animated.View>
                                {
                                    invalid && (<IIText type='B' color={Colors.ERROR} position='absolute' top={80} left={100}>PIN Is incorrect</IIText>
                                    )
                                }
                                <ReactNativePinView
                                    inputSize={32}
                                    ref={pinView}
                                    pinLength={4}
                                    buttonSize={60}
                                    onValueChange={value => setEnteredPin(value)}
                                    buttonAreaStyle={{
                                        marginTop: 24,
                                    }}
                                    inputAreaStyle={{
                                        marginBottom: 24,
                                    }}
                                    inputViewEmptyStyle={[{
                                        backgroundColor: "transparent",
                                        borderWidth: 1,
                                        borderColor: invalid ? Colors.ERROR : Colors.DEFAULT,
                                        height: 60,
                                        width: 60,
                                        borderRadius: 10,
                                        // 
                                    }, {
                                        // transform: [{translateX: shateAnim}]
                                    }]}
                                    inputViewFilledStyle={[{
                                        backgroundColor: Colors.PRIMARY,
                                        height: 60,
                                        width: 60,
                                        borderRadius: 10
                                    },]}
                                    buttonViewStyle={[{
                                        borderWidth: 1,
                                        borderColor: Colors.DEFAULT,

                                    }]}
                                    buttonTextStyle={{
                                        color: Colors.DEFAULT,
                                    }}
                                    onButtonPress={key => {
                                        if (key === "custom_left") {
                                            pinView.current.clear()
                                        }
                                        if (key === "custom_right") {
                                            alert("Entered Pin: " + enteredPin)
                                        }

                                    }}
                                    customLeftButton={<Icon name={"ios-backspace"} size={36} color={Colors.DEFAULT} />}
                                    customRightButton={showCompletedButton ? <Icon name={"lock-closed"} size={36} color={Colors.DEFAULT} /> : undefined}
                                />

                            </Animated.View>
                        </View>
                    </View>
                </Box>

            </IView>
            <LogoutModal 
                visible={showDel}
                setVisible={setShowDel}
            />
            <NetworkModal
                type={type}
                visible={visible}
                setVisible={setVisible}
            />
            {isLoading && (<Spinner
                loading={msg}
            />)}

        </>
    )
}


const styles = StyleSheet.create({
    box: {
        width: '100%',
        backgroundColor: Colors.WHITE,
        borderRadius: 8,


        elevation: 0.6,
        padding: 20,
        marginTop: 10
    }
})

export default Pin