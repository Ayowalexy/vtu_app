import React, { useState, useContext } from 'react'
import { Box } from '../../components/Flexer/Flexer'
import { IView } from '../../components/Flexer/Flexer'
import ParentComponent from '../../../navigators'
import { Header } from '../../components/Flexer/Flexer'
import { IIText } from '../../components/Text/Text'
import FormView from '../../components/FormView/FormView'
import { ITextInput } from '../../components/Input/Input'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../../redux/store/user/user.selector'
import { Button } from '../../components/Flexer/Flexer'
import {useMutation} from 'react-query';
import { NetworkContext } from '../../context/NetworkContext'
import Spinner from '../../components/Spinner/Spinner'
import NetworkModal from "../../components/Modal/Network";
import { createNewTickets } from '../../services/network'



const ContactSupport = () => {

    const user = useSelector(selectCurrentUser)
    const [title, setTitle] = useState('')
    const [message, setMessage] = useState('')
    const [type, setType] = useState('')
    const [visible, setVsisble] = useState(false)
    const [msg, setMsg] = useState('')
    const [data, setData] = useState('')
    const {isConnected} = useContext(NetworkContext)

    const { isLoading, mutate } = useMutation(createNewTickets, {
        onSuccess: data => {
            if(data?.data?.flag == 1){
                setType('change')
                setData(data?.data?.message)
                setVsisble(true)
            }
        }
    })


    const handleSubmit = () => {
        if (isConnected) {
            setType('internet')
            setVsisble(true)
            return;
        }

        setMsg('Submitting your question, Please wait....')

        const payload = {
            title,
            message,
            user: user?.first_name,
            type: 'create'
        }

        console.log(payload)
        mutate(payload)
    }

    return (
        <ParentComponent>
            <Header>Contact Support</Header>
            <FormView>
                
                <ITextInput
                    value={title}
                    onChange={setTitle}
                    text='Message Title'
                    placeholder='Enter your title'

                />
                <ITextInput
                    value={message}
                    onChange={setMessage}
                    text='Message body'
                    placeholder='What will you like to ask support'
                    multiline={true}
                    numberOfLines={10}
                    height={160}
                    textAlignVertical='top'
                />

                <Button onPress={handleSubmit}>
                    SUBMIT
                </Button>

            </FormView>
            <NetworkModal
                type={type}
                visible={visible}
                data={data}
                setVisible={setVsisble}
            />
            {isLoading && (<Spinner
                loading={msg}
            />)}
        </ParentComponent>
    )
}

export default ContactSupport