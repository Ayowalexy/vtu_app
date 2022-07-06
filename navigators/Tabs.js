import React from 'react'
import { View, Text, Dimensions } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather'
import { Colors } from '../src/components/utils/colors';

import { Box } from '../src/components/Flexer/Flexer';
import Dashboard from '../src/pages/Dashboard/Dashboard';
import Settings from '../src/pages/Settings/Settngs';
import Wallet from '../src/pages/Wallet/Wallet';
const Tab = createBottomTabNavigator();

const Tabs = () => {
  return (
    <Tab.Navigator
      initialRouteName='Home'
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, colors, size }) => {
          console.log(colors)
          let iconName;

          if (route.name === 'Home') {
            iconName = focused
              ? 'home'
              : 'home';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'grid' : 'grid';
          } else if (route.name === 'Wallet') {
            iconName = focused ? 'credit-card' : 'credit-card';
          } else if (route.name === 'Phone Book') {
            iconName = focused ? 'bookmarks-sharp' : 'ios-bookmarks-outline';
          }

          if(route.name == 'Wallet'){
            return (
              <Box
                w={70}
                h={70}
                r={70}
                backgroundColor={Colors.DEFAULT}
                marginBottom={40}
              >
                <Icon name={iconName} size={35} color={Colors.PRIMARY}  />
              </Box>
            ) 
          } else {
            return (
                <Icon name={iconName} size={35} color={focused ? Colors.PRIMARY : Colors.DEFAULT} />
            )
          }

        },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'white',
        tabBarStyle: {
          height: 60
        },
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: true
      })}

    >
      <Tab.Screen name="Home" component={Dashboard} />
      <Tab.Screen name="Wallet" component={Wallet} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
}


export default Tabs