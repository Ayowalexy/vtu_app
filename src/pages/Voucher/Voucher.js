import React, { useState, Context, useContext, useEffect } from "react";
import { Box } from "../../components/Flexer/Flexer";
import { IIText } from "../../components/Text/Text";
import ParentComponent from "../../../navigators";
import { Header } from "../../components/Flexer/Flexer";
import Search from "../../components/Search/Search";
import { IView } from "../../components/Flexer/Flexer";
import { ScrollView, Image, TouchableOpacity } from "react-native";
import { Colors } from "../../components/utils/colors";
import { APP_LOGO } from "../../components/utils/Assets";
import Spinner from "../../components/Spinner/Spinner";
import { NetworkContext } from "../../context/NetworkContext";
import { useMutation } from "react-query";
import { getAllVendors } from "../../services/network";
import Icon from 'react-native-vector-icons/MaterialIcons'


const BuyVoucher = ({navigation}) => {
    const [value, setValue] = useState('')
    const [msg, setMsg] = useState('')
    const {isConnected} = useContext(NetworkContext)
    const [vendors, setVendors] = useState([])

    const {isLoading, mutate} = useMutation(getAllVendors, {
        onSuccess: data => {
            console.log("data?.data --", data?.data)
            if(data?.data?.length){
                setVendors(data?.data)
            }
        }
    })

    useEffect(() => {
        mutate({type: 'fetch'})
    }, [])

    const Card = ({data}) => (
        <Box
            w='100%'
            h={100}
            flexDirection='row'
            justifyContent='space-between'
            paddingLeft={10}
            paddingRight={10}
            borderBottomWidth={0.4}
        >
            <Box
                flexDirection='row'
            >
                <TouchableOpacity
                    onPress={() =>  navigation.navigate('Voucher Profile', {
                        vendor_id: data?.vendor_id
                    })}
                >
                    <Image
                        source={{
                            uri: data?.profile
                        }}
                        style={{
                            width: 60,
                            height: 60,
                            borderRadius: 100,

                        }}

                        resizeMode='contain'
                    />
                </TouchableOpacity>
                <Box
                    paddingLeft={10}
                    alignItems='flex-start'
                >
                    <IIText type='L'>
                        {
                            data?.vendor_firstname.concat(' ', data?.lastname)
                        }
                        {
                            data?.account_status == 'Verified' && <Icon name='verified' size={15} color={Colors.SUCCESS} />
                        }
                    </IIText>
                    <IIText type='B'>
                        Vendor
                    </IIText>
                </Box>
            </Box>
            <TouchableOpacity
                onPress={() => navigation.navigate('Buy From', {
                    vendor_id: data?.vendor_id,
                    name:  data?.vendor_firstname.concat(' ', data?.lastname)
                })}
            >
                <Box
                    w={100}
                    h={30}
                    borderColor={Colors.PRIMARY}
                    borderWidth={1}
                >
                    <IIText>
                        BUY FROM
                    </IIText>
                </Box>
            </TouchableOpacity>
        </Box>
    )
    return (
        <ParentComponent>
            <Header>List of vendors</Header>
            <ScrollView>
                <IView p={20}>
                    <Search
                        value={value}
                        onChangeText={setValue}
                    />
                    <IIText paddingTop={10} textAlign='center' type='B'>
                        You can purchase voucher from any {"\n"}of these vendors 
                    </IIText>

                    {
                        vendors
                            ?.filter(element => 
                                element?.vendor_firstname?.toLowerCase()?.includes(value.toLowerCase()) 
                                || element?.lastname?.toLowerCase()?.includes(value.toLowerCase()))
                            ?.map((element, idx) => (
                            <Card key={idx} data={element} />
                        ))
                    }
                </IView>
                {isLoading && (<Spinner
                    loading='Loading vendors, please wait...'
                />)}
            </ScrollView>
        </ParentComponent>
    )
}

export default BuyVoucher