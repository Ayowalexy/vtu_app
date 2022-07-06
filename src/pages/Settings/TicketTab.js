import React from 'react'
import { View, Text, Dimensions } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons'
import { Colors } from '../../components/utils/colors';
import { TouchableOpacity } from 'react-native';

import { Box } from '../../components/Flexer/Flexer';
import MyTickets from './Tickets';
import { useNavigation } from '@react-navigation/native';



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
            right: 20

        }}>
            <Box
                w={70}
                h={70}
                backgroundColor={Colors.PRIMARY}
                r={40}
            >
                <Icon name='chatbox-ellipses' color={Colors.DEFAULT} size={30} />
            </Box>
        </TouchableOpacity>
    )
}

const TicketTabs = () => {
    return (
        <Tab.Navigator
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
            tabBar={props => <TabBar {...props} />}

        >
            <Tab.Screen name="My Saved Tickets" component={MyTickets} />
        </Tab.Navigator>
    );
}


export default TicketTabs