import React, { useState, useEffect } from "react";
import { Box } from "../../components/Flexer/Flexer";
import { IView } from "../../components/Flexer/Flexer";
import ParentComponent from "../../../navigators";
import { Header } from "../../components/Flexer/Flexer";
import SwitchToggle from "react-native-switch-toggle";
import { IIText } from "../../components/Text/Text";
import { Colors } from "../../components/utils/colors";
import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { setBiometrics } from "../../redux/store/user/user.actions";
import { setFingerprint } from "../../redux/store/user/user.actions";
import { selectBiometricState, selectFingerprint } from "../../redux/store/user/user.selector";



const Biometrics = ({verified}) => {
    const [on, off] = useState(false)
    const navigation =  useNavigation();
    const dispatch = useDispatch();
    const biometricState = useSelector(selectFingerprint)
    
    useEffect(() => {
        off(biometricState)
    }, [])
   


    return (
        <ParentComponent>
            <IView>
                <IIText type='B'>Enable Finger Print</IIText>
                <Box
                        w='100%'
                        alignItems='flex-end'
                    >

                        <SwitchToggle
                            switchOn={biometricState}
                            onPress={() => {
                                    if(verified){
                                        console.log(biometricState)
                                        dispatch(setFingerprint(!biometricState))
                                        off(!biometricState)
                                    } else {
                                        navigation.navigate('Pin', {
                                            page: 'Update settings'
                                        })
                                    }
                            }}
                            
                            circleColorOff={Colors.PRIMARY}
                            circleColorOn={Colors.PRIMARY}
                            backgroundColorOn={Colors.PRIMARY_FADED}
                            backgroundColorOff='#C4C4C4'
                            containerStyle={style.container_style}
                            circleStyle={style.circleStyle}
                        />
                    </Box>
            </IView>
        </ParentComponent>
    )
}


const style = StyleSheet.create({
    container_style: {
        marginTop: 16,
        width: 70,
        height: 38,
        borderRadius: 25,
        padding: 5,
        borderWidth: 1
    },
    circleStyle: {
        width: 30,
        height: 30,
        borderRadius: 20,
    }
})

export default Biometrics