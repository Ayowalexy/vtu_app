import React, { useEffect, useState } from "react";
import { Box } from "../../components/Flexer/Flexer";
import { IIText } from "../../components/Text/Text";
import { Image } from "react-native";
import { Header } from "../../components/Flexer/Flexer";
import ParentComponent from "../../../navigators";
import { APP_LOGO } from "../../components/utils/Assets";
import { IView } from "../../components/Flexer/Flexer";
import { useMutation } from "react-query";
import { getAllVendors } from "../../services/network";
import Spinner from "../../components/Spinner/Spinner";
import { useRoute } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Colors } from "../../components/utils/colors";


const VoucherProfile = ({ navigation }) => {
    const route = useRoute();
    const [profile, setProfile] = useState({})
    const { isLoading, mutate } = useMutation(getAllVendors, {
        onSuccess: data => {
            console.log("data?.data ==", data?.data)
            if (data?.data?.flag == 1) {
                setProfile(data?.data?.data)
            }
        }
    })

    useEffect(() => {
        mutate({
            type: "profile",
            vendor_id: route?.params?.vendor_id
        })
    }, [])

    const donot_show = ['account_status', 'vendor_id', 'profile']




    return (
        <ParentComponent>
            <Header>Profile</Header>
            <IView p={30}>
                <Box
                    flexDirection='row'
                    justifyContent='flex-start'
                    alignItems='center'
                >
                    <Image
                        source={{
                            uri: profile?.profile
                        }}
                        style={{
                            width: 80,
                            height: 80,
                            borderRadius: 50
                        }}
                    />
                    <Box
                        paddingLeft={10}
                        alignItems='flex-start'
                    >
                        <IIText type='L'>John Smith {' '}
                        {
                            profile?.account_status == 'Verified' && <Icon name='verified' size={15} color={Colors.SUCCESS} />
                        }
                        </IIText>
                        <IIText type='B'>Vendor</IIText>
                    </Box>

                </Box>

                <IIText
                    paddingTop={30}
                    size={16}
                    type='B'>Vendor Details</IIText>
                <Box w={100} borderBottomWidth={1} />


                {

                    Object.keys(profile)?.map((element, idx) => (
                        <>
                            {
                                donot_show.includes(element) ?
                                    null
                                    : (<>
                                        <Box
                                            key={idx}
                                            marginTop={10}
                                            flexDirection='row'
                                            justifyContent='flex-start'
                                        >
                                            <IIText textTransform='capitalize' type='B'>{
                                                element?.includes('_') ? element.split('_').join(' ') : element
                                            }:</IIText>
                                            <IIText
                                                type='B'

                                                paddingLeft={10}>{profile[element]}</IIText>
                                        </Box>
                                    </>)
                            }
                        </>
                    ))
                }
            </IView>{isLoading && (<Spinner
                loading='Loading profile, please wait...'
            />)}
        </ParentComponent>
    )
}

export default VoucherProfile