import React, { useContext, useState, useEffect, useCallback } from 'react';
import { Box } from '../../components/Flexer/Flexer';
import { Header } from '../../components/Flexer/Flexer';
import { IView } from '../../components/Flexer/Flexer';
import { IIText } from '../../components/Text/Text';
import { ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import ParentComponent from '../../../navigators';
import { Colors } from '../../components/utils/colors';
import { useNavigation } from '@react-navigation/native';
import { useMutation } from 'react-query';
import { createNewTickets } from '../../services/network';
import Spinner from '../../components/Spinner/Spinner';
import { NetworkContext } from '../../context/NetworkContext';


const MyTickets = () => {
    const navigation = useNavigation();
    const [type, setType] = useState('')
    const [visible, setVsisble] = useState(false)
    const [msg, setMsg] = useState('')
    const { isConnected } = useContext(NetworkContext)
    const [useTickets, setTickets] = useState([])
    const [refreshing, setRefreshing] = useState(false);


    const { isLoading, mutate } = useMutation(createNewTickets, {
        onSuccess: data => {
            console.log(data?.data)
            if (data?.data?.length) {
                setTickets(data?.data)
            }
        }
    })

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


    const handleFetch = () => {
        if (isConnected) {
            setType('internet')
            setVsisble(true)
            return;
        }

        setMsg('Fetching your tickets, Please wait....')
        mutate({ type: 'fetch' })
    }

    useEffect(() => {
        handleFetch()
    }, [])




    return (
        <ParentComponent>
            <Header>My Tickets</Header>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                style={{ padding: 20 }}>
                {
                    useTickets?.map((element, idx) => (
                        <IView key={idx} top={30}>
                            <IIText type='B'>#{element?.ticket_id}</IIText>
                            <Box
                                flexDirection='row'
                                justifyContent='space-between'
                                borderWidth={1}
                                padding={10}
                                borderColor={Colors.PRIMARY}
                            >
                                <Box
                                    alignItems='flex-start'
                                >
                                    <IIText type='L'>{element?.subject}</IIText>
                                    <Box
                                        flexDirection='row'
                                        alignItems='flex-end'
                                    >
                                        <Box
                                            r={20}
                                            w={80}
                                            h={30}
                                            backgroundColor={
                                                element?.ticket_status == 'Pending' 
                                                    ? Colors.PRIMARY_FADED
                                                    : element?.ticket_status == 'Closed'
                                                    ? Colors.ASH    
                                                    : element?.ticket_status == 'Open'
                                                    ? Colors.SUCCESS
                                                    : Colors.DEFAULT
                                            }
                                        >
                                            <IIText
                                                color={Colors.DEFAULT}
                                                size={13}
                                                textTransform='capitalize'
                                                type='L'>{element?.ticket_status}</IIText>
                                        </Box>
                                        <IIText
                                            marginLeft={10}
                                            type='B'>{new Date(element?.date_created.split(' ')[0]).toLocaleDateString()}</IIText>
                                    </Box>

                                </Box>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('Chat Support', {
                                        data: element?.ticket_id,
                                        ticket_status: element?.ticket_status
                                    })}
                                    style={{ alignSelf: 'flex-end' }}
                                >
                                    <Box
                                        w={80}
                                        h={33}

                                        backgroundColor={Colors.PRIMARY}
                                    >
                                        <IIText type='B'>View</IIText>
                                    </Box>
                                </TouchableOpacity>
                            </Box>
                        </IView>
                    ))
                }
            </ScrollView>
            {isLoading && (<Spinner
                loading={msg}
            />)}
        </ParentComponent>
    )
}

export default MyTickets