import React, { useState, useEffect, useContext } from 'react';
import { ScrollView, Dimensions, TouchableOpacity, Pressable, View, StyleSheet } from 'react-native';
import { Box } from '../../components/Flexer/Flexer';
import IText, { IIText } from '../../components/Text/Text';
import Icon from 'react-native-vector-icons/Ionicons'
import FLexer, { IFlexer } from '../../components/Flexer/Flexer';
import { Colors } from '../../components/utils/colors';
import { useNavigation } from '@react-navigation/native';
import AirtimeCard from '../../components/Cards/Cards';
import { Popover, usePopover } from 'react-native-modal-popover';
import Spinner from '../../components/Spinner/Spinner';
import NetworkModal from '../../components/Modal/Network';
import { NetworkContext } from '../../context/NetworkContext';
import { useMutation } from 'react-query';
import { getAllPhoneBooks } from '../../services/network';
import { useRoute } from '@react-navigation/native';


const EmptyState = () => {
    const navigation = useNavigation();
    return (
        <FLexer height={300}>
            <IFlexer flexDirection="column" justifyContent='flex-start' >
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('Cable Form')
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
                    Cable payment. Pay Bills to proceed
                </IIText>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                        navigation.navigate('Cables')
                    }}
                >
                    <Box
                        w={Dimensions.get('window').width - 40}
                        h={50}
                        backgroundColor={Colors.PRIMARY}
                        marginTop={10}
                    >
                        <IIText type='B' color={Colors.DEFAULT} size={16}>Pay Cables</IIText>
                    </Box>
                </TouchableOpacity>
            </IFlexer>
        </FLexer>
    )
}



const DataState = ({ cables }) => {
    return (
        <ScrollView>
            {
                cables?.map((element, idx) => (
                    <AirtimeCard
                        type='Cable'
                        key={idx}
                        data={{
                            number: element?.beneficiary_number,
                            saved_network: element?.current_service,
                            name: element?.beneficiary_name,
                            product: 'multi-choice',
                            network: element?.operator_name,
                            book_id: element?.book_id
                        }}
                    />
                ))
            }
        </ScrollView>
    )
}



const SavedBills = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [visible, setVisible] = useState(false)
    const [type, setType] = useState('')
    const [msg, setMsg] = useState('')
    const [cables, setCables] = useState([])
    const [data, setData] = useState('')
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
            if (data?.data?.length) {
                const cable = data?.data?.filter(element => element.book_type == 'Cable')
                setCables(cable)

            } else if(data?.data?.length == 0){
                setCables([])
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
            if(route.name == 'Cables TV'){
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

        setMsg('Loading your saved Cables, please wait...')
        mutate({ type: 'fetch' })
    }
    return (
        <View style={{ height: Dimensions.get('window').height - 250, justifyContent: 'space-between' }}>

            {
                cables?.length ? <DataState cables={cables} /> : <EmptyState />
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
                                navigation.navigate('Cables')
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
                                <IIText type='B' color={Colors.DEFAULT}>New Cable</IIText>
                                <Icon name='share' color={Colors.DEFAULT} size={20} />
                            </Box>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                closePopover()
                                navigation.navigate('Cable Form')
                            }}
                        >
                            <Box
                                flexDirection='row'
                                backgroundColor={Colors.PRIMARY}
                                w={100}
                                marginTop={10}
                                marginRight={30}
                                marginBottom={10}
                                h={40}
                                r={20}
                            >
                                <IIText type='B' color={Colors.DEFAULT}>Add</IIText>
                                <Icon name='share' color={Colors.DEFAULT} size={20} />
                            </Box>
                        </TouchableOpacity>
                    </Box>
                </Popover>

                <NetworkModal
                    type={type}
                    visible={visible}
                    data={data}
                    setVisible={setVisible}
                />
                {isLoading && (<Spinner
                    loading={msg}
                />)}
            </IFlexer>
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


export default SavedBills