import React, { useState } from "react";
import { IIText } from "../Text/Text";
import { View, StyleSheet, Image, TouchableOpacity, Modal } from "react-native";
import { Box } from "../Flexer/Flexer";
import { Colors } from "../utils/colors";
import { MTN_LOGO, LIGHT, MULTI_CHOICE, GLO_LOGO, AIRTEL_LOGO, NINE_MOBILE } from "../utils/Assets";
import Icon from 'react-native-vector-icons/Ionicons'
import { IView } from "../Flexer/Flexer";
import IModal from "../Modal/Modal";
import { useNavigation } from "@react-navigation/native";
import DeleteModal from "./DeleteModal";



const AirtimeCard = ({ type, data }) => {
    const navigation = useNavigation();
    const [visible, setVisible] = useState(false)
    const [deleteConfirmation, showDeleteConfirmation] = useState(false)
    const [book_id, setBookId] = useState('')

    console.log(data)
    return (
        <IView p={20} >
            <View >
                <View style={style.box}>
                    <Box
                        flexDirection='row'
                    >
                        {
                            type == 'Electricity' || type == 'Banks' ?
                                <>
                                    <Box
                                        h={50}
                                        w={50}
                                        borderWidth={1}
                                        borderColor='rgba(0,0,0,0.2)'
                                    >
                                        <IIText type='L' >{
                                            data?.name?.split(' ').length > 1 ?
                                                data?.name?.split(' ')[0].charAt(0).concat(data?.name?.split(' ')[1].charAt(0))
                                                : null
                                        }</IIText>
                                    </Box>
                                </>
                                :
                                <Image
                                    source={
                                        data?.product == 'multi-choice'
                                            ? MULTI_CHOICE
                                            : data?.saved_network == 'Globacom'
                                                ? GLO_LOGO
                                                : data?.saved_network == 'Airtel'
                                                    ? AIRTEL_LOGO
                                                    : data?.saved_network == '9mobile'
                                                        ? NINE_MOBILE
                                                        : MTN_LOGO

                                    }
                                    style={style.img}
                                />
                        }
                        <Box
                            h={60}
                            w={3}
                            borderWidth={1}
                            borderColor='rgba(0,0,0,0.2)'
                            marginLeft={10}
                        />
                        <Box
                            alignItems='flex-start'
                            paddingLeft={10}
                        >
                            <IIText type='L' size={16}>{data?.name}</IIText>
                            <IIText type='B'>{
                                type == 'Cable' ?
                                    `${data?.network}/${data?.number}`
                                    : type == 'Banks'
                                    ? (<>
                                        <IIText textAlign='center'>{data?.provider} {"\n"} {data?.number}</IIText>
                                    </>)
                                    : `${data?.saved_network || data?.network || data?.operator_name || data?.provider}/${data?.number}`
                            }</IIText>
                        </Box>
                    </Box>

                    <TouchableOpacity
                        onPress={() => {
                            setVisible(true)
                        }}
                    >
                        <Box
                            h={40}
                            w={40}
                            borderWidth={1}
                            marginTop={15}
                            borderColor='rgba(0,0,0,0.2)'
                        >
                            <Icon name='share' color={Colors.PRIMARY} size={20} />
                        </Box>
                    </TouchableOpacity>

                </View>
            </View>

            <IModal
                visible={visible}
                setVisible={setVisible}
            >
                <IView top={50}>
                    <Box
                        h={65}
                        w='100%'
                        backgroundColor={Colors.PRIMARY_FADED}

                    >
                        <IIText type='L' size={16}>
                            {data?.name}

                        </IIText>
                        <IIText type='B'>
                            {
                                type == 'Banks'
                                    ? (
                                        <>
                                            <IIText textAlign='center'>{data?.provider} {"\n"} {data?.number}</IIText>
                                        </>
                                    )
                                    : (
                                        <>
                                            {data?.network}/{data?.number}
                                        </>
                                    )
                            }
                        </IIText>
                    </Box>

                    <IView p={20}>
                        <Box
                            w='100%'
                            flexDirection='row'
                            justifyContent='space-around'
                        >
                            <TouchableOpacity
                                style={{ width: '25%' }}
                                onPress={() => {
                                    if (type == 'Airtime') {
                                        setVisible(false)
                                        navigation.navigate('Returning Airtime', {
                                            data: data
                                        })
                                    } else if (type == 'Cable') {
                                        setVisible(false)
                                        navigation.navigate('Cables Payment', {
                                            saved_data: data
                                        })
                                    } else if (type == 'Electricity') {
                                        setVisible(false)
                                        navigation.navigate('Electricity Payment', {
                                            saved_data: data
                                        })
                                    } else if (type == 'Banks') {
                                        navigation.navigate('Returning Transfer', {
                                            data: data
                                        })
                                    }
                                }}
                            >
                                <Box
                                    // w='25%'
                                    h={50}
                                    r={10}
                                    backgroundColor={Colors.PRIMARY_FADED}
                                    flexDirection='row'
                                >
                                    <Icon name='share' color={Colors.DEFAULT} size={20} />
                                    <IIText type='B'>Topup</IIText>
                                </Box>
                            </TouchableOpacity>

                            <Box
                                w='25%'
                                h={50}
                                r={10}
                                backgroundColor={Colors.PRIMARY_FADED}
                                flexDirection='row'
                            >
                                <Icon name='share' color={Colors.DEFAULT} size={20} />
                                <IIText type='B'>Edit</IIText>
                            </Box>
                            <TouchableOpacity
                                style={{ width: '25%' }}
                                onPress={() => {
                                    showDeleteConfirmation(true)
                                    setBookId(data?.book_id)

                                }}
                            >
                                <Box
                                    // w='25%'
                                    h={50}
                                    r={10}
                                    backgroundColor={Colors.PRIMARY_FADED}
                                    flexDirection='row'
                                >
                                    <Icon name='trash' color='red' size={20} />
                                    <IIText type='B' color='red'>Delete</IIText>
                                </Box>
                            </TouchableOpacity>
                        </Box>
                    </IView>
                </IView>
            </IModal>

            <DeleteModal
                visible={deleteConfirmation}
                setVisible={showDeleteConfirmation}
                book_id={data?.book_id}
                useData={
                    type == 'Cable'
                        ?
                        `${data?.network}/${data?.number}`
                        : type == 'Banks'
                            ? `${data?.provider}/${data?.number}`
                            : `${data?.saved_network}/${data?.number}`

                }
            />

        </IView>
    )
}

const style = StyleSheet.create({
    box: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.2)',
        width: '100%',
        height: 77,
        flexDirection: 'row',
        paddingLeft: 10,
        paddingRight: 10,
    },
    img: {
        width: 50,
        height: 50,
        borderRadius: 40
    }
})

export default AirtimeCard