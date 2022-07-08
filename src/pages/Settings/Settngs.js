import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import { IIText } from "../../components/Text/Text";
import { Header, Box, IView, IFlexer, IIFlexer } from "../../components/Flexer/Flexer";
import LinearGradient from "react-native-linear-gradient";
import { Colors } from "../../components/utils/colors";
import Icon from 'react-native-vector-icons/Ionicons'
import Ion from 'react-native-vector-icons/EvilIcons'
import Spinner from "../../components/Spinner/Spinner";
import { useSelector, useDispatch } from "react-redux";
import LogoutModal from "../../components/Modal/LogoutModal";
import { notifications } from "../../services/network";
import axios from "axios";
import DocumentPicker from 'react-native-document-picker';
import { uploadImage } from "../../services/network";
import { setCurrentUserUserActionAsync } from "../../redux/store/user/user.actions";
import { selectCurrentUser } from "../../redux/store/user/user.selector";
import { launchImageLibrary } from 'react-native-image-picker';



const Settings = ({ navigation }) => {

    const user = useSelector(selectCurrentUser)
    const [visible, setVsisble] = useState(false)
    const [unread, setUnread] = useState(0)
    const [uri, setUri] = useState('')
    const dispatch = useDispatch()

    console.log(user)

    useEffect(() => {
        if (uri) {
            (async () => {
                console.log(uri)
                const res = await uploadImage({ image_path: uri })
                if (res.status == 200) {
                    dispatch(setCurrentUserUserActionAsync())
                }
            })()
        }
    }, [uri])



    const pickImage = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });

            const blob = {
                uri: res[0].uri,
                type: res[0].type,
                name: res[0].name,
            };

            // const result = await launchImageLibrary({
            //     mediaType: 'photo',

            // });

            // console.log("result", result)




            const formData = new FormData();

            let CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/namecoding-web-team/upload'
            for (let i = 0; i < res.length; i++) {
                let file = res[i];
                formData.append("file", file);
                formData.append("upload_preset", "payrizone_passport");

                fetch(CLOUDINARY_URL, {
                    method: "POST",
                    body: formData
                })
                    .then((response) => {
                        return response.json();
                    })
                    .then((data) => {
                        console.log(data)
                        setUri(data.url)
                    })
                    .catch(e => {
                        console.log(e)
                    })

            }




            // console.log(response)
        } catch (e) {
            console.log(e)
        }
    }


    const actions = [
        {
            name: 'Change Pin',
            text: 'Update four digit PIN',
            icon: 'md-lock-closed-outline'
        },
        {
            name: 'Change Password',
            text: 'Change Login Password',
            icon: 'lock-open-outline'
        },
        {
            name: 'Update Profile',
            text: 'Update profile',
            icon: 'person-circle-outline'
        },
        {
            name: 'Biometrics',
            text: 'Enable/Disable Biometric',
            icon: 'finger-print'
        },
        {
            name: 'Transaction History',
            text: 'View Transaction History',
            icon: 'newspaper-outline'
        },
        {
            name: 'Support',
            text: 'Manage tickets and find help',
            icon: 'chatbox-ellipses-outline'
        },
        {
            name: 'Account Statement',
            text: 'Have your transactions sent to you',
            icon: 'chatbox-ellipses-outline'
        },
        {
            name: 'Referral',
            text: 'Copy your referral code and earn',
            icon: 'person-add-outline'
        },
        {
            name: 'Logout',
            text: 'You will be logged out',
            icon: 'exit'
        },
    ]

    useEffect(() => {
        (async () => {
            const nofitication = await notifications({ type: 'unread' })
            setUnread(nofitication?.data)
        })()
    }, [])

    return (
        <View>
            {/* <Header>Settings</Header> */}
            <LinearGradient
                start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }}
                colors={[Colors.PRIMARY_FADED_2, Colors.PRIMARY]}
                style={styles.container}>
                <IIText size={20} type='B' color={Colors.DEFAULT}>Profile</IIText>
                <Box
                    w={70}
                    h={70}
                    r={40}
                    // borderWidth={1}
                    borderColor={Colors.DEFAULT}
                >
                    {/* <Image
                        source={{
                            uri: uri || user?.picture
                        }}
                        style={{
                            width: 70,
                            height: 70,
                            borderRadius: 50
                        }}
                        resizeMode='cover'
                    /> */}

                    <Icon name='md-person-circle-outline' size={70} color={Colors.DEFAULT} />

                    <TouchableOpacity
                        onPress={pickImage}
                        style={{
                            position: 'absolute',
                            left: 40,
                            top: 40
                        }}
                    >
                        <Box
                            h={30}
                            w={30}
                            // backgroundColor={Colors.DEFAULT}
                            r={30}
                        >
                            {/* <Icon
                                name='camera'
                                size={20}
                                color={Colors.WHITE}
                            /> */}
                        </Box>
                    </TouchableOpacity>
                </Box>

                <IIText textTransform='uppercase' type='L' color={Colors.DEFAULT} size={17} >
                    {user?.first_name?.concat(' ', user?.last_name)}
                </IIText>


                <View
                    style={{
                        position: 'absolute',
                        right: 5,
                        top: 10
                    }}
                >
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('Notifications')
                        }}
                    >

                        <View style={styles.icon}>
                            <Ion name='bell' size={30} color={Colors.DEFAULT} />
                        </View>
                    </TouchableOpacity>
                    <Box
                        w={20}
                        h={20}
                        r={30}
                        backgroundColor={Colors.DEFAULT}
                    >
                        <IIText type='L' color={Colors.PRIMARY} sze={8}>
                            {unread?.unread}
                        </IIText>
                    </Box>
                </View>
            </LinearGradient>

            <ScrollView>
                <IView p={20} marginBottom={200}>
                    {
                        actions.map((element, idx) => (
                            <TouchableOpacity
                                onPress={() => {
                                    if (element.name == 'Transaction History') {
                                        navigation.navigate('Transaction History')
                                    } else if (element.name == 'Logout') {
                                        setVsisble(true)
                                        // navigation.navigate('Login')
                                    } else if (element.name == 'Account Statement') {
                                        navigation.navigate('Account Statement')
                                    } else if (element.name == 'Referral') {
                                        navigation.navigate('Referral')
                                    } else {
                                        navigation.navigate('Update settings', {
                                            type: element?.name
                                        })
                                    }
                                }}
                            >
                                <IFlexer
                                    w='100%'
                                    marginVertical={10}
                                    key={idx}
                                    borderBottomWidth={1}
                                    borderBottomColor={Colors.PRIMARY}
                                    backgroundColor={Colors.WHITE}
                                    elevation={0.4}
                                    padding={10}

                                >
                                    <Box
                                        w={60}
                                        h={60}
                                        r={10}
                                        backgroundColor={Colors.PRIMARY_FADED}
                                    >
                                        <Icon name={element.icon} size={25} color={element.name == 'Logout' ? 'red' : Colors.DEFAULT} />
                                    </Box>

                                    <Box
                                        // marginLeft={-60}
                                        paddingLeft={10}
                                        flexDirection='column'
                                        width='70%'
                                        alignItems='flex-start'
                                        justifyContent='flex-start'
                                    >
                                        <IIText type='L' color={element.name == 'Logout' ? 'red' : Colors.DEFAULT}>{element.name}</IIText>
                                        <IIText color={Colors.DEFAULT}>{element.text}</IIText>
                                    </Box>

                                    <Icon name='chevron-forward-outline' size={20} color={Colors.DEFAULT_FADED} />
                                </IFlexer>
                            </TouchableOpacity>
                        ))
                    }

                    <IIText></IIText>
                </IView>
                <LogoutModal visible={visible} setVisible={setVsisble} />
            </ScrollView>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 200,
        width: '100%',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    icon: {
        position: 'absolute',
        right: 20
    }
})

export default Settings