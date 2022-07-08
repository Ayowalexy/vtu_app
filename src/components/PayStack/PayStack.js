import React from 'react';
import { Paystack } from 'react-native-paystack-webview';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import { fundUser } from '../../services/network';
import { selectCurrentUser, selectSystemRates } from '../../redux/store/user/user.selector';
import { useMutation } from 'react-query';

const PayStack = ({ amount, setAmount, reference, setShowPayStack, setShowSuccess }) => {

  const user = useSelector(selectCurrentUser);
  const rates = useSelector(selectSystemRates)

  const { mutate } = useMutation(fundUser, {
    onSuccess: data => {
      console.log(data?.data)
    }
  })

  return (
    <View style={{ flex: 1 }}>
      <Paystack
        refNumber={reference}
        paystackKey={rates?.service_fee?.paystack}
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