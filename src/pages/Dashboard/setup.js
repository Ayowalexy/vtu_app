import React, { useState, useContext } from "react";
import { Box } from "../../components/Flexer/Flexer";
import { IIText } from "../../components/Text/Text";
import Icon from 'react-native-vector-icons/Ionicons'
import { Colors } from "../../components/utils/colors";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import { useMutation } from "react-query";
import Spinner from "../../components/Spinner/Spinner";
import { selectUserVerificationState } from "../../redux/store/user/user.selector";
import { useSelector } from "react-redux";
import { NetworkContext } from "../../context/NetworkContext";
import NetworkModal from "../../components/Modal/Network";
import { selectCurrentUser } from "../../redux/store/user/user.selector";
import { verifyUserEmail } from "../../services/network";




const Setup = () => {
    const navigation = useNavigation();
    const [msg, setMsg] = useState('')
    const [type, setType] = useState('')
    const [visible, setVisible] = useState(false)
    const verificationState = useSelector(selectUserVerificationState)
    const user = useSelector(selectCurrentUser)

    const { isConnected } = useContext(NetworkContext)

    const { isLoading, mutate } = useMutation(verifyUserEmail, {
        onSuccess: async data => {
            console.log(data?.data)
            if (data?.data?.flag == 1) {
                navigation.navigate('Email Verify')
            } else if (data?.data?.flag == 0) {

                setVisible(true)
            }
        },
    })

    const handleSubmit = values => {

        if (isConnected) {
            setType('internet')
            setVisible(true)
            return;
        }

        setMsg('Verifying, Please wait....')

        const payload = {
            email: user?.email_address,
            id: user?.id
        }
        console.log(payload)

        mutate(payload)

    }

    return (

        <>
            {
                verificationState?.account_status == 'New' && (
                    <TouchableOpacity
                        onPress={handleSubmit}
                        
                    >
                        <Box
                            flexDirection='row'
                            justifyContent='space-between'
                            w='100%'
                            padding={10}
                            borderBottomWidth={0.2}

                        >
                            <Box
                                flexDirection='row'
                                justifyContent="flex-start"
                            >
                                <Box
                                    h={30}
                                    w={30}
                                    r={30}
                                    backgroundColor={Colors.PRIMARY}
                                >
                                    <Icon name='mail-unread' size={15} color={Colors.DEFAULT} />
                                </Box>
                                <IIText
                                    type='B'
                                    size={13}
                                    lineHeight={14}
                                    marginLeft={10}>
                                    Verify your email to {"\n"}secure your account</IIText>
                            </Box>
                            <Box
                                flexDirection='row'
                            >
                                <IIText type='L' size={13} color={Colors.DEFAULT}>
                                    Verify Email
                                </IIText>
                                <Icon name='ios-chevron-forward-sharp' size={20} color={Colors.DEFAULT} />
                            </Box>
                        </Box>
                    </TouchableOpacity>
                )
            }

            {
                !Number(user?.transaction_pin_status) && (
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('Pin', {
                                page: 'Tabs'
                            })
                        }}
                    >
                        <Box
                            flexDirection='row'
                            justifyContent='space-between'
                            w='100%'
                            padding={10}
                            borderBottomWidth={0.2}

                        >
                            <Box
                                flexDirection='row'
                                justifyContent="flex-start"
                            >
                                <Box
                                    h={30}
                                    w={30}
                                    r={30}
                                    backgroundColor={Colors.PRIMARY}
                                >
                                    <Icon name='ios-lock-closed' size={15} color={Colors.DEFAULT} />
                                </Box>
                                <IIText
                                    type='B'
                                    size={13}
                                    lineHeight={14}
                                    marginLeft={10}>
                                    Set up your pin to authenticate {"\n"} all transaction</IIText>
                            </Box>
                            <Box
                                flexDirection='row'
                            >
                                <IIText type='L' size={13} color={Colors.DEFAULT}>
                                    Set up
                                </IIText>
                                <Icon name='ios-chevron-forward-sharp' size={20} color={Colors.DEFAULT} />
                            </Box>
                        </Box>
                    </TouchableOpacity>
                )
            }

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

export default Setup