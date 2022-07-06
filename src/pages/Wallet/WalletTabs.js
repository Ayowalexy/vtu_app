import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Colors } from '../../components/utils/colors';
import { IIText } from '../../components/Text/Text';
import { Box } from '../../components/Flexer/Flexer';
import Icon from 'react-native-vector-icons/Ionicons'
import { IIFlexer } from '../../components/Flexer/Flexer';


import BankTransfer from './BankTransfer';
import Voucher from './Voucher';
import Debit_Credit_Card from './Card';
import VoucherTab from './VoucherTab';

const Tab = createMaterialTopTabNavigator();


const Tabs = ({ state, descriptors, navigation, position }) => {
    return (
        <View style={styles.container}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate({ name: route.name, merge: true });
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                }
                return (
                    <TouchableOpacity
                            key={index}
                            accessibilityRole="button"
                            accessibilityState={isFocused ? { selected: true } : {}}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            testID={options.tabBarTestID}
                            onPress={onPress}
                            style={[styles.btn, {
                                borderBottomWidth: isFocused ? 2 : 0,
                                borderBottomColor: isFocused ? Colors.DEFAULT : null
                            }]}>
                           
                            <IIText type='B' >{label}</IIText>
                        </TouchableOpacity>
                )
            })}

        </View>
    )
}




const WalletTabs = () => {
    return (
        <Tab.Navigator
            tabBar={props => <Tabs {...props} />}
        >
            <Tab.Screen name="Debit/Credit" component={Debit_Credit_Card} />
            <Tab.Screen name="Bank Transfer" component={BankTransfer} />
            <Tab.Screen name="Voucher" component={VoucherTab} />
            
            
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    btn: {
        display: 'flex',
        width: 120,
        height: 40,
        // marg
        
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    text: {
        color: Colors.DEFAULT,
        fontWeight: 'bold',
        fontSize: 14
    }
})

export default WalletTabs