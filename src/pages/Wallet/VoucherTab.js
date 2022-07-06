import React from 'react'
import { View, Text, Dimensions, StyleSheet } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons'
import { Colors } from '../../components/utils/colors';
import { TouchableOpacity, Pressable } from 'react-native';

import { Box } from '../../components/Flexer/Flexer';
import { useNavigation } from '@react-navigation/native';
import Voucher from './Voucher';
import { IView } from '../../components/Flexer/Flexer';
import Popover from 'react-native-modal-popover';
import { usePopover } from 'react-native-modal-popover';
import { IFlexer } from '../../components/Flexer/Flexer';
import { IIText } from '../../components/Text/Text';



const Tab = createBottomTabNavigator();

const TabBar = () => {
    const navigation = useNavigation();
    const {
        openPopover,
        closePopover,
        popoverVisible,
        touchableRef,
        popoverAnchorRect,
    } = usePopover();

    return (
        <>
            <IView>
                <IFlexer >
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
                                    navigation.navigate('Voucher Form')
                                }}
                            >
                                <Box
                                    flexDirection='row'
                                    backgroundColor={Colors.PRIMARY}
                                    w={170}
                                    marginTop={10}
                                    marginRight={80}
                                    h={40}
                                    r={20}
                                >
                                    <IIText type='B' color={Colors.DEFAULT}>Redeem Voucher</IIText>
                                    <Icon name='share' color={Colors.DEFAULT} size={20} />
                                </Box>
                            </TouchableOpacity>

                            {/*  */}
                            <TouchableOpacity

                            >
                                <Box
                                    flexDirection='row'
                                    backgroundColor={Colors.PRIMARY}
                                    w={140}
                                    marginTop={10}
                                    marginRight={50}
                                    h={40}
                                    r={20}
                                >
                                    <IIText type='B' color={Colors.DEFAULT}>Buy Voucher</IIText>
                                    <Icon name='share' color={Colors.DEFAULT} size={20} />
                                </Box>
                            </TouchableOpacity>

                        </Box>
                    </Popover>
                </IFlexer>
            </IView>
            <TouchableOpacity
              
                style={{
                    position: 'absolute',
                    bottom: 120,
                    right: 0,

                }}>
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
            </TouchableOpacity>
            {/*  */}
            
        </>
    )
}

const VoucherTab = () => {
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
            <Tab.Screen name="My Saved Voucher" component={Voucher} />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    content: {
        padding: 16,
        borderRadius: 8,
        backgroundColor: 'rgba(0, 0, 0, 0)',

        // marginLeft: -20,
        // right: 0,

        width: 100,
        height: 120,
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
})


export default VoucherTab