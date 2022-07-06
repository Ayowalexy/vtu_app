import React, { useState, useEffect, useContext } from 'react';
import { ScrollView, Dimensions, View, TouchableOpacity, Pressable, StyleSheet } from 'react-native';
import { Box } from '../../components/Flexer/Flexer';
import IText, { IIText } from '../../components/Text/Text';
import Icon from 'react-native-vector-icons/Ionicons'
import FLexer, { IFlexer } from '../../components/Flexer/Flexer';
import { Colors } from '../../components/utils/colors';
import { useNavigation } from '@react-navigation/native';
import { Popover, usePopover } from 'react-native-modal-popover';
import AirtimeCard from '../../components/Cards/Cards';
import { useMutation } from 'react-query';
import Spinner from '../../components/Spinner/Spinner';
import { NetworkContext } from '../../context/NetworkContext';
import NetworkModal from '../../components/Modal/Network';
import { getAllPhoneBooks } from '../../services/network';
import { useRoute } from '@react-navigation/native';

const EmptyState = () => {
    const navigation = useNavigation();

    return (
        <FLexer height={300}>
            <IFlexer flexDirection="column" justifyContent='flex-start' >
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('Transfer Form')
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

                <IIText type='B' textAlign='center'>You have not saved any {"\n"}
                    bank account. Click the icon to add new
                </IIText>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                        navigation.navigate('Transfer')
                    }}
                >
                    <Box
                        w={Dimensions.get('window').width - 40}
                        h={50}
                        backgroundColor={Colors.PRIMARY}
                        marginTop={10}
                    >
                        <IIText type='B' color={Colors.DEFAULT} size={16}>Transfer funds</IIText>
                    </Box>
                </TouchableOpacity>
            </IFlexer>
        </FLexer>
    )
}


const DataState = ({ meters }) => {
    return (
        <ScrollView>
            {
                meters?.map((element, idx) => (
                    <AirtimeCard
                        key={idx}
                        type='Banks'
                        data={{
                            number: element?.beneficiary_number,
                            saved_network: element?.current_service,
                            name: element?.beneficiary_name,
                            provider: element?.operator_name,
                            book_id: element?.book_id
                        }}
                    />
                ))
            }
        </ScrollView>
    )
}



const SavedBanks = () => {

    const navigation = useNavigation();
    const route = useRoute()
    const [type, setType] = useState('')
    const [visible, setVisible] = useState('')
    const [msg, setMsg] = useState('')
    const [data, setData] = useState('')
    const [savedBanks, setSavedBanks] = useState([])

    const {
        openPopover,
        closePopover,
        popoverVisible,
        touchableRef,
        popoverAnchorRect,
    } = usePopover();
    const { isConnected } = useContext(NetworkContext)
    const { startFetch, setStartFetch } = useContext(NetworkContext)



    const { isLoading, mutate, isError } = useMutation(getAllPhoneBooks, {
        onSuccess: async data => {
            console.log('data', data?.data)
            if (data?.data?.length) {
                const account = data?.data?.filter(element => element.book_type == 'Account')
                setSavedBanks(account)

            } else if(data?.data?.length == 0){
                setSavedBanks([])
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
            if(route.name == 'Banks'){
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

        setMsg('Loading your saved account, please wait...')
        mutate({ type: 'fetch' })
    }
    return (
        <View style={{ height: Dimensions.get('window').height - 250, justifyContent: 'space-between' }}>
            {
                savedBanks.length ? <DataState meters={savedBanks} /> : <EmptyState />
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
                                navigation.navigate('Transfer')
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
                                <IIText type='B' color={Colors.DEFAULT}>Transfer</IIText>
                                <Icon name='share' color={Colors.DEFAULT} size={20} />
                            </Box>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                closePopover()
                                navigation.navigate('Bank Form')
                            }}
                        >
                            <Box
                                flexDirection='row'
                                backgroundColor={Colors.PRIMARY}
                                w={100}
                                marginTop={10}
                                marginRight={30}
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
        height: 100,
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

export default SavedBanks