import React, { useState } from "react";
import { Box, IFlexer, IIcon } from "../../components/Flexer/Flexer";
import { ScrollView, View, StyleSheet, TouchableOpacity, Modal } from "react-native";
import IText, { IIText } from "../../components/Text/Text";
import { Colors } from "../../components/utils/colors";
import Search from "../../components/Search/Search";
import { Header } from "../../components/Flexer/Flexer";
import { useNavigation } from "@react-navigation/native";



const ElectricityModal = ({visible, setVisible, setProvider, providers}) => {
    const navigation = useNavigation();
    const [search, setSearch] = useState('')
    const [data, setData] = useState(['BEDC', 'AECD Power company', 'Startimes Payments'])

    return (
        <Modal
            visible={visible}
            onRequestClose={() => setVisible(!visible)}
            animationType='slide'
            transparent={false}
        >
            <Box
                w='100%'
                h={50}
            >
                <Header>Select Provider</Header>
            </Box>

            <ScrollView style={styles.container}>
                <Search
                    value={search}
                    onChangeText={setSearch}
                    placeHolder='Search'

                />

                <IText
                    size={17}
                    styling={styles.text}>Billers</IText>

                {
                    
                    providers?.map((element, idx) => (
                            <TouchableOpacity
                                key={idx}
                                onPress={() => {
                                    setProvider(element)
                                    setVisible(false)
                                }}
                            >
                                <Box
                                    h={60}
                                    w='100%'
                                    borderBottomWidth={1}
                                >
                                    <IFlexer w='100%'>
                                        <IIText type='B' >{element?.name}</IIText>
                                        <IIcon
                                            name='md-chevron-forward'
                                            size={20}
                                            color={Colors.SEARCH}
                                        />
                                    </IFlexer>
                                </Box>

                            </TouchableOpacity>

                        ))
                }
            </ScrollView>

        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20
    },
    text: { paddingTop: 20, borderBottomWidth: 1, paddingBottom: 20 }
})

export default ElectricityModal
