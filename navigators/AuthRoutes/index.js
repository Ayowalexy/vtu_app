import React from "react";
import { Easing } from "react-native";
import { createStackNavigator , 
    TransitionPresets, CardStyleInterpolators } from '@react-navigation/stack';
import OnBoarding from "../../src/pages/Auth/OnBoarding";
import Login from "../../src/pages/Auth/Login";


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

const AuthRoutes = () => {
    const ScreenProps = {
        headerShown: false
    }

    return (
        <>
            <Stack.Screen name="OnBoarding" component={OnBoarding} />
            <Stack.Screen name='Login' component={Login} />
        </>
    )
}

export default AuthRoutes