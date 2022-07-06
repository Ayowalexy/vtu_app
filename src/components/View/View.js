import React, { Children } from "react";
import { View, StyleSheet} from 'react-native';


const IView = ({type, size, children}) => {
    return (
        <View style={[styles[type], styles[size]]}>
            {children}
        </View>
    )
}

const styles = StyleSheet.create({
    flex: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',

    },
    L: {
        width: '100%',
        height: 45
    },
    SM: {
        width: '50%'
    }
})

export default IView