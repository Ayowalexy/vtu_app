import React, { useContext } from "react";
import NetworkModal from "../Modal/Network";
import { NetworkContext } from "../../context/NetworkContext";
import { ActivityIndicator } from "react-native";
import IText, { IIText } from "../Text/Text";
import Icon from 'react-native-vector-icons/Ionicons';
import { Modal, Dimensions } from "react-native";
import { Button } from "../Flexer/Flexer";
import { Box } from "../Flexer/Flexer";
import { IView } from "../Flexer/Flexer";
import IModal from "../Modal/Modal";
import { Colors } from "../utils/colors";
import { formatNumber } from "../../utils/formatter";
import { useSelector } from "react-redux";
import { selectCurrentUser, selectSystemRates } from "../../redux/store/user/user.selector";
import { useNavigation } from "@react-navigation/native";


const Confirmation = ({ visible, setVisible, data, page, setConfirmed , verified}) => {

    const user = useSelector(selectCurrentUser)
    const rates = useSelector(selectSystemRates)
    const navigation = useNavigation()

    return (
        <IModal
            visible={visible}
            setVisible={setVisible}
            h={500}
        >
            <IView top={70}>
                <Box
                    w={Dimensions.get('screen').width}
                    justifyContent='center'
                >
                    <IIText color={Colors.DEFAULT_FADED_3} type='B' >Available Balance</IIText>
                    <IIText size={25} type='L'>₦{formatNumber(user?.balance)}</IIText>

                    <Box>
                        {
                            Object.keys(data)?.filter(d => d!== 'module_id')?.map((element, idx) => (
                                <Box
                                    paddingTop={20}
                                    w={Dimensions.get('window').width - 70}
                                    justifyContent='space-between'
                                    flexDirection='row'
                                    alignItems='center'
                                >
                                    <IIText textAlign='left' size={16} type='B' textTransform='capitalize'>
                                        {
                                            element == 'beneficiary' && !data[element].length ? null : element
                                        }
                                    </IIText>
                                    <IIText width={200} size={15} textAlign='right'>
                                        {
                                            element == 'beneficiary' 
                                            ? (
                                               <>
                                                    {
                                                        !data[element].length ? null : data[element]
                                                    }
                                               </>
                                            ) 
                                            : 
                                            element == "amount" 
                                            ? (
                                                <>
                                                    {
                                                        '₦'+formatNumber(data[element])
                                                    }
                                                </>
                                            )
                                            :
                                             `${data[element]} `
                                        }
                                        
                                    </IIText>
                                </Box>
                            ))
                        }

                    </Box>

                </Box>
                <IView p={20}>
                    <Button
                        onPress={() => {
                            setVisible(false)
                            navigation.navigate('Pin', {
                                page: page
                            })
                        }}
                    >Pay Now</Button>
                    <IIText paddingTop={5} size={12} color={Colors.DEFAULT_FADED_3} textAlign='center' type='B'>Powered by {rates?.app_details?.app_name}</IIText>
                </IView>
            </IView>
        </IModal>
    )
}

export default Confirmation