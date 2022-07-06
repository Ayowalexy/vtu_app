import React from "react";
import { Box } from "../../components/Flexer/Flexer";
import { IIText } from "../../components/Text/Text";
import { Header } from "../../components/Flexer/Flexer";
import ParentComponent from "../../../navigators";
import { IView } from "../../components/Flexer/Flexer";
import { ScrollView, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons'
import { Colors } from "../../components/utils/colors";


const Transfer = ({navigation}) => {

    const Card = ({data}) => (
        <TouchableOpacity 
            onPress={() => {
                    navigation.navigate(`${data.to}`)
                
            }}
        >
            <Box
                w='100%'
                flexDirection='row'
                h={65}
                backgroundColor={Colors.WHITE}
                justifyContent='space-between'
                paddingLeft={10}
                paddingRight={10}
                marginTop={20}
                r={10}
            >
                <Box
                    flexDirection='row'
                >
                    <Box
                        w={50}
                        h={50}
                        r={40}
                        backgroundColor={Colors.PRIMARY}
                    >
                        <IIText color={Colors.DEFAULT} type='L'>{data?.header}</IIText>
                    </Box>
                    <IIText type='B' paddingLeft={10}> {data?.text}</IIText>
                </Box>
                <Icon name='ios-arrow-forward-sharp' size={20} color={Colors.DEFAULT} />
            </Box>
        </TouchableOpacity>
    )
    return (
        <ParentComponent>
            <Header>Transfer Fund</Header>
            <IView p={20}>
                <ScrollView>
                    <IIText type='L' size={17}>
                        CHOOSE TRANSFER TYPE
                    </IIText>
                    <Card
                        data={{
                            text: 'To Payrizone Account',
                            header: 'PZ',
                            to: 'Transfer Form'
                        }}
                    />
                    <Card
                        data={{
                            text: 'To Other Banks',
                            header: 'OB',
                            to: 'Transfer to Other Banks'
                        }}
                    />
                </ScrollView>
            </IView>
        </ParentComponent>
    )
}

export default Transfer