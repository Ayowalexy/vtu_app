import React, { useState, useRef, useEffect } from "react";
import { Box, IFlexer } from "../../components/Flexer/Flexer";
import { IIText } from "../../components/Text/Text";
import { View, StyleSheet, Modal, Image, TouchableOpacity, ImageBackground } from "react-native";
import { Colors } from "../../components/utils/colors";
import Icon from 'react-native-vector-icons/Ionicons'
import { IView } from "../../components/Flexer/Flexer";
import { HEAD, APP_LOGO } from "../../components/utils/Assets";
import ViewShot, { captureRef, captureScreen } from "react-native-view-shot";
import Share from 'react-native-share'
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/store/user/user.selector";
import { formatNumber } from "../../utils/formatter";
import { useNavigation } from "@react-navigation/native";




const Receipt = ({ visible, channel, setVisible, amount, number, data = {} }) => {
    // const [visible, setVisible] = useState(false)
    const viewShotRef = useRef(null);
    const navigation = useNavigation();
    const user = useSelector(selectCurrentUser)
    const shareImage = async () => {
        try {
            const uri = await captureRef(viewShotRef, {
                format: 'png',
                quality: 0.9
            })
            await Share.open({ url: uri })
        } catch (e) {
            console.log(e)
        }
    }
    // Shot

    const Shareble = () => (
        <>
            <ViewShot
                ref={viewShotRef}
                options={{ format: 'jpg', quality: 0.9 }}
                style={{
                    width: '100%',
                    height: 400,
                    position: 'absolute',
                    opacity: 0

                    // backgroundColor: Colors.DEFAULT
                    // zIndex: 20,
                    // display: 'none'
                }}
            >
                <Box
                    justifyContent='center'
                    alignItems='center'
                    backgroundColor={Colors.PRIMARY}

                    h={100}
                >
                    <Image
                        source={APP_LOGO}
                        style={{
                            width: 50,
                            height: 50,
                            borderRadius: 10
                        }}
                    />
                    <IIText type='L'>Payrizone</IIText>
                </Box>
                <Box
                    height={230}
                    backgroundColor={Colors.WHITE}
                >
                    <Icon name='ios-checkmark-circle' size={65} color={Colors.SUCCESS} />
                    <IIText width={300} paddingTop={10} type='B' textAlign='center'>
                        {
                            data?.type == 'Airtime'
                                ? 'Airtime recharge was successful'
                                : data?.type == 'Data'
                                    ? 'Data bundle purchased successfully'
                                    : data?.type == 'Transfer'
                                        ? 'Transfer was successful'
                                        : data?.type == 'Electricity Payment'
                                            ? 'Electricity payment successful'
                                            : 'Account funded successfully'
                        }
                        {"\n"}
                        with ₦{formatNumber(amount)} {"\n"}

                        <IIText type='B' textTransform='uppercase'>
                            {user?.first_name?.concat(' ', user?.last_name)}
                        </IIText>{"\n"}
                        <IIText textTransform='capitalize'>
                            {
                                Object.keys(data)?.map((element, idx) => (
                                    <>
                                        {element}: {data[element]}  {"\n"}
                                    </>
                                ))
                            }
                        </IIText>
                        {/* Method: {channel ? channel : 'PayStack'} {"\n"}
                        {number ? null : 'Account'} Number: {number ? number : user?.account_number} */}

                    </IIText>
                </Box>

            </ViewShot>
        </>
    )

    return (
        <Modal
            visible={visible}
            onRequestClose={() => setVisible(!visible)}
            animationType='fade'
            transparent={false}
        >
            <View
                style={styles.container}
            >
                <>


                    <Shareble />
                    <ImageBackground
                        source={APP_LOGO}
                        style={{
                            height: 500,
                        }}
                        resizeMode="cover"


                    >
                        <View
                            style={{
                                backgroundColor: 'rgba(255,255,255,0.93)',
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                elevation: 20
                            }}
                        >
                            <View style={styles.box}>
                                <IFlexer padding={30}>
                                    <IIText type='L' size={20}>Successful</IIText>
                                    <TouchableOpacity
                                        onPress={() => setVisible(false)}
                                    >
                                        <Icon name='close' size={30} color={Colors.DEFAULT} />

                                    </TouchableOpacity>
                                </IFlexer>
                                <IView paddingLeft={30} marginTop={-10}>
                                    <Box w={90} h={3} backgroundColor={Colors.PRIMARY} />
                                </IView>
                                <Box
                                    justifyContent='center'
                                    alignItems='center'
                                    paddingTop={10}

                                >
                                    {/* <Image
                            source={HEAD}
                            style={{
                                width: 100,
                                height: 100,
                            }}
                        /> */}

                                    <Icon name='ios-checkmark-circle' size={65} color={Colors.SUCCESS} />
                                </Box>
                                <Box w='100%' justifyContent='center'>
                                    <IIText width={300} paddingTop={10} type='B' textAlign='center'>
                                        {
                                            data?.type == 'Airtime'
                                                ? 'Airtime recharge was successful'
                                                : data?.type == 'Data'
                                                    ? 'Data bundle purchased successfully'
                                                    : data?.type == 'Transfer'
                                                        ? 'Transfer was successful'
                                                        : data?.type == 'Electricity Payment'
                                                            ? 'Electricity payment successful'
                                                            : 'Account funded successfully'
                                        }
                                        {"\n"}
                                        with ₦{formatNumber(amount)} {"\n"}

                                        <IIText type='B' textTransform='uppercase'>
                                            {user?.first_name?.concat(' ', user?.last_name)}
                                        </IIText>{"\n"}

                                        <IIText  textTransform='capitalize'>
                                            {
                                                Object.keys(data)?.map((element, idx) => (
                                                    <>
                                                       <IIText
                                                            color={element == 'Token' ? Colors.SUCCESS : Colors.DEFAULT}
                                                         type={element == 'Token' ? 'L' : 'B'}>{element}: {data[element]}  {"\n"}</IIText>
                                                    </>
                                                ))
                                            }
                                        </IIText>
                                        {/* Method: {channel ? channel : 'PayStack'} {"\n"}
                                        Account Number: {user?.account_number} */}

                                    </IIText>
                                    <Box w='100%' justifyContent='center'>
                                        <TouchableOpacity
                                            onPress={() => {
                                                if (data?.type == 'Transfer') {
                                                    navigation.navigate('Tabs')
                                                }
                                                setVisible(false)
                                            }}
                                        >
                                            <Box
                                                marginTop={50}
                                                r={50}
                                                width={230}
                                                height={40}
                                                justifyContent='center'
                                                alignItems='center'
                                                borderColor={Colors.PRIMARY}
                                                borderWidth={2}
                                            >
                                                <IIText type='B'>Ok</IIText>
                                            </Box>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={shareImage}>
                                            <Box
                                                marginTop={10}
                                                r={50}
                                                width={230}
                                                height={40}
                                                justifyContent='center'
                                                alignItems='center'
                                                backgroundColor={Colors.PRIMARY}
                                            >
                                                <IIText color={Colors.DEFAULT} type='B'>Share</IIText>
                                            </Box>
                                        </TouchableOpacity>
                                    </Box>
                                </Box>
                            </View>

                        </View>

                    </ImageBackground>

                </>

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
    box: {
        // backgroundColor: Colors.WHITE,
        // height: 500,
        width: '100%',

    }
})

export default Receipt