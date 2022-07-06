import React from "react";
import { Easing } from "react-native";
import { createStackNavigator , 
    TransitionPresets, CardStyleInterpolators } from '@react-navigation/stack';
import Dashboard from "../../src/pages/Dashboard/Dashboard";




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

const SecureRoutes = () => {
    const ScreenProps = {
        headerShown: false
    }

    return (
        <>
            <Stack.Screen name="Dashboard" component={Dashboard} />
        </>
    )
}

export default SecureRoutes