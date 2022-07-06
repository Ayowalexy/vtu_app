import React from "react";
import { Text, StyleSheet } from 'react-native'
import { Colors } from "../utils/colors";


const IText = ({ type, size, bold, styling, children, colored,  }) => {
    return (
        <Text style={[styles[type], {
            fontSize: size,
            fontFamily: bold ? 'Roboto-Bold' : 'Roboto-Bold',
            color: colored ? Colors.PRIMARY : Colors.DEFAULT, ...styling,

        },]}>
            {children}
        </Text>
    )
}

export const IIText = ({ type, size, top, children, ...otherProps }) => {
    return (
        <Text style={[styles[type], {color: Colors.DEFAULT, marginTop: top, fontSize: size, ...otherProps}]}>
            {children}
        </Text>
    )
}

const styles = StyleSheet.create({
    SM: {
        fontSize: 17,
        fontFamily: 'Poppins-Bold',
        letterSpacing: 1,
        lineHeight: 30,

        color: Colors.DEFAULT
    },
    SSM: {
        fontSize: 13,
        paddingTop: 10,
        fontFamily: 'Poppins-Bold',
        letterSpacing: 1,

        color: Colors.DEFAULT
    },
    error: {
        fontSize: 13,
        paddingTop: 10,
        fontFamily: 'Poppins-Bold',
        letterSpacing: 1,
        color: 'red'
    },
    L: {
        fontFamily: 'Poppins-Bold',
        color: Colors.DEFAULT
    },
    B: {
        fontFamily: 'Poppins-Regular',
        color: Colors.DEFAULT
    },
    XL: {

    },
    SM_C: {
        fontSize: 17,
        fontFamily: 'Poppins-Thin',
        letterSpacing: 1,
        lineHeight: 30,
        
        color: Colors.PRIMARY
    },
    SM_D: {

    },
    L_D: {

    },
    XL_C: {

    }

})

export default IText