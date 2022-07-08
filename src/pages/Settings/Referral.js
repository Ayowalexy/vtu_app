import React, { useEffect } from "react";
import { Box } from "../../components/Flexer/Flexer";
import { Colors } from "../../components/utils/colors";
import { Header } from "../../components/Flexer/Flexer";
import { IIText } from "../../components/Text/Text";
import ParentComponent from "../../../navigators";
import { Dimensions, Image, ToastAndroid, TouchableOpacity, Share, Pressable } from "react-native";
import { REFER } from "../../components/utils/Assets";
import Icon from 'react-native-vector-icons/Ionicons'
import Clipboard from '@react-native-community/clipboard';
import { useSelector } from "react-redux";
import { selectSystemRates } from "../../redux/store/user/user.selector";
import { selectCurrentUser } from "../../redux/store/user/user.selector";



const Referral = ({navigation}) => {
    const copyToClipboard = () => {
        Clipboard.setString('5434567');
        ToastAndroid.show("Referral code copied", ToastAndroid.SHORT);
    };


    const user = useSelector(selectCurrentUser)
    const rates = useSelector(selectSystemRates)

    const handleShare = async () => {
        try {
            const result = await Share.share({
                message:
                    `Use my referral code to sign up to  Payrizone VTU and enjoy seamless transactions on bills payment. \n Here is my referral code: ${user?.invite_code} \n\nhttps://www.vtu.payrizone.com`
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                } else {
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            alert(error.message);
        }
    };


    return (
        <ParentComponent>
            <Header>Referral</Header>
            <Box>
                <Box
                    w={Dimensions.get('screen').width}
                    h={300}
                    // r={100}
                    backgroundColor={Colors.PRIMARY}
                    borderBottomRightRadius={40}
                    borderBottomLeftRadius={40}
                >
                    <Image
                        source={REFER}
                        style={{
                            width: 200,
                            height: 200,
                            marginTop: -100
                        }}
                        resizeMode='contain'
                    />
                    <IIText marginTop={-20} type='L' size={19} textAlign='center'>
                        Refer friends {"\n"} and family
                    </IIText>

                </Box>
                <Box
                    w='90%'
                    h={300}
                    r={10}
                    marginTop={-70}
                    backgroundColor={Colors.WHITE}
                    elevation={0.5}
                >
                    <IIText type='B'>
                        Share your invite code
                    </IIText>
                    <TouchableOpacity
                        onPress={copyToClipboard}
                    >
                        <IIText color={Colors.DEFAULT} type='L' size={30}>
                            {user?.invite_code}

                            <Icon name='ios-copy' size={30} color={Colors.DEFAULT} />
                        </IIText>
                    </TouchableOpacity>

                    <IIText textAlign='center' type='B'>Get NGN {rates?.service_fee?.invite_fee} in your Payrizone account{"\n"} when you refer a friend</IIText>

                    <TouchableOpacity
                        onPress={handleShare}
                    >
                        <Box
                            w={300}
                            h={50}
                            r={50}
                            marginTop={30}
                            backgroundColor={Colors.PRIMARY}
                        >
                            <IIText type='B'>INVITE A FRIEND</IIText>
                        </Box>
                    </TouchableOpacity>
                    <Pressable
                        onPress={() => navigation.navigate('How it Works')}
                    >
                        <IIText paddingTop={10} type='B' color={Colors.DEFAULT} size={20}>How it works</IIText>
                    </Pressable>

                </Box>
            </Box>
        </ParentComponent>
    )
}

export default Referral