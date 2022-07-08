import React, { useContext, useState,useCallback, useEffect } from "react";
import ParentComponent from "../../../navigators";
import Spinner from "../../components/Spinner/Spinner";
import NetworkModal from "../../components/Modal/Network";
import { NetworkContext } from "../../context/NetworkContext";
import { IIText } from "../../components/Text/Text";
import { Box } from "../../components/Flexer/Flexer";
import { Header } from "../../components/Flexer/Flexer";
import Icon from 'react-native-vector-icons/Ionicons'
import { Colors } from "../../components/utils/colors";
import { IView } from "../../components/Flexer/Flexer";
import { TouchableOpacity, ScrollView, RefreshControl } from "react-native";
import { formatNumber } from "../../utils/formatter";
import { useMutation } from "react-query";
import { notifications } from "../../services/network";
import { useNavigation } from "@react-navigation/native";

const Notfications = ({ navigation }) => {

    const [type, setType] = useState('')
    const [data, setData] = useState('')
    const [visible, setVisible] = useState(false)
    const [msg, setMsg] = useState('')
    const { isConnected } = useContext(NetworkContext)
    const [notify, setNotitify] = useState([])
    const [refreshing, setRefreshing] = useState(false);


    const { isLoading, mutate } = useMutation(notifications, {
        onSuccess: data => {
            console.log(data?.data)
            if (data?.data?.length) {
                setNotitify(data?.data)
            }
        }
    })

    useEffect(() => {
        handleFetch()
    }, [])

    const handleFetch = () => {
        if (isConnected) {
            setType('internet')
            setVisible(true)
            return;
        }

        setMsg('Fetching your notifications...')

        mutate({ type: 'fetch' })
    }


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



    const Card = ({ data }) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate('Notification Details', {
                        data: data
                    })
                }}
            >
                <Box
                    flexDirection='row'
                    w='100%'
                    justifyContent='space-between'
                    h={70}
                    borderBottomWidth={0.4}
                    backgroundColor={Colors.WHITE}
                    paddingLeft={10}
                    paddingRight={10}
                    marginBottom={20}
                >
                    <Box
                        flexDirection='row'
                    >
                        <Box
                            h={50}
                            r={10}

                            w={50}
                        >
                            <Icon size={30} name={
                                data?.n_status == 1 ? 'mail-sharp' : 'mail-outline'
                            } color={
                                data?.n_status  == 1? Colors.ASH : Colors.ERROR
                            } />

                        </Box>
                        <IIText paddingLeft={10} size={16} type='B'>
                            {data?.n_title.length > 20 ? data?.n_title.slice(0, 25).concat('...') : data?.n_title}
                        </IIText>
                    </Box>

                    <Icon size={30} name={
                        data?.n_status == 1 ? 'checkmark-done-circle' : 'checkmark-done-circle-outline'
                    } color={
                        data?.n_status == 1 ? Colors.ASH : Colors.ERROR
                    } />
                </Box>
            </TouchableOpacity>
        )
    }
    return (
        <ParentComponent>
            <Header>Notifications</Header>
            <IView p={20}>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                >
                    {
                        notify?.length < 1
                            ? <IIText textAlign='center' type='B'>No Notification</IIText>
                            : (
                                <>
                                    {
                                        notify.map((element, idx) => (
                                            <Card
                                                key={idx}
                                                data={element}
                                            />
                                        ))
                                    }
                                </>
                            )
                    }
                </ScrollView>
            </IView>

            <NetworkModal
                type={type}
                visible={visible}
                data={data}
                setVisible={setVisible}
            />
            {isLoading && (<Spinner
                loading={msg}
            />)}
        </ParentComponent>
    )
}

export default Notfications