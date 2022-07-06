import React from 'react';
import { Paystack } from 'react-native-paystack-webview';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import { fundUser } from '../../services/network';
import { selectCurrentUser } from '../../redux/store/user/user.selector';
import { useMutation } from 'react-query';

const PayStack = ({ amount, setAmount, reference, setShowPayStack, setShowSuccess }) => {

  const user = useSelector(selectCurrentUser);

  const { mutate } = useMutation(fundUser, {
    onSuccess: data => {
      console.log(data?.data)
    }
  })

  return (
    <View style={{ flex: 1 }}>
      <Paystack
        refNumber={reference}
        paystackKey="pk_test_28d2e0f6c806854b898be87d1d21f0759aa9520b"
        amount={amount}
        billingEmail={user?.email_address}
        activityIndicatorColor="green"
        onCancel={(e) => {
          // handle response here
        }}
        onSuccess={(res) => {
          console.log(res)
          setShowSuccess(true)
          setAmount('')
          setShowPayStack(false)



          const payload = {
            amount,
            txf: res?.data?.transactionRef?.reference,
            status: res?.data?.transactionRef?.status,
            reason: 'verify',
            channel: 'paystack'

          }

          const usePayload = {
            serverResponse: res,
            ...payload,

          }

            mutate(usePayload)
        }}
        autoStart={true}
      />
    </View>
  );
}

export default PayStack