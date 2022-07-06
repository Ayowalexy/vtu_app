import React from "react";
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
import { selectCurrentUser } from "../../redux/store/user/user.selector";

const TransactionDetails = ({ navigation, route }) => {
    const user = useSelector(selectCurrentUser)

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
                <Header>Transaction Receipt</Header>
                <ScrollView>
                    <IView marginTop={-40} marginBottom={100}>
                        <FormView showBack={false}>
                            <IIText type='L'>Transaction Details @ {route?.params?.data?.transaction_type}</IIText>
                            <Box
                                w='100%'
                                borderBottomWidth={0.3}
                            />
                            {
                                Object.keys(route?.params?.data)?.map((element, idx) => (
                                    <>
                                        <Box
                                            marginTop={10}
                                            flexDirection='row'
                                            justifyContent='flex-start'
                                        >
                                            <IIText textTransform='capitalize' type='B'>{
                                                element?.includes('_') ? element.split('_').join(' ') : element
                                            }:</IIText>
                                            <IIText 
                                                type='B' 
                                                color={
                                                    route?.params?.data[element] == 'Credit' ? Colors.SUCCESS : route?.params?.data[element] == 'Debit' ? Colors.ERROR : Colors.DEFAULT
                                                }
                                                paddingLeft={10}>{route?.params?.data[element]}</IIText>
                                        </Box>
                                    </>
                                ))
                            }
                        </FormView>


                        <IView marginTop={-50}>
                            <FormView showBack={false}>
                                <IIText type='L'>Account Details</IIText>
                                <Box
                                    w='100%'
                                    borderBottomWidth={0.3}
                                />
                                {
                                    account_details?.map((element, idx) => (
                                        <>
                                            <Box
                                                key={idx}
                                                marginTop={10}
                                                flexDirection='row'
                                                justifyContent='flex-start'
                                            >
                                                <IIText type='B'>{element.type}:</IIText>
                                                <IIText type='B' paddingLeft={10}>{element.value}</IIText>
                                            </Box>
                                        </>
                                    ))
                                }
                            </FormView>
                        </IView>


                        <Box
                            flexDirection='row'
                            flexWrap='wrap'
                            justifyContent='space-between'
                            w='100%'
                            paddingLeft={20}
                            paddingRight={20}
                        >
                            <PDF data={data} />
                            <ShareDetails data={data} />


                            <TouchableOpacity
                                onPress={() => navigation.goBack()}
                                style={{
                                    flexGrow: 1,
                                    height: 40
                                }}
                            >
                                <Box
                                    flexGrow={1}
                                    r={20}
                                    borderWidth={1}
                                    h={40}
                                    borderColor={Colors.PRIMARY}

                                >
                                    <IIText color={Colors.DEFAULT} type='B'>Close</IIText>

                                </Box>
                            </TouchableOpacity>
                        </Box>
                    </IView>
                </ScrollView>
            </>


        </ParentComponent>
    )
}


export default TransactionDetails