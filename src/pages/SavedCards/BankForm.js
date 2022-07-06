import React, { useState, useEffect, useContext } from "react";
import { IIText } from "../../components/Text/Text";
import { ScrollView } from "react-native";
import ParentComponent from "../../../navigators";
import { Header } from "../../components/Flexer/Flexer";
import FormView from "../../components/FormView/FormView";
import { TextInput, View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { Formik, Field } from "formik";
import * as Yup from 'yup';
import { Colors } from "../../components/utils/colors";
import { Box } from "../../components/Flexer/Flexer";
import { ITextInput } from "../../components/Input/Input";
import Animated, { SlideInLeft, Layout } from "react-native-reanimated";
import { useMutation } from "react-query";
import { getAllPhoneBooks } from "../../services/network";
import Spinner from "../../components/Spinner/Spinner";
import { useSelector } from "react-redux";
import { NetworkContext } from "../../context/NetworkContext";
import { selectServices } from "../../redux/store/user/user.selector";
import NetworkModal from "../../components/Modal/Network";
import { DefaultTheme } from "@react-navigation/native";
import IModal from "../../components/Modal/Modal";
import { listOfBanks } from "../../services/network";
import { IView } from "../../components/Flexer/Flexer";
import Search from "../../components/Search/Search";


const PhoneSchema = Yup.object().shape({
    phone_number: Yup.string().required("Please, enter phone number")
})

const BankForm = ({ navigation, route }) => {

    const [network, setNetwork] = useState({})
    const [msg, setMsg] = useState('')
    const [type, setType] = useState('')
    const [visible, setVisible] = useState(false)
    const [data, setData] = useState('')
    const [phone_number, set_phone_number] = useState('')
    const [name, setName] = useState('')
    const [saving, setSaving] = useState(false)
    const [verified, setVerified] = useState('')
    const [hasError, setHasError] = useState(false)
    const [search, setSearch] = useState('')
    const [showBankModal, setShowBankModal] = useState(false)
    const [banks, setBanks] = useState([])
    const [selectedBank, setSelectedBank] = useState('')
    const [account_number, setAccountNumber] = useState('')
    const [verifiedBank, setVerifiedBank] = useState('')


    const { isConnected } = useContext(NetworkContext)
    const services = useSelector(selectServices)

    const { isLoading, mutate } = useMutation(getAllPhoneBooks, {
        onSuccess: data => {
            console.log(data?.data)
            if (data?.data?.flag == 1) {
                setNetwork(data?.data?.result)
            } else if (data?.data?.flag == 0) {
                setType('invalid')
                setData(data?.data?.message)
                setVisible(true)
            }
        }
    })

    const listAllBanksMutation = useMutation(listOfBanks, {
        onSuccess: data => {
            if (data?.data?.flag == 1) {
                setBanks(data?.data?.result?.banks)
            } else {
                setType('invalid')
                setData(data?.data?.message)
                setVisible(true)
            }
        }
    })

    const handleVerifyMutation = useMutation(listOfBanks, {
        onSuccess: data => {
            console.log(data?.data)
            if (data?.data?.["flag"] == 1) {
                setVerifiedBank(data?.data?.result)
            } else {
                setType('invalid')
                setData(data?.data?.message)
                setVisible(true)
            }
        }
    })


    const handleSave = async () => {

        setSaving(true)
        const payload = {
            phone_number: account_number,
            operator_name: verifiedBank?.target_bankName,
            name: verifiedBank?.target_accountName,
            phonebook_type: "Account",
            type: 'add',
            last_product: null,
            expiry_date: null
        }

        if (isConnected) {
            setType('internet')
            setVisible(true)
            return;
        }

        setMsg('Saving your account, please wait...')

        const save = await getAllPhoneBooks(payload)

        if (save?.status == 200) {
            console.log(save?.data)
            if (save?.data?.flag == 2) {
                setType('invalid')
                setData(save?.data?.message)
                setVisible(true)
            } else if (save?.data?.flag == 1) {
                setType('added')
                setData(save?.data?.message)
                setVisible(true)
            }
        }

        setSaving(false)
    }


    const handleFetchBanks = () => {
        if (isConnected) {
            setType('internet')
            setVisible(true)
            return
        }

        setMsg('Loading details, please wait...')
        const payload = {
            type: 'banks'
        }

        listAllBanksMutation.mutate(payload)
    }

    const handleVerify = () => {
        if (isConnected) {
            setType('internet')
            setVisible(true)
            return
        }

        setMsg('Verifying account, please wait...')
        const payload = {
            shortcode: selectedBank?.sortCode,
            account_number: account_number,
            type: 'validate'
        }

        handleVerifyMutation.mutate(payload)
    }


    useEffect(() => {
        handleFetchBanks()
    }, [])


    useEffect(() => {
        if (account_number.length == 10) {
            handleVerify()
        }
    }, [account_number])

    const handleSubmit = values => {
        handleVerify(values.phone_number)
    }

    return (
        <ParentComponent>
            <Header>Add new Bank Account</Header>
            <FormView>
                <>

                    <Animated.View
                        layout={Layout.springify()}
                    >

                        <IIText marginTop={20} type='B'>
                            Select Bank Account
                        </IIText>
                        <TouchableOpacity
                            onPress={() => {
                                // setVisible(true)
                                setShowBankModal(true)
                            }}
                        >
                            <Box
                                w='100%'
                                h={50}
                                alignItems='flex-start'
                                r={10}
                                backgroundColor={DefaultTheme?.colors?.background}


                            >
                                <IIText paddingLeft={20} type='B'>
                                    {selectedBank?.name ? selectedBank?.name : banks[0]?.name}
                                </IIText>
                            </Box>
                        </TouchableOpacity>

                        <ITextInput
                            value={account_number}
                            onChangeText={setAccountNumber}
                            text='Enter your account number'
                        />


                        {
                            Boolean(verifiedBank) && (
                                <>
                                    <Animated.View
                                        entering={SlideInLeft.delay(100)}

                                    >
                                        <ITextInput
                                            value={verifiedBank?.target_accountName}
                                            onChangeText={setAccountNumber}
                                            text='Account name'
                                            editable={false}
                                        />
                                    </Animated.View>
                                </>
                            )
                        }

                        <TouchableOpacity
                            onPress={() => {
                                if (Boolean(verifiedBank)) {

                                    if (route?.params?.verified) {
                                        handleSave()
                                    } else {
                                        navigation.navigate('Pin', {
                                            page: 'Bank Form'
                                        })
                                    }
                                }
                            }}
                        >
                            <Box
                                w='100%'
                                h={50}
                                backgroundColor={Colors.PRIMARY}
                                r={10}
                                marginTop={30}
                            >
                                <IIText size={16} color={Colors.DEFAULT}>
                                    {
                                        route?.params?.verified ? 'Save' : 'Verify'
                                    }
                                </IIText>
                            </Box>
                        </TouchableOpacity>

                    </Animated.View>

                </>
            </FormView>

            <IModal
                visible={showBankModal}
                setVisible={setShowBankModal}
                h={400}
            >
                <IView
                    p={20}

                >
                    <Search
                        value={search}
                        onChangeText={setSearch}
                        placeholder='Search bank'
                    />
                </IView>
                <ScrollView>
                    <IView
                        p={30}
                    >
                        <IIText paddingTop={-30} size={19} type='L'>Banks</IIText>
                        <FlatList
                            data={banks?.filter(element => element?.name?.toLowerCase()?.includes(search?.toLowerCase()))}
                            renderItem={({ item, index }) => (
                                <TouchableOpacity
                                    onPress={() => {
                                        setSelectedBank(item)
                                        setShowBankModal(false)
                                    }}
                                >
                                    <Box

                                        flexDirection='row'
                                        justifyContent='flex-start'
                                        alignItems='center'
                                        w='100%'
                                        marginBottom={15}
                                    >
                                        <IIText type='L'>{Number(index) + 1}. </IIText>
                                        <IIText type='B'>{item?.name}</IIText>
                                    </Box>
                                </TouchableOpacity>
                            )}
                            showsVerticalScrollIndicator={false}
                            keyExtractor={({ item, idx }) => idx}
                        />


                    </IView>
                </ScrollView>

            </IModal>
            <NetworkModal
                type={type}
                visible={visible}
                data={data}
                setVisible={setVisible}
            />
            {(isLoading || saving) && (<Spinner
                loading={msg}
            />)}
            {listAllBanksMutation.isLoading && (<Spinner
                loading={msg}
            />)}
             {handleVerifyMutation.isLoading && (<Spinner
                loading={msg}
            />)}


        </ParentComponent>
    )
}


const styles = StyleSheet.create({

})
export default BankForm