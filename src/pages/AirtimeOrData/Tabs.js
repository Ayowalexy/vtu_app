import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Colors } from '../../components/utils/colors';
import { IIText } from '../../components/Text/Text';
import { Box } from '../../components/Flexer/Flexer';
import Icon from 'react-native-vector-icons/Ionicons'
import { IIFlexer } from '../../components/Flexer/Flexer';


import SavedNumbers from './SavedNumbers';
import SavedBills from './SavedBills';
import SavedElectricity from './SavedElectricity';
import SavedBanks from './SavedBanks';

import SavedNumberTab from './Tabs/SavedNumberTabs';

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
                           
                            <Box>
                                <Box
                                    w={80}
                                    h={90}
                                    r={15}
                                    backgroundColor={Colors.PRIMARY_FADED}
                                >
                                    <Icon name={
                                        label == 'Airtime & Data'
                                        ? 'phone-portrait-outline'
                                        : label == 'Cables TV'
                                        ? 'ios-tv-outline'
                                        : label == 'Meters'
                                        ? 'flash-outline'
                                        : label == 'Banks'
                                        ? 'home-outline'
                                        : null
                                    } size={40} color={Colors.DEFAULT} />
                                </Box>
                            </Box>
                            <IIText size={13} type='B' top={20}>{label}</IIText>
                        </TouchableOpacity>
                )
            })}

        </View>
    )
}


const AirtimeAndBillsTab = ({initialRouteName}) => {
    return (
        <Tab.Navigator
            initialRouteName={initialRouteName}
            tabBar={props => <Tabs {...props} />}
        >
            <Tab.Screen name="Airtime & Data" component={SavedNumbers} />
            <Tab.Screen name="Cables TV" component={SavedBills} />
            <Tab.Screen name="Meters" component={SavedElectricity} />
            <Tab.Screen name="Banks" component={SavedBanks} />
            
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    btn: {
        display: 'flex',
        width: 120,
        height: 150,
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

export default AirtimeAndBillsTab