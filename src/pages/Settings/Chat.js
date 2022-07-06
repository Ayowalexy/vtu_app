import React, { useState, useCallback, useEffect, useContext } from 'react'
import ParentComponent from '../../../navigators'
import { Header, Box } from '../../components/Flexer/Flexer'
import { IIText } from "../../components/Text/Text";
import Spinner from '../../components/Spinner/Spinner';
import { NetworkContext } from '../../context/NetworkContext';
import { useMutation } from 'react-query';
import { createNewTickets } from '../../services/network';
import { useRoute } from '@react-navigation/native';
import { IView } from '../../components/Flexer/Flexer';
import useTheme from '@react-navigation/native';
import { Colors } from '../../components/utils/colors';
import { ScrollView, View, Dimensions, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { ITextInput } from '../../components/Input/Input';
import { DefaultTheme } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome'
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../redux/store/user/user.selector';
import ChatM from './Msg';
import IModal from '../../components/Modal/Modal';
import { useNavigation } from '@react-navigation/native';



const Chat = () => {
  const [type, setType] = useState('')
  const [msg, setMsg] = useState('')
  const { isConnected } = useContext(NetworkContext)
  const [value, setValue] = useState('')
  const route = useRoute();
  const [messages, setMessages] = useState([])
  const user = useSelector(selectCurrentUser)
  const [bool, setBool] = useState(true)
  const [visible, setVisible] = useState(false)
  const [showNetwork, setShowNetwork] = useState(false)
  // const theme = useTheme();
  const navigation = useNavigation();


  const { isLoading, mutate } = useMutation(createNewTickets, {
    onSuccess: data => {
      console.log("data?.data", data?.data)
      if (data?.data?.length) {
        setMessages(data?.data)
      }
    }
  })

  const sendMessageMutation = useMutation(createNewTickets, {
    onSuccess: data => {
      console.log("data?.data", data?.data)
      if (data?.data?.length) {
        setMessages(data?.data)
      }
    }
  })


  const closeTicketMutation = useMutation(createNewTickets, {
    onSuccess: data => {
      console.log(data?.data)
      if(data?.data?.flag == 1){
        setVisible(false)
        navigation.goBack()
      }
    }
  })



  const handleCloseTicket = () => {
    if (isConnected) {
      setType('internet')
      showNetwork(true)
      return;
    }

    setBool(true)

    setMsg('Closing conversation, Please wait....')
    const payload = {
      type: 'close',
      ticket_id: route?.params?.data,
    }
    closeTicketMutation.mutate(payload)
  }


  const handleSendMessage = () => {
    setBool(false)
    Promise.resolve(
      sendMessageMutation.mutate({
        type: 'reply',
        ticket_id: route?.params?.data,
        user: user?.first_name,
        message: value
      })
    )
      .then(() => handleFetch(false)
      )
  }

  console.log(route?.params?.ticket_status)

  const handleFetch = (bool) => {
    if (isConnected) {
      setType('internet')
      setShowNetwork(true)
      return;
    }


    setMsg('Loading conversation, Please wait....')
    setValue('')
    mutate({ type: 'details', ticket_id: route?.params?.data })
  }

  useEffect(() => {
    setBool(true)
    handleFetch()
  }, [])

  const ChatBox = ({ data }) => (
    <Box
      alignSelf={user?.first_name !== data?.sender ? 'flex-start' : 'flex-end'}
      padding={10}
      w={220}
      marginTop={30}
      justifyContent='center'
      alignItems='center'
      backgroundColor={user?.first_name !== data?.sender ? Colors.PRIMARY_FADED : Colors.PRIMARY_FADED_2}
      r={20}
    >
      <IIText alignSelf='flex-start' paddingLeft={10}  type='B'>
        {data?.message}
      </IIText>
      <IIText 
        alignSelf={user?.first_name !== data?.sender ? 'flex-start' : 'flex-end'} 
        paddingTop={10} 
        size={13} 
        textAlign='right' 
        type='B'>{data?.sent_date}</IIText>
    </Box>
  )

  return (
    <>
      {/* <ParentComponent>
       
        {/* <IView p={20}  > */}
      <Header>Chat Support</Header>
      <ScrollView
        style={{
          flex: 1,
          borderColor: 'red',
          padding: 20,
          backgroundColor: Colors.WHITE
        }}
        showsVerticalScrollIndicator={false}>
        <Box
          w='100%'
          marginBottom={200}
        >
          {
            messages?.map((element, idx) => (
              <ChatBox data={element} />
            ))
          }

        </Box>



      </ScrollView>
      <TouchableOpacity
        onPress={() => setVisible(true)}
        style={{
          position: 'absolute',
          right: 15,
          top: 15
        }}
      >
        <Icon name='window-close' size={25} color={Colors.ERROR} />
      </TouchableOpacity>
      <Box
        flexDirection='row'
        w='100%'
      >
        <View
          style={{
            width: '100%',
            backgroundColor: Colors.WHITE,
            padding: 30,
            // paddingBottom: 50,
            position: 'absolute',
            bottom: 0,

          }}
        >
          <ITextInput
            value={value}
            editable={route?.params?.ticket_status == 'Closed' ? false : true}
            marginTop={-40}
            onChange={setValue}
            placeholder='Enter message'
            multiline={true}
            numberOfLines={10}
            textAlignVertical='top'

          />
          <TouchableOpacity
            disabled={value.length < 1 ? true : false}
            onPress={handleSendMessage}
            style={{
              position: 'absolute',
              right: 40,
              top: 40
            }}
          >

            <Icon name='send-o' size={25} color={Colors.PRIMARY} />
          </TouchableOpacity>
        </View>
      </Box>
      <IModal
        h={170}
        setVisible={setVisible}
        visible={visible}
      >
        <IView p={50}>
          <IIText type='B'>Are you sure you want to close this ticket?</IIText>
          <Box
            flexDirection='row'
            w={100}
            paddingTop={20}
            justifyContent='space-between'
          >
            <TouchableOpacity
              onPress={handleCloseTicket}
            >
              <IIText type='L' color={Colors.ERROR}>Yes</IIText>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <IIText type='L' color={Colors.DEFAULT}>No</IIText>
            </TouchableOpacity>
          </Box>
        </IView>
      </IModal>
      {/* </IView> */}
      {bool && (
        <>
          {isLoading && (<Spinner
            loading={msg}
          />)}
        </>
      )}

      {closeTicketMutation.isLoading && (<Spinner
        loading={msg}
      />)}
      {/* </ParentComponent> */}
    </>

  )
}

export default Chat