import React from "react";
import { Image, StyleSheet } from 'react-native';
import { APP_LOGO } from "../utils/Assets";


const Logo = () => {
    return <Image source={APP_LOGO} style={{ width: 80, height: 80, borderRadius: 20}} />
}

export default Logo