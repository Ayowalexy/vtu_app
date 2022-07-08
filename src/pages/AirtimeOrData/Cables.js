import React, { useState, useContext, useEffect } from "react";
import { NetworkContext } from "../../context/NetworkContext";
import { Box, IFlexer, IIcon } from "../../components/Flexer/Flexer";
import { ScrollView, View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { GOTV, DSTV, MULTI_CHOICE, STARTIMES, SHOWMAX } from "../../components/utils/Assets";
import IText, { IIText } from "../../components/Text/Text";
import { Colors } from "../../components/utils/colors";
import Search from "../../components/Search/Search";
import { Header } from "../../components/Flexer/Flexer";
import { useMutation } from "react-query";
import { getCables } from "../../services/network";
import { useSelector } from "react-redux";
import { selectServices } from "../../redux/store/user/user.selector";
import NetworkModal from "../../components/Modal/Network";
import Spinner from "../../components/Spinner/Spinner";


const Cables = ({ navigation }) => {
    const [search, setSearch] = useState('')
    const [type, setType] = useState('')
    const [useData, setUseData] = useState('')
    const [visible, setVisible] = useState(false)
    const [msg, setMsg] = useState('')
    const [data, setData] = useState([])

    const services = useSelector(selectServices);
    const { isConnected } = useContext(NetworkContext)

    const { isLoading, mutate } = useMutation(getCables, {
        onSuccess: data => {
            console.log(data?.data)
            if (data?.data?.flag == 1) {
                setData(data?.data?.result)
            } else {
                setType('invalid')
                setShowNetwork(true)
            }
        }
    })


    useEffect(() => {
        handleFetch();
    }, [])
    const handleFetch = () => {

        if (isConnected) {
            setType('internet')
            setShowNetwork(true)
            return;
        }

        setMsg('Fetching cables list, Please wait....')

        console.log(services)

        const cables = services?.find(element => element.module_name == 'TV Cable')

        const payload = {
            module_id: cables?.module_id
        }

        mutate(payload)

    }

    return (
        <View>
            <Box
                w='100%'
                h={50}
            >
                <Header>Cables</Header>
            </Box>

            <ScrollView style={styles.container}>
                <Search
                    value={search}
                    onChangeText={setSearch}
                    placeHolder='Search'

                />

                <IText
                    size={17}
                    styling={styles.text}>Billers</IText>

                {
                    data?.filter(element => element.product_name.toLowerCase().includes(search.toLowerCase()))?.map((element, idx) => (
                            <TouchableOpacity
                                key={idx}
                                onPress={() => {


                                    // if (element?.product_name !== 'SHOWMAX') {
                                        navigation.navigate('Cables Payment', {
                                            data: element?.product_name,
                                            product_id: element?.product_id
                                        })
                                    // }
                                }}
                            >
                                <Box
                                    h={60}
                                    w='100%'
                                    borderBottomWidth={0.3}
                                    flexDirection='row'
                                    // paddingLeft={10}
                                    borderBottomColor='rgba(0,0,0,0.3)'
                                >
                                    <Image
                                        source={
                                            element.product_name == 'DSTV'
                                            ? DSTV
                                            : element.product_name == 'GOTV'
                                            ? GOTV
                                            : element.product_name == 'StarTimes'
                                            ? STARTIMES
                                            : element.product_name == 'SHOWMAX'
                                            ? SHOWMAX
                                            : MULTI_CHOICE
                                        }

                                        style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: 10
                                        }}
                                        resizeMode='contain'
                                    />
                                    <IFlexer w='85%'>
                                        <IIText 
                                            paddingLeft={10}
                                            type='B'
                                            // opacity={
                                            //     element.product_name == 'SHOWMAX' ? 0.3 : 1
                                            // }
                                             >{element?.product_name}</IIText>
                                        <IIcon
                                            name='md-chevron-forward'
                                            size={20}
                                            color={Colors.SEARCH}
                                        />
                                    </IFlexer>
                                </Box>

                            </TouchableOpacity>

                        ))
                }

                <NetworkModal
                    type={type}
                    visible={visible}
                    data={useData}
                    setVisible={setVisible}
                />
                {isLoading && (<Spinner
                    loading={msg}
                />)}
            </ScrollView>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20
    },
    text: { 
        paddingTop: 20, 
        borderBottomColor:'rgba(0,0,0,0.3)',
        borderBottomWidth: 0.3, 
        paddingBottom: 20 }
})

export default Cables