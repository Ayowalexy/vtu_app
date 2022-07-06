import React, { useState,useEffect, useContext } from "react";
import { IIText } from "../../components/Text/Text";
import Search from "../../components/Search/Search";
import { IView } from "../../components/Flexer/Flexer";
import { ScrollView } from "react-native";
import FLexer, { Box, IFlexer } from "../../components/Flexer/Flexer";
import { Pressable, StyleSheet, TouchableOpacity, View, Dimensions } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons'
import { Colors } from "../../components/utils/colors";
import { Popover, usePopover } from 'react-native-modal-popover';
import { useNavigation } from "@react-navigation/native";
import VoucherCards from "../SavedCards/VoucherCards";
import { useMutation } from "react-query";
import { setPin } from "../../services/network";
import Spinner from "../../components/Spinner/Spinner";
import NetworkModal from "../../components/Modal/Network";
import { NetworkContext } from "../../context/NetworkContext";


const EmptyState = () => {
    const navigation = useNavigation();
    return (
        <FLexer height={400}>
            <IFlexer flexDirection="column" justifyContent='flex-start' >

                <Box
                    w={70}
                    h={70}
                    r={10}
                    backgroundColor={Colors.PRIMARY_FADED}
                    marginBottom={20}
                >
                    <Icon name='card-sharp' size={40} color={Colors.DEFAULT} />
                </Box>

                <IIText type='B' textAlign='center'>You have not used any Voucher{"\n"}
                    <IIText color={Colors.PRIMARY} type='L'>Buy Voucher </IIText> from out verified vendors
                </IIText>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                        navigation.navigate('Voucher Form')
                    }}
                >
                    <Box
                        w={Dimensions.get('window').width - 40}
                        h={50}
                        backgroundColor={Colors.PRIMARY}
                        marginTop={10}
                    >
                        <IIText type='B' color={Colors.DEFAULT} size={16}>Buy Voucher</IIText>
                    </Box>
                </TouchableOpacity>
            </IFlexer>
        </FLexer>
    )
}





const DataState = () => {
    const navigation = useNavigation();
    const [value, setValue] = useState('')
    const [visible, setVisible] = useState(false)
    const [msg, setMsg] = useState('')
    const [type, setType] = useState('')
    const {isConnected} = useContext(NetworkContext)
    const [vouhcers, setVouchers] = useState([])
    const {
        openPopover,
        closePopover,
        popoverVisible,
        touchableRef,
        popoverAnchorRect,
    } = usePopover();


    const {isLoading, mutate} = useMutation(setPin, {
        onSuccess: data => {
            console.log("data?.data", data?.data)
            if(data.status == 200){
                setVouchers(data?.data)
            }
            
        }
    })

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            handleFetch()
        });

        return unsubscribe;
    }, [navigation]);


    const handleFetch = () => {
        if(isConnected){
            setType('internet')
            setVisible(true)
            return
        }

        setMsg('Loading saved voucher, please wait...')

        mutate({type: 'fetch'})
    }

    


    const cards = [
        {
            pin: '1234567987654',
            status: 'Used',
            date: '09/12/2022',
            amount: '4,000'
        },
        {
            pin: '1234567987654',
            status: 'Pending',
            date: '09/12/2022',
            amount: '4,000'
        },
    ]
    return (
        <>
            <IView
                height={Dimensions.get('window').height - 200}
                top={20}
            >
                <Search
                    value={value}
                    onChangeText={setValue}
                />
                <VoucherCards data={vouhcers} />
               
                <NetworkModal
                    type={type}
                    visible={visible}
                    setVisible={setVisible}
                />
                {isLoading && (<Spinner
                    loading={msg}
                />)}
            </IView>
        </>
    )
}


const Voucher = () => {

    return (
        <ScrollView>
            {/* <EmptyState /> */}
            <DataState />
        </ScrollView>
    )
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
});

export default Voucher