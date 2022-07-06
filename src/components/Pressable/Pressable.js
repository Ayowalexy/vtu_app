import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import IText from "../Text/Text";
import { Colors } from "../utils/colors";



const IPressable = ({type, to, children}) => {
    const navigation = useNavigation();
    return (
        <Pressable
            onPress={() => {
                navigation.navigate(to)
            }}
        >
            <IText size={18} styling={styles.pad}>{children}</IText>
        </Pressable>
    )
}


const styles = StyleSheet.create({
    pad: {
        paddingTop: 10, 
        paddingLeft: 10,
        color: Colors.PRIMARY
    }
})


export default IPressable