import React from "react";
import { Box } from "../../components/Flexer/Flexer";
import { IIText } from "../../components/Text/Text";
import { Colors } from "../../components/utils/colors";
import { Header } from "../../components/Flexer/Flexer";
import ParentComponent from "../../../navigators";
import Icon from 'react-native-vector-icons/Ionicons'
import { IView } from "../../components/Flexer/Flexer";
import { useSelector } from "react-redux";
import { selectSystemRates } from "../../redux/store/user/user.selector";



const HowItWorks = () => {
    const rates = useSelector(selectSystemRates)
    return (
        <ParentComponent>
            <Header>{''}</Header>
            <Box>
                <IIText size={30} paddingTop={30} color={Colors.PRIMARY} type='L' >How it works</IIText>
                <IIText textAlign='center' paddingTop={10} type='B' width={300}>You can earn from inviting a friend to use our system to perform their daily needs, all it requires is to share your promo code, that’s all you earn.</IIText>

            </Box>

            <IView p={20}>
                <Box
                    alignItems='flex-start'
                >
                    {
                        [
                            {
                                title: 'Step 1',
                                value: 'Share your invite code with your friends',
                                icon: 'person'
                            },
                            {
                                title: 'Step 2',
                                value: 'Your friend signs up, deposits and fund their wallet with a minimum of NGN 5,000',
                                icon: 'wallet'
                            },
                            {
                                title: 'Step 3',
                                value: `You get NGN ${rates?.service_fee?.invite_fee} into your wallet account`,
                                icon: 'gift'
                            },
                        ].map((element, idx) => (
                            <Box
                                flexDirection='row'
                                marginBottom={20}
                            >
                                <Box
                                    w={60}
                                    h={60}
                                    r={40}
                                    backgroundColor={Colors.PRIMARY}
                                    
                                >
                                    <Icon name={element?.icon} size={30} color={Colors.WHITE} />
                                </Box>
                                <Box 
                                    paddingLeft={20}
                                    alignItems='flex-start'
                                    w={250}>
                                    <IIText type='L' size={18}>{element?.title}</IIText>
                                    <IIText type='B'>{element?.value}</IIText>
                                </Box>
                            </Box>
                        ))
                    }
                </Box>
            </IView>
        </ParentComponent>
    )
}

export default HowItWorks