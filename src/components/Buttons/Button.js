import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { Colors } from '../utils/colors';
import IText from '../Text/Text';
import { useNavigation } from '@react-navigation/native';

const Button = ({navigateTo, outline, children}) => {
    const navigation = useNavigation();

    return (
        <TouchableOpacity 
            onPress={() => {
                navigation.push(navigateTo)
            }}
            activeOpacity={0.8}
            style={[styles.button, outline ? {
                borderWidth: 1,
                borderColor: Colors.PRIMARY
            }: {
                backgroundColor: Colors.PRIMARY,
            }]}
        >
            <IText 
                type='SM' 
                styling={{
                    color: outline ? Colors.PRIMARY : Colors.WHITE,
                    fontSize: 17,
                    color: Colors.DEFAULT
                }}
                colored={false}
            >{children}</IText>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 45,
        marginTop: 20,
        borderRadius: 8
    }
})

export default Button