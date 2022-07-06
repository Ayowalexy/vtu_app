import React from "react";
import Icon from 'react-native-vector-icons/Fontisto'
import { TouchableOpacity, StyleSheet } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "../utils/colors";
import FLexer from "../Flexer/Flexer";



const GoBack = ({ to, color, ...otherProps }) => {
    const navigation = useNavigation();
    return (
        <TouchableOpacity
            style={{...otherProps}}
            onPress={() => {
                navigation.goBack()
            }}
        >
            <Icon name='arrow-left-l' size={30} color={color ? color : Colors.PRIMARY} />

        </TouchableOpacity>
    )
}


export default GoBack