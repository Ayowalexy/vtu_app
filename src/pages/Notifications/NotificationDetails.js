import React, {useContext, useEffect, useState } from "react";
import { Box } from "../../components/Flexer/Flexer";
import { IIText } from "../../components/Text/Text";
import { IFlexer } from "../../components/Flexer/Flexer";
import { Header } from "../../components/Flexer/Flexer";
import ParentComponent from "../../../navigators";
import { IView } from "../../components/Flexer/Flexer";
import FormView from "../../components/FormView/FormView";
import { Colors } from "../../components/utils/colors";
import PDF from "../../components/Pdf/PDF";
import ShareDetails from "../../components/Share/Share";
import { TouchableOpacity, ScrollView } from "react-native";
import { useSelector } from "react-redux";
import { useMutation } from "react-query";
import { notifications } from "../../services/network";
import { NetworkContext } from "../../context/NetworkContext";
import { selectCurrentUser } from "../../redux/store/user/user.selector";

const NotificationDetails = ({ navigation, route }) => {
    const user = useSelector(selectCurrentUser)
    const [type, setType] = useState('')
    const [useData, setData] = useState('')
    const [visible, setVisible] = useState(false)
    const [msg, setMsg] = useState('')
    const { isConnected } = useContext(NetworkContext)
    const [notify, setNotitify] = useState([])

    const { isLoading, mutate } = useMutation(notifications, {
        onSuccess: data => {
            console.log(data?.data)
            if (data?.data?.length) {
                setNotitify(data?.data)
            }
        }
    })

    useEffect(() => {

        if (isConnected) {
            setType('internet')
            setVisible(true)
            return;
        }

        mutate({ type: 'read', n_id: route?.params?.data?.n_id })

    }, [])

    const { data } = route?.params
    const account_details = [
        {
            type: 'Account Name',
            value: user?.first_name?.concat(' ', user?.last_name)
        },
        {
            type: 'Account Number',
            value: user?.account_number
        },
        {
            type: 'Channnel',
            value:route?.params?.data?.channel
        }
    ]


    return (
        <ParentComponent>
            <>
                <Header>Notfication</Header>
                <ScrollView>
                    <IView marginTop={-40} marginBottom={100}>
                        <FormView showBack={false}>
                            <IIText width={280} type='L'>{route?.params?.data?.n_title}</IIText>
                            <Box
                                w='100%'
                                borderBottomWidth={0.3}
                            />

                            <IIText type='B' paddingTop={20}>
                                {
                                    route?.params?.data?.n_body
                                }
                            </IIText>
                            <IIText type='B' paddingTop={20}>
                                {
                                    route?.params?.data?.n_date
                                }
                            </IIText>


                           
                        </FormView>
                    </IView>
                </ScrollView>
            </>


        </ParentComponent>
    )
}


export default NotificationDetails