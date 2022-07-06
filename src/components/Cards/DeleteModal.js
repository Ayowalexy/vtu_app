import React, { useContext, useState } from "react";
import { Box } from "../Flexer/Flexer";
import { NetworkContext } from "../../context/NetworkContext";
import { IView } from "../Flexer/Flexer";
import { Modal } from "react-native";
import { IIText } from "../Text/Text";
import { Colors } from "../utils/colors";
import { TouchableOpacity } from "react-native";
import { getAllPhoneBooks } from "../../services/network";
import { useMutation } from "react-query";
import CircularProgress from 'react-native-circular-progress-indicator';
import Icon from 'react-native-vector-icons/Ionicons'
import { View } from "react-native";
import NetworkModal from "../Modal/Network";



const DeleteModal = ({ visible, setVisible, book_id, useData }) => {


    const [type, setType] = useState('')
    const [data, setData] = useState('')
    const [showNetwork, setShowNetwork] = useState(false)
    const { isConnected } = useContext(NetworkContext)
    const [showSuccess, setShowSuccess] = useState(false)
    const { setStartFetch } = useContext(NetworkContext)

    const { isLoading, mutate } = useMutation(getAllPhoneBooks, {
        onSuccess: data => {
            if (data?.data?.flag == 1) {
                setStartFetch(true)
                setVisible(false)
                setType('delete')
                setData('Deleted successfully')
                setShowNetwork(true)
            }
        }
    })


    const handleDelete = () => {

        if (isConnected) {

            return;
        }
        const payload = {
            type: 'delete',
            book_id
        }
        mutate(payload)

    }




    const Progress = () => (
        <Box
            h='100%'
        >
            <CircularProgress
                value={100}
                radius={35}
                activeStrokeWidth={12}
                progressValueColor={Colors.ERROR}
                inActiveStrokeWidth={0}
                duration={2000}
                activeStrokeColor={Colors.ERROR}
                
            >
            </CircularProgress>

            <View
                style={{
                    position: 'absolute',
                    left: 5,
                    top: '36%'
                }}
            >
                <Box
                    w={60}
                    h={60}
                    r={40}
                    backgroundColor={Colors.ERROR_FADED}
                >
                    <Icon name='trash-bin-sharp' size={35} color={Colors.ERROR} />
                </Box>
            </View>
        </Box>
    )


    const DeletePrompt = () => (
        <>

            <IIText marginTop={20} textAlign='center' type='B'>Are you sure you want {"\n"}to delete this service?</IIText>
            <Box
                w="100%"
                h={40}
                backgroundColor={Colors.SUCCESS_FADED}
            >
                <IIText type='L'>{useData}</IIText>
            </Box>
            <Box
                flexDirection='row'
                h={60}
                // marginTop={30}
                w='100%'
                backgroundColor={Colors.DEFAULT_FADED_2}
            >
                <Box
                    w='100%'
                    justifyContent='space-between'
                    flexDirection='row'
                >
                    <TouchableOpacity

                        onPress={handleDelete}
                        style={{
                            width: '50%',
                            height: 60
                        }}
                    >
                        <Box
                            // w='50%'
                            h={60}
                        >
                            <IIText type='L' color={Colors.ERROR}>Yes</IIText>
                        </Box>
                    </TouchableOpacity>
                    <TouchableOpacity

                        onPress={() => {
                            setVisible(false)
                        }}
                        style={{
                            width: '50%',
                            height: 60
                        }}
                    >
                        <Box
                            // w='50%'
                            h={60}
                        >
                            <IIText type='L' color={Colors.DEFAULT}>No</IIText>
                        </Box>
                    </TouchableOpacity>
                </Box>
            </Box>

        </>
    )

    return (
        <>

            <Modal
                visible={visible}
                onRequestClose={() => setVisible(!visible)}
                animationType='slide'
                transparent={true}
            >
                <Box
                    h='100%'
                    w='100%'
                    backgroundColor='rgba(0,0,0,0.7)'

                >
                    <Box
                        w='80%'
                        h={200}
                        r={10}
                        backgroundColor={Colors.WHITE}
                        justifyContent='space-between'
                    >
                        {/* <DeletePrompt /> */}
                        {/* <Succes /> */}
                        {
                            isLoading ? <Progress /> : <DeletePrompt />
                        }

                    </Box>

                </Box>
            </Modal>
            <NetworkModal
                type={type}
                visible={showNetwork}
                data={data}
                setVisible={setShowNetwork}
            />
        </>
    )
}

export default DeleteModal