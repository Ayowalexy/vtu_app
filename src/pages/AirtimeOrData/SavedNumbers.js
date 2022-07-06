import React, { useState, useEffect, useContext } from "react";
import { View, Text, TouchableOpacity, Dimensions, ScrollView, Pressable, StyleSheet, Button } from 'react-native';
import FLexer, { IFlexer, Box } from "../../components/Flexer/Flexer";
import IText, { IIText } from "../../components/Text/Text";
import { Colors } from "../../components/utils/colors";
import Icon from 'react-native-vector-icons/Ionicons'
import { useNavigation } from "@react-navigation/native";
import AirtimeCard from "../../components/Cards/Cards";
import { Popover, usePopover } from 'react-native-modal-popover';
import { useMutation } from "react-query";
import { getAllPhoneBooks } from "../../services/network";
import NetworkModal from "../../components/Modal/Network";
import Spinner from "../../components/Spinner/Spinner";
import { NetworkContext } from "../../context/NetworkContext";
import { useFocusEffect } from '@react-navigation/native';
import { useRoute } from "@react-navigation/native";

const EmptyState = () => {

    const navigation = useNavigation();

    return (
        <FLexer height={300}>
            <IFlexer flexDirection="column" justifyContent='flex-start' >
                <TouchableOpacity
                    onPress={() => {
                        navigation.push('Phone Form')
                    }}
                >
                    <Box
                        w={70}
                        h={70}
                        r={10}
                        backgroundColor={Colors.PRIMARY_FADED}
                        marginBottom={20}
                    >
                        <Icon name='ios-add-circle-sharp' size={40} color={Colors.DEFAULT} />
                    </Box>
                </TouchableOpacity>
                <IIText type='B' textAlign='center'>You have not saved any airtime {"\n"} or data beneficiary. {' '}
                    <IText colored>
                        Buy Airtime
                    </IText> or {"\n"}
                    <IText colored> Data</IText> to proceed
                </IIText>
            </IFlexer>
        </FLexer>
    )
}


const DataState = ({ number }) => {
    return (
        <ScrollView>
            {
                number?.map((element, idx) => (
                    <AirtimeCard
                        key={idx}
                        type='Airtime'
                        data={{
                            number: element?.beneficiary_number,
                            saved_network: element?.operator_name,
                            name: element?.beneficiary_name,
                            book_id: element?.book_id
                        }}
                    />
                ))
            }
        </ScrollView>
    )
}



const SavedNumbers = ({ navigation }) => {

    const {
        openPopover,
        closePopover,
        popoverVisible,
        touchableRef,
        popoverAnchorRect,
    } = usePopover();

    const [msg, setMsg] = useState('')
    const [data, setData] = useState('')
    const [type, setType] = useState('')
    const [visible, setVisible] = useState(false)

    const [savedNumbers, setSavedNumber] = useState([])
    const { isConnected } = useContext(NetworkContext)
    const { startFetch, setStartFetch } = useContext(NetworkContext)
    const route = useRoute();



    const { isLoading, mutate, isError } = useMutation(getAllPhoneBooks, {
        onSuccess: async data => {
            if (data?.data?.length) {
                const filter = data?.data?.filter(element => element.book_type == 'Number')
                setSavedNumber(filter)

            } else if (data?.data?.length == 0) {
                setSavedNumber([])
            } else {
                setData(data?.data?.message)
            }
        },
        onError: async data => {
            console.log(data)
        }
    })

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            if (route.name == 'Airtime & Data') {
                handleFetch()
            }
        });

        return unsubscribe;
    }, [navigation]);



    useEffect(() => {
        if(startFetch){
            Promise.resolve(handleFetch()).then(() => setStartFetch(false))
        }
    }, [startFetch])

    const handleFetch = () => {
        if (isConnected) {
            setType('internet')

            setVisible(true)
            return;
        }

        setMsg('Loading your saved number, please wait...')
        mutate({ type: 'fetch' })
    }

    return (

        <View style={{ height: Dimensions.get('window').height - 250, }}>
            {
                savedNumbers?.length ? <DataState number={savedNumbers} /> : <EmptyState />
            }
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
                                backgroundColor={Colors.PRIMARY}
                                w={150}
                                marginRight={80}
                                h={40}
                                r={20}

                            >
                                <IIText type='B' color={Colors.DEFAULT}>New Airtime</IIText>
                                <Icon name='share' color={Colors.DEFAULT} size={20} />
                            </Box>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                closePopover()
                                navigation.navigate('Data')
                            }}
                        >
                            <Box
                                flexDirection='row'
                                backgroundColor={Colors.PRIMARY}
                                w={120}
                                marginTop={10}
                                marginRight={50}
                                h={40}
                                r={20}
                            >
                                <IIText type='B' color={Colors.DEFAULT}>New Data</IIText>
                                <Icon name='share' color={Colors.DEFAULT} size={20} />
                            </Box>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                closePopover()
                                navigation.navigate('Phone Form')
                            }}
                        >
                            <Box
                                flexDirection='row'
                                backgroundColor={Colors.PRIMARY}
                                w={70}
                                marginTop={10}
                                marginRight={0}
                                marginBottom={30}
                                h={40}
                                r={20}
                            >
                                <IIText type='B' color={Colors.DEFAULT}>Add</IIText>
                                <Icon name='share' color={Colors.DEFAULT} size={20} />
                            </Box>
                        </TouchableOpacity>
                    </Box>
                </Popover>
            </IFlexer>

            <NetworkModal
                type={type}
                visible={visible}
                data={data}
                setVisible={setVisible}
            />
            {isLoading && (<Spinner
                loading={msg}
            />)}
        </View>
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

export default SavedNumbers