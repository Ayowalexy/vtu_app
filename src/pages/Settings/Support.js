import React from "react";
import { Box } from "../../components/Flexer/Flexer";
import { IIText } from "../../components/Text/Text";
import { IView } from "../../components/Flexer/Flexer";
import ParentComponent from "../../../navigators";
import Icon from 'react-native-vector-icons/FontAwesome5'
import { IIFlexer } from "../../components/Flexer/Flexer";
import { Colors } from "../../components/utils/colors";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from 'react-redux';
import { Button } from "../../components/Flexer/Flexer";
import { selectTickets } from '../../redux/store/support/support.selectors';




const Support = () => {

    const navigation = useNavigation()
    const cards = useSelector(selectTickets)
    const randColor = () => {
        const color = `rgb(${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 100)})`
        return color
    }

    return (
        <IView>
            <IView>
                <Button onPress={() => navigation.navigate('Ticket Tabs')}>My Tickets</Button>
            </IView>
            <Box
                w='100%'
                flexDirection='row'
                flexWrap='wrap'
                justifyContent='space-between'
            >
                {
                    cards?.map((element, idx) => (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => {

                                navigation.navigate('Support Details', {
                                    ticket_id: element?.subject_id
                                })

                            }}
                            style={{
                                height: 150,
                                width: '47%',
                                marginTop: 20
                            }}
                        >
                            <Box
                                h={150}
                                backgroundColor={randColor()}
                                r={20}
                            >
                                <Icon name={element?.icon} size={50} color={Colors.PRIMARY} />
                                <IIText textAlign='center' size={16} color={Colors.WHITE} type='B' >
                                    {
                                        element?.subject?.split(' ').join('\n')
                                    }
                                </IIText>
                            </Box>
                        </TouchableOpacity>
                    ))
                }
            </Box>
        </IView>
    )
}

export default Support