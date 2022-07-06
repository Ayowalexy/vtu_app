import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Dimensions, ScrollView, StyleSheet } from 'react-native';
import FLexer, { IFlexer, IIFlexer } from "../../components/Flexer/Flexer";
import IText, { IIText } from "../../components/Text/Text";
import { Colors } from "../../components/utils/colors";
import GoBack from "../../components/GoBack/GoBack";
import AirtimeAndBillsTab from "./Tabs";
import { Box } from "../../components/Flexer/Flexer";
import Icon from 'react-native-vector-icons/Ionicons'
import ParentComponent from "../../../navigators";
import { Header } from "../../components/Flexer/Flexer";
import { useMutation } from "react-query";
import { getAllPhoneBooks } from "../../services/network";
import Spinner from "../../components/Spinner/Spinner";



const AirtimeOrData = () => {
  

    return (
        <View>
            <Header>Airtime & Bill</Header>

            <ParentComponent>
                <Box
                    w='100%'
                    borderBottomWidth={1}
                    marginTop={10}
                    h={Dimensions.get('screen').height}
                >

                    <AirtimeAndBillsTab
                        
                    />
                </Box>
            </ParentComponent>

        </View>

    )
}

const styles = StyleSheet.create({
    text: {
        fontFamily: 'Poppins-Regular',
        color: Colors.WHITE
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
    }
})

export default AirtimeOrData