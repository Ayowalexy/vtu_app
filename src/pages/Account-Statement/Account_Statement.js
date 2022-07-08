import React, { useState, useEffect, useContext } from "react";
import { IIText } from "../../components/Text/Text";
import { Box } from "../../components/Flexer/Flexer";
import { Formik, Field } from "formik";
import { IView } from "../../components/Flexer/Flexer";
import FormView from "../../components/FormView/FormView";
import ParentComponent from "../../../navigators";
import { Header } from "../../components/Flexer/Flexer";
import { Button } from "../../components/Flexer/Flexer";
import { ITextInput } from "../../components/Input/Input";
import DatePicker from "react-native-date-picker";
import { TouchableOpacity } from "react-native";
import { DefaultTheme } from "@react-navigation/native";
import { Colors } from "../../components/utils/colors";
import Icon from 'react-native-vector-icons/Ionicons'
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/store/user/user.selector";
import Spinner from "../../components/Spinner/Spinner";
import NetworkModal from "../../components/Modal/Network";
import { NetworkContext } from "../../context/NetworkContext";
import { useMutation } from "react-query";
import { accountStatement } from "../../services/network";

const AccountStatement = () => {
    const [date, setDate] = useState(new Date())
    const [end_date, set_end_date] = useState(new Date())
    const [open_end_date, set_open_end_date] = useState(false)
    const [open, setOpen] = useState(false)
    const [email_addres, set_email_address] = useState('')
    const user = useSelector(selectCurrentUser)
    const [account, setAccount] = useState(user?.account_number)
    const [type, setType] = useState('')
    const [visible, setVisible] = useState(false)
    const { isConnected } = useContext(NetworkContext)
    const [msg, setMsg] = useState('')
    const [data, setData] = useState('')


    useEffect(() => {
        set_email_address(user?.email_address)
    }, [])

    const {isLoading, mutate} = useMutation(accountStatement, {
        onSuccess: data => {
            console.log("data?.data", data?.data)
            if(data?.data?.flag == 1){
                setType('verify')
                setData(data?.data?.message)
                setVisible(true)
            }
        }
    })


    const handleSubmit = () => {
        if (isConnected) {
            setType('internet')
            setVisible(true)
            return;
        }

        setMsg('Fetching your statement, Please wait....')
        const payload = {
            end_date: end_date,
            start_date: date,
            account_number: account,
            email: email_addres
        }

        mutate(payload)
    }

    return (
        <ParentComponent>
            <Header>Account Statement</Header>
            
            <FormView>
            <IIText textAlign='center' type='L'>
                Please provider the details below to request a statement
            </IIText>
                <DatePicker
                    modal
                    open={open}
                    date={date}
                    onConfirm={(date) => {
                        setOpen(false)
                        setDate(date)

                    }}
                    onCancel={() => {
                        setOpen(false)

                    }}
                />
                <DatePicker
                    modal
                    open={open_end_date}
                    date={end_date}
                    onConfirm={(date) => {
                        set_open_end_date(false)
                        set_end_date(date)

                    }}
                    onCancel={() => {
                        set_open_end_date(false)

                    }}
                />
                <>

                    <ITextInput
                        value={account}
                        onChange={setAccount}
                        text='Selected Account'
                        placeholder='Enter Account number'
                    />

                    <IIText marginTop={20} type='B'>
                        Select start date
                    </IIText>
                    <TouchableOpacity onPress={() => setOpen(true)}>
                        <Box
                            w='100%'
                            h={50}
                            alignItems='center'
                            flexDirection='row'
                            justifyContent='space-between'
                            paddingLeft={10}
                            paddingRight={10}
                            r={10}
                            backgroundColor={DefaultTheme?.colors?.background}


                        >
                            <IIText type='B'>
                                {date.toLocaleDateString()}
                            </IIText>
                            <Icon name='ios-calendar' size={30} color={Colors.PRIMARY} />
                        </Box>
                    </TouchableOpacity>

                    <IIText marginTop={20} type='B'>
                        Select end date
                    </IIText>
                    <TouchableOpacity onPress={() => set_open_end_date(true)}>
                        <Box
                            w='100%'
                            h={50}
                            r={10}
                            alignItems='center'
                            flexDirection='row'
                            justifyContent='space-between'
                            paddingLeft={10}
                            paddingRight={10}
                            backgroundColor={DefaultTheme?.colors?.background}


                        >
                            <IIText type='B'>
                                {end_date.toLocaleDateString()}
                            </IIText>
                            <Icon name='ios-calendar' size={30} color={Colors.PRIMARY} />
                        </Box>
                    </TouchableOpacity>

                    <ITextInput
                        value={email_addres}
                        onChange={set_email_address}
                        text='Email Address'
                        placeholder='Enter your email address'
                    />
                </>
                <Button
                    onPress={handleSubmit}
                    disabled={
                        !(date && end_date && email_addres) && true
                    }
                >Request</Button>
            </FormView>
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

export default AccountStatement