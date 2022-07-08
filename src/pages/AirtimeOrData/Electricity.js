import React, { useState, useEffect, useContext } from "react";
import { Box, IFlexer, IIcon, IView } from "../../components/Flexer/Flexer";
import { ScrollView, View, StyleSheet, TouchableOpacity, FlatList, Image } from "react-native";
import IText, { IIText } from "../../components/Text/Text";
import { Colors } from "../../components/utils/colors";
import Search from "../../components/Search/Search";
import { Header } from "../../components/Flexer/Flexer";
import Spinner from "../../components/Spinner/Spinner";
import NetworkModal from "../../components/Modal/Network";
import { NetworkContext } from "../../context/NetworkContext";
import { useSelector } from "react-redux";
import { selectServices } from "../../redux/store/user/user.selector";
import { useMutation } from "react-query";
import { getElectricity } from "../../services/network";
import { LIGHT_ } from "../../components/utils/Assets";



const Electricity = ({ navigation }) => {
    const [search, setSearch] = useState('');
    const { isConnected } = useContext(NetworkContext)
    const services = useSelector(selectServices);
    const [type, setType] = useState('')
    const [useData, setUseData] = useState('')
    const [visible, setVisible] = useState('')
    const [msg, setMsg] = useState('')
    const [data, setData] = useState([])


    const { isLoading, mutate } = useMutation(getElectricity, {
        onSuccess: data => {
            console.log(data.data.result.products[0])
            if (data?.data?.flag == 1) {
                setData(data?.data?.result?.products)
            } else {
                setType('invalid')
                setVisible(true)
            }
        }
    })


    useEffect(() => {
        handleFetch()
    }, [])


    const handleFilter = (useData) => {
        const initail = data
        const filter = data.map(element => {
            if (element?.name?.includes(useData)) {
                return element
            }
        })

        // if(filter.length){
        //     setData(filter)
        // } else {
        //     setData(initail)
        // }
    }

    const handleFetch = () => {

        if (isConnected) {
            setType('internet')
            setVisible(true)
            return;
        }

        setMsg('Fetching Electricity provider, Please wait....')


        const cables = services?.find(element => element.module_name == 'Electricity')

        const payload = {
            module_id: cables?.module_id
        }

        mutate(payload)

    }

    return (
        <>
            <Box
                w='100%'
                h={50}
            >
                <Header>Electricity</Header>
            </Box>
            <View style={{ padding: 20, paddingBottom: 120 }}>
                <Search
                    value={search}
                    onChangeText={setSearch}
                    placeHolder='Search'
                    onChange={(data) => {
                        handleFilter(search)
                    }}
                />
                


                <ScrollView
                    showsVerticalScrollIndicator={false}
                >


                    {
                        data?.filter(element => element?.name?.toLowerCase().includes(search.toLowerCase()))?.map((item, idx) => {
                            return (
                                <TouchableOpacity
                                    key={idx}
                                    onPress={() => {
                                        navigation.navigate('Electricity Payment', {
                                            data: item?.name,
                                            product_id: item?.product_id,
                                            service: item?.service
                                        })
                                    }}
                                >
                                    <Box
                                        h={60}
                                        w='100%'
                                        flexDirection='row'
                                        borderBottomWidth={0.3}
                                    >
                                        <Image
                                            source={LIGHT_}
                                            style={{
                                                height: 40,
                                                width: 40,
                                                borderRadius: 10
                                            }}
                                            resizeMode='contain'
                                        />
                                        <IFlexer w='85%'>
                                            <IIText paddingLeft={10} type='B' >{item?.name}</IIText>
                                            <IIcon
                                                name='md-chevron-forward'
                                                size={20}
                                                color={Colors.SEARCH}
                                            />
                                        </IFlexer>
                                    </Box>

                                </TouchableOpacity>
                            )
                        })
                    }
                </ScrollView>
            </View>

            <NetworkModal
                type={type}
                visible={visible}
                data={useData}
                setVisible={setVisible}
            />
            {isLoading && (<Spinner
                loading={msg}
            />)}
            {/* </View> */}

        </>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        // marginBottom: 100
    },
    text: { paddingTop: 20, borderBottomWidth: 1, paddingBottom: 20 }
})

export default Electricity