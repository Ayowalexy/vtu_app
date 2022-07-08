import React from "react";
import { Header } from "../../components/Flexer/Flexer";
import ParentComponent from "../../../navigators";
import { IIText } from "../../components/Text/Text";
import { IView } from "../../components/Flexer/Flexer";


const Internet = () => {
    return (
        <ParentComponent>
            <Header>Internet</Header>

            <IView
                p={30}
            >
                <IIText textAlign='center' type='B'>Coming soon</IIText>
            </IView>
        </ParentComponent>
    )
}

export default Internet