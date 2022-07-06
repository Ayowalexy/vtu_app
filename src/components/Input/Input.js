import React, { useState } from "react";
import { TextInput, StyleSheet, View, TouchableOpacity } from "react-native";
import IText from "../Text/Text";
import { Colors } from "../utils/colors";
import Icon from 'react-native-vector-icons/Ionicons'
import { IIText } from "../Text/Text";
import { DefaultTheme } from "@react-navigation/native";


const Input = ({ value, type, size, onChange, placeholder, text, p, ...otherProps }) => {
    const [visible, setVisible] = useState(false)
    return (
        <View style={styles.top}>
            <IIText
                type='B'
                marginBottom={10}
            >
                {placeholder}</IIText>

            {
                Boolean(size) && (
                    <IIText type='B' size={16}>
                        {text}
                    </IIText>
                )
            }
            <View>

                <TextInput
                    value={value}
                    onChangeText={onChange}
                    style={styles.text}
                    placeholder={p}
                    placeholderTextColor='rgba(0,0,0,0.3)'
                    {...otherProps}
                    secureTextEntry={visible}

                />
                {
                    type == 'password' && (
                        <TouchableOpacity style={styles.position}
                            onPress={() => setVisible(!visible)}
                        >
                            <Icon name={visible ? 'eye' : 'ios-eye-off'} color={Colors.DEFAULT_FADED} size={25} />
                        </TouchableOpacity>
                    )
                }
                {
                    type == 'money' && (
                        <View style={{
                            position: 'absolute',
                            top: -45
                        }}>
                            <IText>₦</IText>
                        </View>
                    )
                }

            </View>
        </View>
    )
}


export const ITextInput = ({text, value, onChange, p, ...otherProps}) => {
    return (
        <View>
            <View style={{ marginTop: 20 }}>
                <IIText type='B' size={13.5}>
                    {text}
                </IIText>
                <TextInput
                    value={value}
                    onChangeText={onChange}
                    style={[styles.input, {paddingLeft: p ? p : 15}]}  
                    {...otherProps} 
                    
                />
            </View>


        </View>
    )
}



const styles = StyleSheet.create({
    text: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.PRIMARY,
        width: '100%',
        height: 50,
        color: Colors.DEFAULT_FADED,
        marginTop: -8,
        paddingLeft: 15
    },
    top: {
        marginTop: 30
    },
    position: {
        position: 'absolute',
        right: 10,
        top: 10
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: DefaultTheme?.colors?.background,
        paddingLeft: 15,
        borderRadius: 10,
        color: Colors.DEFAULT,
        fontFamily: 'Poppins-Regular',
       
    }
})

export default Input