import React, {useRef} from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Colors } from '../../components/utils/colors';
import { IIText } from '../../components/Text/Text';
import { Box } from '../../components/Flexer/Flexer';
import Icon from 'react-native-vector-icons/Ionicons'
import { IIFlexer } from '../../components/Flexer/Flexer';
import { IFlexer } from '../../components/Flexer/Flexer';

const PlusTab = () => {
    return (
        <>
            <IFlexer
                justifyContent='space-evenly'
            >
                <Box
                    w='100%'
                    height={50}
                    alignItems='flex-end'

                >
                    <Pressable
                        ref={touchableRef}
                        onPress={openPopover}
                    >
                        <Box
                            w={60}
                            h={60}
                            r={40}
                            marginRight={20}
                            backgroundColor={Colors.PRIMARY}
                        >
                            <Icon name='add' color={Colors.DEFAULT} size={30} />
                        </Box>
                    </Pressable>
                </Box>



                <Popover
                    contentStyle={styles.content}
                    arrowStyle={styles.arrow}
                    backgroundStyle={styles.background}
                    visible={popoverVisible}
                    placement='top'
                    onClose={closePopover}
                    fromRect={popoverAnchorRect}
                    supportedOrientations={['portrait', 'landscape']}>
                    <Box>
                        <TouchableOpacity
                            onPress={() => {
                                closePopover()
                                navigation.navigate('Airtime')
                            }}
                        >
                            <Box
                                flexDirection='row'
                                backgroundColor={Colors.PRIMARY_FADED}
                                w={150}
                                marginRight={80}
                                h={40}
                                r={20}

                            >
                                <IIText type='B' color={Colors.WHITE}>New Airtime</IIText>
                                <Icon name='share' color={Colors.WHITE} size={20} />
                            </Box>
                        </TouchableOpacity>
                        <Box
                            flexDirection='row'
                            backgroundColor={Colors.PRIMARY_FADED}
                            w={120}
                            marginTop={10}
                            marginRight={50}
                            h={40}
                            r={20}
                        >
                            <IIText type='B' color={Colors.WHITE}>New Data</IIText>
                            <Icon name='share' color={Colors.WHITE} size={20} />
                        </Box>
                        <TouchableOpacity
                            onPress={() => {
                                closePopover()
                                navigation.navigate('Phone Form')
                            }}
                        >
                            <Box
                                flexDirection='row'
                                backgroundColor={Colors.PRIMARY_FADED}
                                w={70}
                                marginTop={10}
                                marginRight={0}
                                marginBottom={30}
                                h={40}
                                r={20}
                            >
                                <IIText type='B' color={Colors.WHITE}>Add</IIText>
                                <Icon name='share' color={Colors.WHITE} size={20} />
                            </Box>
                        </TouchableOpacity>
                    </Box>
                </Popover>
            </IFlexer>
        </>
    )
}


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
                                <Icon name='share-outline' size={40} color={Colors.DEFAULT} />
                            </Box>
                        </Box>
                        <IIText type='B' top={20}>{label}</IIText>
                    </TouchableOpacity>
                )
            })}

        </View>
    )
}


const AddTab = ({ initialRouteName }) => {
    return (
        <Tab.Navigator
            initialRouteName={initialRouteName}
            tabBar={props => <Tabs {...props} />}
        >
            <Tab.Screen name="Airtime & Data" component={SavedNumbers} />
            <Tab.Screen name="Cables TV" component={SavedBills} />
            <Tab.Screen name="Saved Meters" component={SavedElectricity} />

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

export default AddTab