import React from 'react'
import { View, Text, Dimensions, Pressable, StyleSheet, TouchableOpacity } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/AntDesign'

import SavedNumbers from '../SavedNumbers';
import { Box } from '../../../components/Flexer/Flexer';
import { Colors } from '../../../components/utils/colors';
import { useNavigation } from '@react-navigation/native';
import { IIText } from '../../../components/Text/Text';
import { Popover, usePopover } from 'react-native-modal-popover';



const Tab = createBottomTabNavigator();

const TabBar = () => {
    const navigation = useNavigation();
    return (
        <TouchableOpacity 
            onPress={() => {
                navigation.navigate('Contact Support')
            }}
        style={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            top: -400

        }}>
            <Box
                w={70}
                h={70}
                backgroundColor={Colors.PRIMARY}
                r={40}
            >
                <Icon name='plus' color={Colors.DEFAULT} size={30} />
            </Box>
        </TouchableOpacity>
    )
}

const ScreenOption =() => (
    <IIText>Jkk</IIText>
)

const SavedNumberTab = () => {
    return (
        <Tab.Navigator
            initialRouteName='My Saved Numbers'
            screenOptions={({ route }) => ({
                tabBarActiveTintColor: 'white',
                tabBarInactiveTintColor: 'white',
                tabBarStyle: {
                    height: 60
                },
                headerShown: false,
                tabBarHideOnKeyboard: true,
                tabBarShowLabel: true
            })}
            // tabBar={props => <TabBar {...props} />}

        >
            <Tab.Screen name="My Saved Numbers" component={SavedNumberTab} />
            <Tab.Screen name="My Saved " component={ScreenOption} />
        </Tab.Navigator>
    );
}



const styles = StyleSheet.create({
    app: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#c2ffd2',
    },
    content: {
        padding: 16,
        borderRadius: 8,
        backgroundColor: 'rgba(0, 0, 0, 0)',

        // marginLeft: -20,
        // right: 0,

        width: 100,
        height: 140,
        borderRadius: 30,
        zIndex: 20
    },
    arrow: {
        borderTopColor: 'pink',

        opacity: 0
    },
    background: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
});



export default SavedNumberTab