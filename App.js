import React, { useEffect } from "react";
import { Easing } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import AuthRoutes from "./navigators/AuthRoutes";


import { NetworkProvider } from "./src/context/NetworkContext";
import { QueryClientProvider, QueryClient } from "react-query";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { store, persistor } from "./src/redux/store";
import SplashScreen from 'react-native-splash-screen'




import Login from "./src/pages/Auth/Login";
import OnBoarding from "./src/pages/Auth/OnBoarding";
import Dashboard from "./src/pages/Dashboard/Dashboard";
import AirtimeOrData from "./src/pages/AirtimeOrData/AirtimeOrData";
import Cables from "./src/pages/AirtimeOrData/Cables";
import CablesPayment from "./src/pages/AirtimeOrData/CablePayment";
import Airtime from "./src/pages/AirtimeOrData/Airtime";
import Contact from "./src/pages/Contact/Contacts";
import Settings from "./src/pages/Settings/Settngs";
import SignUp from "./src/pages/Auth/Signup";
import EmailVerify from "./src/pages/Auth/EmailVerify";
import Pin from "./src/pages/Auth/Pin";
import Electricity from "./src/pages/AirtimeOrData/Electricity";
import ElectricityPayment from "./src/pages/AirtimeOrData/ElectricityPayment";
import PhoneForm from "./src/pages/SavedCards/PhoneForm";
import CableForm from "./src/pages/SavedCards/CableForm";
import ElectricityForm from "./src/pages/SavedCards/ElectricityForm";
import ReturningAirtime from "./src/pages/Returning/ReturningAirtime";
import VoucherForm from "./src/pages/SavedCards/VoucherForm";
import UpdateSettings from "./src/pages/Settings/Forms";
import TransactionHistory from "./src/pages/Settings/TransactionHistory";
import TransactionDetails from "./src/pages/Settings/TransactionDetails";
import FrequentPayment from "./src/pages/Dashboard/FrequentPayment";
import SupportDetails from "./src/pages/Settings/SupportDetails";
import MyTickets from "./src/pages/Settings/Tickets";
import TicketTabs from "./src/pages/Settings/TicketTab";
import Chat from "./src/pages/Settings/Chat";
import ContactSupport from "./src/pages/Settings/ContactSupport";
import Data from "./src/pages/AirtimeOrData/Data";
import VerifyForm from "./src/pages/Wallet/VerifyForm";
import Transfer from "./src/pages/Transfer/Transer";
import TransferForm from "./src/pages/Transfer/Transfer-form";
import Notfications from "./src/pages/Notifications/Notification";
import TransferToOtherBanks from "./src/pages/Transfer/BankTransfer";
import BankForm from "./src/pages/SavedCards/BankForm";
import ReturningTransfer from "./src/pages/Transfer/ReturningUser";
import NotificationDetails from "./src/pages/Notifications/NotificationDetails";
import AccountStatement from "./src/pages/Account-Statement/Account_Statement";
import AppUpdate from "./src/pages/AppUpdate/AppUpdate";
import BuyVoucher from "./src/pages/Voucher/Voucher";
import Internet from "./src/pages/Dashboard/Internet";
import ForgotPassword from "./src/pages/Auth/ForgetPassword";
import VoucherProfile from "./src/pages/Voucher/VoucherProfile";
import BuyFrom from "./src/pages/Voucher/BuyFrom";


import Tabs from "./navigators/Tabs";
import {
  createStackNavigator,
  TransitionPresets, CardStyleInterpolators
} from '@react-navigation/stack';


const config = {
  animation: 'spring',
  config: {
    stiffness: 1000,
    damping: 50,
    mass: 3,
    overshootClamping: false,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01
  }
}

const closeConfig = {
  animation: 'timing',
  duration: 500,
  easing: Easing.linear
}



const Stack = createStackNavigator();

const queryClient = new QueryClient()


const App = () => {

  useEffect(() => {
    SplashScreen.hide();
  }, [])
  return (
    <NetworkProvider>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <NavigationContainer>
              <Stack.Navigator screenOptions={{
                headerShown: false,
                getstureEnabled: true,
                gestureDirection: "horizontal",
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
                // transitionSpec: {
                //   open: config,
                //   close: closeConfig
                // }
              }}>

                <Stack.Group>
                  <Stack.Screen name="OnBoarding" component={OnBoarding} />
                  <Stack.Screen name='Login' component={Login} />
                  <Stack.Screen name='Sign Up' component={SignUp} />
                  <Stack.Screen name='Forgot Password' component={ForgotPassword} />
                </Stack.Group>
                <Stack.Group>
                  <Stack.Screen name='Email Verify' component={EmailVerify} />
                  <Stack.Screen name='Pin' component={Pin} />
                </Stack.Group>
                <Stack.Group>
                  <Stack.Group>
                    <Stack.Screen name='Tabs' component={Tabs} />
                    <Stack.Screen name="Dashboard" component={Dashboard} />
                    <Stack.Screen name='Contact' component={Contact} />
                    <Stack.Screen name='Settings' component={Settings} />
                    <Stack.Screen name='Transfer' component={Transfer} />
                    <Stack.Screen name='Transfer to Other Banks' component={TransferToOtherBanks} />
                    <Stack.Screen name='Notifications' component={Notfications} />
                    <Stack.Screen name='Notification Details' component={NotificationDetails} />
                    <Stack.Screen name='Account Statement' component={AccountStatement} />
                    <Stack.Screen name='Internet' component={Internet} />
                  </Stack.Group>
                  <Stack.Group>
                    <Stack.Screen name='Airtime' component={Airtime} />
                    <Stack.Screen name="Airtime Or Data" component={AirtimeOrData} />
                    <Stack.Screen name='Cables' component={Cables} />
                    <Stack.Screen name='Cables Payment' component={CablesPayment} />
                    <Stack.Screen name='Electricity' component={Electricity} />
                    <Stack.Screen name='Electricity Payment' component={ElectricityPayment} />
                    <Stack.Screen name='Data' component={Data} />
                  </Stack.Group>
                  <Stack.Group>
                    <Stack.Screen name='Phone Form' component={PhoneForm} />
                    <Stack.Screen name='Verify Form' component={VerifyForm} />
                    <Stack.Screen name='Cable Form' component={CableForm} />
                    <Stack.Screen name='Bank Form' component={BankForm} />
                    <Stack.Screen name='Electricity Form' component={ElectricityForm} />
                    <Stack.Screen name='Voucher Form' component={VoucherForm} />
                    <Stack.Screen name='Transfer Form' component={TransferForm} />
                  </Stack.Group>
                  <Stack.Group>
                    <Stack.Screen name="Support Details" component={SupportDetails} />
                    <Stack.Screen name='My Tickets' component={MyTickets} />
                    <Stack.Screen name='Ticket Tabs' component={TicketTabs} />
                  </Stack.Group>
                  <Stack.Group>
                    <Stack.Screen name="Update settings" component={UpdateSettings} />
                    <Stack.Screen name='Transaction History' component={TransactionHistory} />
                    <Stack.Screen name='Transaction Details' component={TransactionDetails} />
                    <Stack.Screen name='Frequent Payment' component={FrequentPayment} />
                  </Stack.Group>
                  <Stack.Group>
                    <Stack.Screen name='Chat Support' component={Chat} />
                    <Stack.Screen name='Contact Support' component={ContactSupport} />
                  </Stack.Group>
                </Stack.Group>
                <Stack.Group>
                  <Stack.Screen name='Returning Airtime' component={ReturningAirtime} />
                  <Stack.Screen name='Returning Transfer' component={ReturningTransfer} />
                </Stack.Group>
                <Stack.Group>
                  <Stack.Screen name='App Update' component={AppUpdate} />
                </Stack.Group>
                <Stack.Group>
                  <Stack.Screen name='Buy Voucher' component={BuyVoucher} />
                  <Stack.Screen name='Voucher Profile' component={VoucherProfile} />
                  <Stack.Screen name='Buy From' component={BuyFrom} />
                </Stack.Group>
              </Stack.Navigator>
            </NavigationContainer>
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </NetworkProvider>
  )
}

export default App
