import React from "react";
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native'
import { IIText } from "../../components/Text/Text";
import { Header, IView } from "../../components/Flexer/Flexer";
import WalletTabs from "./WalletTabs";
import ParentComponent from "../../../navigators";


const Wallet = () => {
    return (
        <ScrollView>
            <ParentComponent>
                <ScrollView collapsable={false} style={{ flex: 1 }}>
                    <Header>Fund your account</Header>
                    <View style={styles.view}>
                        <WalletTabs />
                    </View>
                </ScrollView>
            </ParentComponent>
        </ScrollView>

    )
}

const styles = StyleSheet.create({
    view: {
        height: Dimensions.get('window').height,
        padding: 20
    }
})

export default Wallet