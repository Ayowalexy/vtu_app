import React, { useState, useContext, useEffect } from "react";
import { Box } from "../../components/Flexer/Flexer";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { IIText } from "../../components/Text/Text";
import ParentComponent from "../../../navigators";
import { IView } from "../../components/Flexer/Flexer";
import { Header } from "../../components/Flexer/Flexer";
import Icon from 'react-native-vector-icons/Ionicons'
import { Colors } from "../../components/utils/colors";
import { formatNumber } from "../../utils/formatter";
import { useMutation } from "react-query";
import { getHistory } from "../../services/network";
import Spinner from "../../components/Spinner/Spinner";
import NetworkModal from "../../components/Modal/Network";
import { NetworkContext } from "../../context/NetworkContext";




const TransactionHistory = ({ navigation }) => {

    const [type, setType] = useState('');
    const [useData, setUseData] = useState('')
    const [visible, setVisible] = useState(false)
    const [msg, setMsg] = useState('')
    const [history, setHistory] = useState([])
    const [element, setElements ] = useState([])

    const { isConnected } = useContext(NetworkContext)

    const { isLoading, mutate } = useMutation(getHistory, {
        onSuccess: data => {
            console.log('data?.data', data?.data)
            if (data?.data?.length) {
                setHistory(data?.data)
            } else {
                setType('invalid')
                setVisible(false)
            }
        }
    })

    const handleFetch = values => {
        if (isConnected) {
            setType('internet')
            setVisible(true)
            return;
        }

        setMsg('Fetching transactions, Please wait....')
        mutate()
    }

    useEffect(() => {
        handleFetch()
    }, [])


    useEffect(() => {
        if (history.length) {
            const dates = [];
            const ele = {};

            history?.map(element => dates.push(element?.do_date?.split(' ')[0]))

            dates?.map(element => ele[element] = [])

            history?.map((element, idx) => {
                if (element?.do_date?.split(' ')[0] == dates[idx]) {
                    ele[dates[idx]].push(element)
                }
            })

            setElements(Object.entries(ele))
        }
    }, [history])


    const Card = ({data}) => {
        return(
        <TouchableOpacity
            onPress={() => {
                navigation.navigate('Transaction Details', {
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
            >
                <Box
                    flexDirection='row'
                >
                    <Box
                        h={50}
                        r={10}
                        backgroundColor={
                            data?.transaction_type == 'Credit' ? Colors.SUCCESS_FADED : Colors.ERROR_FADED
                        }
                        w={50}
                    >
                        <Icon size={30} name={
                            data?.transaction_type == 'Credit' ? 'arrow-down-circle-sharp' : 'ios-arrow-up-circle-sharp'
                        } color={
                            data?.transaction_type == 'Credit' ? Colors.SUCCESS : Colors.ERROR
                        } />

                    </Box>
                    <IIText paddingLeft={10} size={16} type='B'>
                        {data?.receipt_no}/{data?.status}
                    </IIText>
                </Box>

                <IIText type='B' color={
                            data?.transaction_type == 'Credit' ? Colors.SUCCESS : Colors.ERROR
                        }>
                    
                   { data?.transaction_type == 'Credit' ? "+" : "-"
                        }₦{formatNumber(data?.amount)}
                </IIText>
            </Box>
        </TouchableOpacity>
    )}

    const data = {
        amount: 200,
        text: 'SMS ALERT DUE CHARGE',
        type: 'in'
    }

    return (
        <ParentComponent>
            <Header>Transaction History</Header>
            <ScrollView>
                <IView p={20} marginBottom={150}>

                    {
                        element?.map((data, idx) => (
                            <>
                                <IIText marginTop={10} key={idx} type='B' color={Colors.DEFAULT_FADED}>
                                    {new Date(data[0]).toDateString()}
                                </IIText>
                                {
                                    data[1]?.map((ele_1, idx_1) => (
                                        <Card data={ele_1} key={idx_1} />
                                    ))
                                }
                            </>
                            
                        ))
                    }
                    {
                        !Boolean(element?.length) && (<IIText type='B'>No Transaction yet</IIText>)
                    }
                </IView>
            </ScrollView>
            <NetworkModal
                type={type}
                visible={visible}
                data={useData}
                setVisible={setVisible}
            />
            {isLoading && (<Spinner
                loading={msg}
            />)}
        </ParentComponent>
    )
}

export default TransactionHistory