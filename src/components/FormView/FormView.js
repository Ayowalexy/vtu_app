import React, { useState, useRef } from "react";
import { ScrollView, View, Text, TouchableOpacity, Dimensions, TextInput, StyleSheet, Image } from "react-native";
import { IIText } from "../../components/Text/Text";
import ParentComponent from "../../../navigators";
import { IView, Box, IFlexer } from "../../components/Flexer/Flexer";
import Icon from 'react-native-vector-icons/Ionicons'
import { Colors } from "../../components/utils/colors";
import { useNavigation } from "@react-navigation/native";




const FormView = ({ showBack, top = false, children }) => {

    const navigation = useNavigation();
    return (
        <ParentComponent>
            <ScrollView>
                <IView p={20}>
                    {
                        showBack && (
                            <>
                                <TouchableOpacity
                                    onPress={() => {
                                        navigation.goBack()
                                    }}
                                >
                                    <Icon name="close" size={30} color={Colors.DEFAULT} />
                                </TouchableOpacity>
                            </>
                        )
                    }

                    <Box marginTop={ top ? 0 : 30 }>
                        <View style={styles.box}>
                            {children}
                        </View>
                    </Box>
                </IView>
            </ScrollView>
        </ParentComponent>
    )
}

const styles = StyleSheet.create({
    box: {
        width: '100%',
        backgroundColor: Colors.WHITE,
        borderRadius: 8,


        elevation: 0.6,
        padding: 20,
        marginTop: 10
    }
})

export default FormView