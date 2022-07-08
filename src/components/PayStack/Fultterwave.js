import React, { useEffect } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../redux/store/user/user.selector';
import { PayWithFlutterwave } from 'flutterwave-react-native';
import { Button } from '../Flexer/Flexer';
import { selectSystemRates } from '../../redux/store/user/user.selector';

const Flutterwave = ({ amount, reference, setAmount, setShowPayment, setShowSuccess, setPaymentChannel }) => {

    const user = useSelector(selectCurrentUser)
    const rates = useSelector(selectSystemRates)


    useEffect(() => {

    }, [])
    return (
        <PayWithFlutterwave
            onRedirect={(data) => {
                console.log(data)
                setPaymentChannel('')
                // setShowSuccess(true)
                setAmount('')
                setShowPayment(false)
      
            }}
            options={{
                tx_ref: reference,
                authorization: rates?.service_fee?.flutterwave,
                customer: {
                    email: user?.email_address
                },
                amount: amount ,
                currency: 'NGN',
                payment_options: 'card',
                
            }}

            customButton={(props) => <Button onPress={props.onPress}>Confirm</Button>}
        />
    )
}

export default Flutterwave