import React from "react";
import { Text, ScrollView, StyleSheet, View, Image, TouchableOpacity } from 'react-native'
import { APP_LOGO, AD_1, AD_2, AD_3 } from '../../components/utils/Assets'
import ParentComponent from "../../../navigators";
import IText from "../../components/Text/Text";
import IView from "../../components/View/View";
import Swiper from "react-native-swiper";
import Button from "../../components/Buttons/Button";
import Icon from "react-native-vector-icons/Ionicons";
import { Colors } from "../../components/utils/colors";
import FLexer from "../../components/Flexer/Flexer";



const OnBoarding = () => {
    return (
        <ParentComponent>
            <ScrollView style={styles.container}>
                <View style={styles.view}>
                    <Image source={APP_LOGO} style={styles.image} />
                    <IView type='flex' size='L'>
                        <IText type='SM'>All Your Transactions</IText>
                        <IText styling={{ marginTop: -10 }} type='SM_C'>All In One Place</IText>
                    </IView>

                    <Swiper autoplay loop activeDotColor={Colors.PRIMARY} style={styles.wrapper}>
                        {
                            [AD_1, AD_2, AD_3].map((element, idx) => (
                                <Image source={element} key={idx} style={styles.ad} />
                            ))
                        }
                    </Swiper>

                    <Button navigateTo='Login' outline={true}>Login</Button>
                    <Button navigateTo='Sign Up' outline={false}>Sign Up</Button>
                </View>

                <FLexer h={100} w='80%'>
                    {
                        [
                            {
                                name: 'Help \n',
                                icon: 'ios-bonfire-outline'
                            },
                            {
                                name: 'Quick \nLink',
                                icon: 'flash-outline'
                            },
                            {
                                name: 'Get a \nWallet',
                                icon: 'wallet-outline'
                            },
                        ].map((element, idx) => (
                            <View key={idx} >
                                <TouchableOpacity style={styles.Touch}>
                                    <Icon name={element.icon} color={Colors.DEFAULT} size={23} />
                                </TouchableOpacity>
                                <IText type='SSM' styling={{textAlign: 'center'}}>{element.name}</IText>
                            </View>
                        ))
                    }
                </FLexer>

            </ScrollView>
        </ParentComponent>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 15
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 20
    },
    view: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    ad: {
        width: '100%',
        height: 200
    },
    wrapper: {
        marginTop: 40,
        height: 250
    },
    Touch: {
        display: 'flex',
        justifyContent: 'center',
        width: 60,
        height: 60,
        alignItems: 'center',
        backgroundColor: Colors.PRIMARY_FADED,
        borderRadius: 10
    }
})

export default OnBoarding