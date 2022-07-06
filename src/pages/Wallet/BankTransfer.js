import React from "react";
import { IIText } from "../../components/Text/Text";
import FLexer, { IView, Box, IFlexer } from "../../components/Flexer/Flexer";
import Icon from 'react-native-vector-icons/FontAwesome'
import { Colors } from "../../components/utils/colors";
import { View, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { selectSystemBanks } from "../../redux/store/user/user.selector";
import ShareBank from "./Share";
import { Button } from "../../components/Flexer/Flexer";
import { useNavigation } from "@react-navigation/native";


const BankTransfer = () => {
    const banks = useSelector(selectSystemBanks)
    const navigation = useNavigation();
    return (
        <IView top={40}>
            <IIText size={14} type='B'>
                To add money into your Payrizone wallet, transfer to
                any of these account Numbers
            </IIText>


            {
                banks?.map((element, idx) => (
                    <View key={idx} style={style.view}>
                        <FLexer justifyContent="flex-start">
                            <Box
                                h={60}
                                w={60}
                                r={10}
                                backgroundColor={Colors.PRIMARY_FADED}
                            >
                                <Icon name="bank" size={20} color={Colors.DEFAULT} />
                            </Box>

                            <Box
                                alignItems='flex-start'
                                justifyContent='flex-start'
                                marginLeft={10}
                            >
                                <IIText type='L'>{element?.bank}</IIText>
                                <IIText size={12} type='B'>{element?.account_name}/{element?.account_number}</IIText>
                            </Box>
                        </FLexer>

                        <View style={style.box}>
                            <Box
                                h={40}
                                w={40}
                                r={20}
                                backgroundColor={Colors.PRIMARY_FADED}
                            >
                                <ShareBank data={`${element?.account_name} \n${element?.account_number} \n${element?.bank}`} />
                            </Box>
                        </View>
                    </View>
                ))
            }
            {/*  */}
            <Button onPress={() => navigation.navigate('Verify Form')}>
                Verify
            </Button>
        </IView>
    )
}


const style = StyleSheet.create({
    box: {
        position: 'absolute',
        right: 0
    },
    view: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        flexDirection: 'row',
        marginTop: 20
    }
})

export default BankTransfer