import React, { useState, useCallback, useContext, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image, RefreshControl, ToastAndroid, Pressable, StyleSheet } from 'react-native';
import Flexer, { IFlexer, Box } from '../../components/Flexer/Flexer'
import Icon from 'react-native-vector-icons/Ionicons'
import { Colors } from "../../components/utils/colors";
import IText, { IIText } from "../../components/Text/Text";
import FLexer from "../../components/Flexer/Flexer";
import Swiper from "react-native-swiper";
import { AD_1, AD_2, AD_3 } from "../../components/utils/Assets";
import Setup from "./setup";
import Promotion from "../../components/Ads/Ads";
import styles from "./DashboardStyles";
import ParentComponent from "../../../navigators";
import Spinner from "../../components/Spinner/Spinner";
import { useSelector, useDispatch } from "react-redux";
import { NetworkContext } from "../../context/NetworkContext";
import { selectCurrentUser, selectServices, selectAllAds } from "../../redux/store/user/user.selector";
import { setCurrentUserUserActionAsync } from "../../redux/store/user/user.actions";
import NetworkModal from "../../components/Modal/Network";
import { formatNumber } from "../../utils/formatter";
import Clipboard from '@react-native-community/clipboard';
import LogoutModal from "../../components/Modal/LogoutModal";
import { notifications } from "../../services/network";
import axios from "axios";
import AppUpdate from "../AppUpdate/AppUpdate";
import { appRelease } from "../../services/network";


const Dashboard = ({ navigation, route }) => {
    const [isAdAvailable, setIsAdAvailable] = useState(true)
    const [showBalance, setShowBalance] = useState(false)
    const [refreshing, setRefreshing] = useState(false);
    const [msg, setMsg] = useState('')
    const [type, setType] = useState('')
    const [visible, setVisible] = useState(false)
    const [data, setData] = useState('')
    const [date_time, set_date_time] = useState('')
    const [showAcc, setShowAcc] = useState(false)
    const [showDel, setShowDel] = useState(false)
    const [unread, setUnread] = useState(0)
    const [showUpdate, setShowUpdate] = useState(false)
    const [updateType, setUpdateType] = useState('')


    const dispatch = useDispatch();


    const user = useSelector(selectCurrentUser)
    const services = useSelector(selectServices)
    const ads = useSelector(selectAllAds)

    const { isConnected } = useContext(NetworkContext)

    useEffect(() => {
        balanceDateAndTime()
    }, [])

    useEffect(() => {
        (async () => {
            const nofitication = await notifications({ type: 'unread' })
            setUnread(nofitication?.data)
        })()
    }, [])


    const refresh_in = () => {

        dispatch(setCurrentUserUserActionAsync())
        balanceDateAndTime()

    }

    const onRefresh = useCallback(() => {


        setMsg('Updataing your data, please wait...')
        setRefreshing(true);
        refresh_in();

        setTimeout(() => {
            setRefreshing(false)
        }, 3000)
    }, []);


    useEffect(() => {
        (async () => {
            const update = await appRelease()
            const currentVersion = '1.0.2';
            if ((update?.status == 200) && (currentVersion > update?.data?.app_version)) {
                setShowUpdate(true)
                setUpdateType(update?.data?.release_type)
                // navigation.navigate('App Update', {
                //     type: update?.data?.release_type
                // })
            }
        })()

    }, [])


    const copyToClipboard = () => {
        Clipboard.setString(user?.account_number);
        ToastAndroid.show("Account number copied", ToastAndroid.SHORT);
    };


    const balanceDateAndTime = () => {
        const data_time = new Date()
        set_date_time(`${data_time.toDateString()}, ${data_time.toLocaleTimeString()}`)
    }


    return (
        <ParentComponent>
            <Setup />

            <IFlexer
                padding={7}
            >
                <IFlexer>
                    {
                        user?.picture ?
                            (
                                <Image
                                    source={{
                                        uri: user?.picture
                                    }}
                                    style={{
                                        width: 50,
                                        height: 50,
                                        borderRadius: 40,
                                        borderWidth: 4,
                                        borderColor: Colors.DEFAULT,
                                        marginRight: 10
                                    }}
                                />
                            )
                            : <Icon name='md-person-circle-outline' size={50} color={Colors.DEFAULT} />

                    }
                    <IText marginLeft={10} size={20}>Hi, {user?.first_name}</IText>
                </IFlexer>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Notifications')}
                >
                    <Icon name='notifications-outline' size={40} color={Colors.DEFAULT} />
                </TouchableOpacity>

                <View
                    style={{
                        position: 'absolute',
                        right: 5,
                        top: 10
                    }}
                >
                    <Box
                        w={20}
                        h={20}
                        r={30}
                        backgroundColor={Colors.PRIMARY}
                    >
                        <IIText type='L' sze={8}>
                            {unread?.unread}
                        </IIText>
                    </Box>
                </View>
            </IFlexer>
            <ScrollView
                style={{
                    // backgroundColor: Colors.DEFAULT
                }}

            // refreshControl={
            //     <RefreshControl
            //         refreshing={refreshing}
            //     onRefresh={onRefresh}
            //     />
            // }
            >



                <Flexer
                    marginTop={-6}
                >
                    <View style={styles.box}>
                        <IFlexer
                            marginBottom={5}
                            marginTop={20}
                        >
                            <IIText type='L' color={Colors.DEFAULT}>Wallet</IIText>
                            <IIText type='B' color={Colors.DEFAULT}>Cash</IIText>
                        </IFlexer>

                        <View style={styles.box_1}>
                            <IFlexer
                                padding={10}
                            >
                                <Box
                                    w={120}
                                    h={20}
                                    flexDirection='row'
                                    justifyContent='flex-start'
                                    r={5}
                                    backgroundColor={Colors.PRIMARY}
                                >
                                    <IIText paddingLeft={10} size={13} color={Colors.DEFAULT} type='B'>Bonus</IIText>
                                    <IIText paddingLeft={10} type='B'>₦{(user?.bonus_balance)}</IIText>

                                </Box>
                                <Box
                                    flexDirection='row'

                                >
                                    <Pressable
                                        style={{ marginRight: 10 }}
                                        onPress={() => {
                                            setShowAcc(!showAcc)
                                        }}
                                    >
                                        <IText styling={{ color: Colors.WHITE }}>
                                            {
                                                showAcc ? user?.account_number : `***${user?.account_number.toString().slice(6,)}`
                                            }
                                        </IText>
                                    </Pressable>
                                    <TouchableOpacity
                                        onPress={copyToClipboard}
                                    >
                                        <Icon name='copy' size={25} color={Colors.PRIMARY} />
                                    </TouchableOpacity>
                                </Box>


                            </IFlexer>
                            <FLexer>
                                <Box
                                    w='95%'
                                    marginTop={-25}
                                    marginLeft={10}
                                    borderBottomWidth={1}
                                    borderBottomColor={Colors.PRIMARY}
                                />
                            </FLexer>
                            <IText
                                styling={{ paddingLeft: 10, marginTop: -5, color: Colors.WHITE }}
                            >Balance @ {date_time}</IText>

                            <IFlexer
                                paddingRight={10}
                            >
                                <IFlexer
                                    padding={10}
                                >
                                    <IText
                                        bold
                                        size={30}
                                        styling={{
                                            paddingRight: 10,
                                            color: Colors.PRIMARY
                                        }}
                                    >
                                        {
                                            showBalance ? `₦${formatNumber(user?.balance)}` : '* * * *'
                                        }
                                    </IText>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setShowBalance(!showBalance)
                                        }}
                                    >
                                        <Icon name='eye' color={Colors.PRIMARY} size={20} />
                                    </TouchableOpacity>
                                </IFlexer>
                                <TouchableOpacity
                                    onPress={() => {
                                        if (isConnected) {
                                            setType('internet')
                                            setVisible(true)
                                            return;
                                        }
                                        onRefresh()
                                    }}
                                >
                                    <Box
                                        w={50}
                                        h={50}
                                        r={15}
                                        backgroundColor={Colors.PRIMARY}
                                    >
                                        <Icon name='refresh' size={20} color={Colors.DEFAULT} />
                                    </Box>
                                </TouchableOpacity>
                            </IFlexer>

                        </View>

                        <IFlexer
                            marginTop={20}
                        >
                            {
                                [
                                    {
                                        name: 'Transfer \nFund',
                                        icon: 'card-outline',
                                        to: 'Transfer',
                                    },
                                    {
                                        name: 'Fund \nWallet',
                                        icon: 'wallet-outline',
                                        to: 'Tabs'
                                    },
                                    {
                                        name: 'Help \nDesk',
                                        icon: 'information-circle-outline',
                                        to: 'Update settings'
                                    },
                                    {
                                        name: 'Phone \nBook',
                                        icon: 'ios-book-outline',
                                        to: 'Airtime Or Data'
                                    },
                                    {
                                        name: 'Account \nHistory',
                                        icon: 'repeat-outline',
                                        to: 'Transaction History'
                                    },
                                ].map((element, idx) => (
                                    <TouchableOpacity
                                        onPress={() => {
                                            if (element.to.includes('Tabs')) {
                                                navigation.navigate(element.to, {
                                                    screen: 'Wallet'
                                                })
                                            } else if (element.name.includes('Help')) {
                                                navigation.navigate('Update settings', {
                                                    type: 'Support'
                                                })
                                            } else {
                                                navigation.navigate(element.to)
                                            }
                                        }}
                                        style={styles.box_3}
                                        key={idx}
                                    >
                                        <View style={styles.flex}>
                                            <View />
                                            <Icon name={element.icon} size={25} color={Colors.DEFAULT} />
                                        </View>
                                        <IIText paddingTop={0} size={10} type='L' color={Colors.PRIMARY_DEEP}>{element.name}</IIText>
                                    </TouchableOpacity>
                                ))
                            }
                        </IFlexer>
                    </View>
                </Flexer>

                <View style={styles.pad}>
                    <IText bold size={20}>Services</IText>
                </View>
                <View style={styles.box_flex}>
                    {
                        services?.map((element, idx) => (
                            <TouchableOpacity
                                onPress={() => {
                                    if (element?.module_name == 'Airtime') {
                                        navigation.navigate('Airtime')
                                    } else if (element?.module_name == 'TV Cable') {
                                        navigation.navigate('Cables')
                                    } else if (element?.module_name == 'Electricity') {
                                        navigation.navigate('Electricity')
                                    } else if (element?.module_name == 'Data') {
                                        navigation.navigate('Data')
                                    } else if (element?.module_name == 'Internet') {
                                        navigation.navigate('Internet')
                                        // setType('not available')
                                        // setData('This service is not currently available, we are working to resolve this as soon as possible.')
                                        // setVisible(true)
                                    }
                                    // navigation.navigate(element.to)
                                }}
                                style={styles.parent_box} key={idx}>
                                <Box
                                    w={50}
                                    h={50}
                                    r={30}
                                    backgroundColor={Colors.DEFAULT}
                                >
                                    <Icon name={
                                        element?.module_name == 'Airtime'
                                            ? 'phone-portrait-sharp'
                                            : element?.module_name == 'TV Cable'
                                                ? 'ios-tv-sharp'
                                                : element?.module_name == 'Internet'
                                                    ? 'logo-chrome'
                                                    : element?.module_name == 'Data'
                                                        ? 'server'
                                                        : element?.module_name == 'Electricity'
                                                            ? 'md-flash-sharp'
                                                            : null
                                    } size={25} color={Colors.PRIMARY} />
                                </Box>
                                <IText
                                    styling={styles.text}
                                >{element?.module_name}</IText>
                            </TouchableOpacity>
                        ))
                    }
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('Airtime Or Data')
                        }}
                        style={styles.parent_box}>
                        <Box
                            w={50}
                            h={50}
                            r={30}
                            backgroundColor={Colors.DEFAULT}
                        >
                            <Icon name='ios-book-sharp' size={25} color={Colors.PRIMARY} />
                        </Box>
                        <IText
                            styling={styles.text}
                        >PhoneBook</IText>
                    </TouchableOpacity>
                </View>

                {
                    Boolean(ads?.length) && (
                        <Swiper paginationStyle={styles.pagination} activeDotColor={Colors.PRIMARY} style={styles.wrapper}>
                            {
                                ads?.map((element, idx) => (
                                    <View style={styles.add_box} key={idx}>
                                        <Image source={{ uri: element?.ad_image }} style={styles.ad} />
                                        <IText colored styling={styles.header}>{element?.ad_header}</IText>
                                        <IText styling={styles.header_sub}>{element?.ad_text}</IText>
                                    </View>
                                ))
                            }
                        </Swiper>
                    )
                }
                <LogoutModal
                    visible={showDel}
                    setVisible={setShowDel}
                />
                <NetworkModal
                    type={type}
                    visible={visible}
                    data={data}
                    setVisible={setVisible}
                />

                {
                    showUpdate && (
                        <AppUpdate
                            visible={showUpdate}
                            setShowUpdate={setShowUpdate}
                            type={updateType}
                        />
                    )
                }
                {
                    !showUpdate && (
                        <>
                            {isAdAvailable && <Promotion />}
                        </>
                    )
                }
                {refreshing && <Spinner loading={msg} />}
            </ScrollView>

        </ParentComponent>
    )
}




export default Dashboard