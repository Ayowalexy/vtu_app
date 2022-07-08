import React from "react";
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import GoBack from "../GoBack/GoBack";
import { Colors } from "../utils/colors";
import IText, { IIText } from "../Text/Text";



const FLexer = ({ w, h, children, ...otherProps }) => {
    return (
        <View style={[styles.container, { ...otherProps }]}>
            <View style={[styles.inner, { width: w }]}>{children}</View>
        </View>
    )
}

export const IView = ({ p, top, children, ...otherProps }) => {
    return (
        <View style={{ padding: p, paddingTop: top, ...otherProps }}>
            {children}
        </View>
    )
}


export const IIcon = ({ name, size, color }) => {
    return <Icon name={name} size={size} color={color} />
}


export const IIFlexer = ({ w, h, children, ...otherProps }) => {
    return (
        <View style={[styles.container, { ...otherProps }]}>
            {children}
        </View>
    )
}

export const IFlexer = ({ w, children, ...otherProps }) => {
    return (
        <View style={[styles.iFlexer, { ...otherProps, width: w }]}>
            {children}
        </View>
    )
}

export const Header = ({ children }) => {
    return (
        <View
            style={styles.flexer}
        >
            <View style={{
                position: 'absolute',
                left: 10
            }}>
                <GoBack
                    color={Colors.DEFAULT}

                />
            </View>
            <IText size={17} styling={styles.text}>{children}</IText>
        </View>

    )
}

export const Box = ({ w, h, f, r, children, ...otherProps }) => {
    const flex = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
    return (
        <View style={[{
            width: w,
            height: h,
            borderRadius: r,

            ...flex,
            ...otherProps,
        },


        ]}>
            {children}
        </View>
    )
}



export const Button = ({children, disabled = false, onPress, outline = false}) => {
    return (
        <TouchableOpacity disabled={disabled} onPress={onPress} >
            <Box
                w='100%'
                h={50}
                backgroundColor={outline ? Colors.WHITE : Colors.PRIMARY}
                borderColor={outline ? Colors.PRIMARY : null}
                borderWidth={outline ? 1 : 0}
                r={10}
                marginTop={30}
                opacity={disabled ? 0.3 : 1}
            >
                <IIText size={16} type='B' color={Colors.DEFAULT}>
                    {children}
                </IIText>
            </Box>
        </TouchableOpacity>
    )
}



const styles = StyleSheet.create({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        marginTop: 20,
        flexDirection: 'row',
        width: '100%',

    },
    inner: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
    iFlexer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        width: '100%',

    },
    box: {

    },
    flexer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        flexDirection: 'row',
        width: '100%',
        height: 60,
        backgroundColor: Colors.PRIMARY
    },
    text: {
        fontFamily: 'Poppins-Regular',
        color: Colors.DEFAULT
    }
})

export default FLexer