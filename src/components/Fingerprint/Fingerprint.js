import React, { Component, useEffect, useState, useContext } from 'react';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import { useMutation } from 'react-query';
import Spinner from '../Spinner/Spinner';
import NetworkModal from '../Modal/Network';
import { NetworkContext } from '../../context/NetworkContext';
import { biometricLogin } from '../../services/network';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setCurrentUserUserActionAsync, setLoginActionAsync } from '../../redux/store/user/user.actions';
import { selectCurrentUser } from '../../redux/store/user/user.selector';
import { setAllTicketsActionsAsync } from '../../redux/store/support/support.actions';


const BiometricPopup = ({ visible, setVisible }) => {

    const [msg, setMsg] = useState('')
    const [type, setType] = useState('')
    const [showNetwork, setShowNetwork] = useState(false)
    const user = useSelector(selectCurrentUser)
    const [data, setData] = useState('')
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const {isConnected} = useContext(NetworkContext)

    const { isLoading, mutate } = useMutation(biometricLogin, {
        onSuccess:  async data => {
            console.log(data?.data)
            if(data?.data?.flag == 1){
                const userData = {
                    ...data?.data?.customer,
                    token: data?.data?.token
                }

                console.log(userData)

                await AsyncStorage.setItem('userData', JSON.stringify(userData))
                dispatch(setCurrentUserUserActionAsync())
                dispatch(setLoginActionAsync())
                dispatch(setAllTicketsActionsAsync())
                setVisible(false)
                navigation.navigate("Tabs")
            } else if (data?.data?.flag == 0) {
                setType('invalid')
                setData(data?.data?.message)
                setShowNetwork(true)
            } 
        }
    })


    const loginUser = () => {


        if (isConnected) {
            setType('internet')
            setShowNetwork(true)
            return;
        }

        const payload = {
            email: user?.email_address
        }

        setMsg('Fetching your data, Please wait....')

        mutate(payload)
    }


    const handleBiometric = () => {
        FingerprintScanner
            .authenticate({ title: 'Login to Payrizone' })
            .then(() => {
                loginUser()
                
            }).catch(e => {
                setVisible(false)
                console.log('error', e)
            })
    }
    useEffect(() => {
        if (visible) {
            handleBiometric()
        }
        return () => {
            FingerprintScanner.release();
        }
    }, [visible])
    return (
        <>
            <NetworkModal
                type={type}
                visible={showNetwork}
                data={data}
                setVisible={setShowNetwork}
            />

            {isLoading && (<Spinner
                loading={msg}
            />)}
        </>
    );
}



export default BiometricPopup;