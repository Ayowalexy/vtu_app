import React, { useState } from 'react';
import { Header } from '../../components/Flexer/Flexer';
import ParentComponent from '../../../navigators';
import { IIText } from '../../components/Text/Text';
import { IView } from '../../components/Flexer/Flexer';
import { Box } from '../../components/Flexer/Flexer';
import { ScrollView } from 'react-native';
import Search from '../../components/Search/Search';
import FrequentCards from './Cards';



const FrequentPayment = () => {
    const [search, setSearch] = useState('')

    return (
        <ParentComponent>
            <Header>Frequent Payment</Header>
            <IView p={20}>
                <Search
                    value={search}
                    onChangeText={setSearch}
                />

                <FrequentCards />
            </IView>
        </ParentComponent>
    )
}

export default FrequentPayment