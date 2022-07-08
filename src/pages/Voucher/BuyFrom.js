import React, { useState, useCallback, useEffect, useContext } from 'react'
import ParentComponent from '../../../navigators'
import { Header, Box } from '../../components/Flexer/Flexer'
import { IIText } from "../../components/Text/Text";
import Spinner from '../../components/Spinner/Spinner';
import { NetworkContext } from '../../context/NetworkContext';
import { useMutation } from 'react-query';
import { createNewTickets } from '../../services/network';
import { useRoute } from '@react-navigation/native';
import { IView } from '../../components/Flexer/Flexer';
import useTheme from '@react-navigation/native';
import { Colors } from '../../components/utils/colors';
import { ScrollView, View, Dimensions, TouchableOpacity, KeyboardAvoidingView, Image, RefreshControl } from 'react-native';
import { ITextInput } from '../../components/Input/Input';
import { DefaultTheme } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome'
import { useSelector } from 'react-redux';
import { ADD } from '../../components/utils/Assets';
import { selectCurrentUser } from '../../redux/store/user/user.selector';
import IModal from '../../components/Modal/Modal';
import { useNavigation } from '@react-navigation/native';
import { getAllVendors } from '../../services/network';



const BuyFrom = () => {
    const [type, setType] = useState('')
    const [msg, setMsg] = useState('')
    const { isConnected } = useContext(NetworkContext)
    const [value, setValue] = useState('')
    const route = useRoute();
    const [messages, setMessages] = useState([])
    const user = useSelector(selectCurrentUser)
    const [bool, setBool] = useState(true)
    const [visible, setVisible] = useState(false)
    const [refreshing, setRefreshing] = useState(false)

    const [showNetwork, setShowNetwork] = useState(false)
    // const theme = useTheme();
    const navigation = useNavigation();


    const { isLoading, mutate } = useMutation(getAllVendors, {
        onSuccess: data => {
            console.log("data?.data -m", data?.data)
            if (data?.data?.length) {
                setMessages(data?.data)
            } else {
                setMessages([])
            }
        }
    })

    const sendMessageMutation = useMutation(getAllVendors, {
        onSuccess: data => {
            console.log("data?.data sent", data?.data)
            if (data?.data?.length) {
                setMessages(data?.data)
            }
        }
    })


    const handleSendMessage = () => {
        setBool(false)
        Promise.resolve(
            sendMessageMutation.mutate({
                type: 'create',
                vendor_id: route?.params?.vendor_id,
                user: user?.first_name,
                message: value,
                sent_by: user?.first_name
            })
        )
            .then(() => handleFetch(false)
            )
    }


    const handleFetch = (bool) => {
        if (isConnected) {
            setType('internet')
            setShowNetwork(true)
            return;
        }


        setMsg('Loading conversation, Please wait....')
        setValue('')
        console.log({ type: 'chat', vendor_id: route?.params?.vendor_id, sent_by: user?.first_name })
        mutate({ type: 'chat', vendor_id: route?.params?.vendor_id })
    }

    useEffect(() => {
        setBool(true)
        handleFetch()
    }, [])


    const refresh_in = () => {

        handleFetch()

    }

    const onRefresh = useCallback(() => {

        setRefreshing(true);
        refresh_in();

        setTimeout(() => {
            setRefreshing(false)
        }, 3000)
    }, []);


    const ChatBox = ({ data }) => (
        <Box
            alignSelf={user?.first_name !== data?.sent_by ? 'flex-start' : 'flex-end'}
            padding={10}
            w={220}
            marginTop={30}
            justifyContent='center'
            alignItems='center'
            backgroundColor={user?.first_name !== data?.sent_by ? Colors.PRIMARY_FADED : Colors.PRIMARY_FADED_2}
            r={20}
        >
            <IIText alignSelf='flex-start' paddingLeft={10} type='B'>
                <IIText type='L'> {data?.sent_by} </IIText>{"\n"}
                {data?.message_body}
            </IIText>
            <IIText
                alignSelf={user?.first_name !== data?.sent_by ? 'flex-start' : 'flex-end'}
                paddingTop={10}
                size={13}
                textAlign='right'
                type='B'>{data?.sent_date}</IIText>

            <View
                style={{
                    position: 'absolute',
                    top: -10,
                    left: user?.first_name !== data?.sent_by ? null : -10,
                    right: user?.first_name !== data?.sent_by ? -10 : null
                }}
            >
                <Image
                    source={{
                        uri: data?.sender_profile
                    }}

                    style={{
                        width: 30,
                        height: 30,
                        borderRadius: 30
                    }}
                    resizeMode='contain'
                />
            </View>
        </Box>
    )

    return (
        <>

            <Header>{route?.params?.name}</Header>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                style={{
                    flex: 1,
                    borderColor: 'red',
                    padding: 20,
                    backgroundColor: Colors.WHITE
                }}
                showsVerticalScrollIndicator={false}>
                <Box
                    w='100%'
                    marginBottom={200}
                >
                    {
                        messages?.length ? (
                            <>
                                {
                                    messages?.map((element, idx) => (
                                        <ChatBox data={element} />
                                    ))
                                }
                            </>
                        )
                            :
                            (
                               <View style={{
                                marginTop: (Dimensions.get('window').height / 2) - 350
                               }}>
                                <Image
                                    source={ADD}
                                    style={{
                                        width: 300,
                                        height: 400
                                    }}
                                    resizeMode='contain'
                                />
                                 <IIText type='B' textAlign='center'>No conversation</IIText>
                               </View>
                            )
                    }

                </Box>



            </ScrollView>

            <Box
                flexDirection='row'
                w='100%'
            >
                <View
                    style={{
                        width: '100%',
                        backgroundColor: Colors.WHITE,
                        padding: 30,
                        // paddingBottom: 50,
                        position: 'absolute',
                        bottom: 0,

                    }}
                >
                    <ITextInput
                        value={value}
                        editable={route?.params?.ticket_status == 'Closed' ? false : true}
                        marginTop={-40}
                        onChange={setValue}
                        placeholder='Enter message'
                        multiline={true}
                        numberOfLines={10}
                        borderRadius={40}
                        paddingTop={18}
                        marginLeft={-20}
                        width={Dimensions.get('window').width - 15}
                        height={60}
                        textAlignVertical='top'

                    />
                    <TouchableOpacity
                        disabled={value.length < 1 ? true : false}
                        onPress={handleSendMessage}
                        style={{
                            position: 'absolute',
                            right: 5,
                            top: 35
                        }}
                    >
                        <Box
                            w={50}
                            h={50}
                            r={40}
                            backgroundColor={Colors.PRIMARY}
                        >
                            <Icon name='send' size={25} color={Colors.DEFAULT} />
                        </Box>
                    </TouchableOpacity>
                </View>
            </Box>

            {bool && (
                <>
                    {isLoading && (<Spinner
                        loading={msg}
                    />)}
                </>
            )}

        </>

    )
}

export default BuyFrom