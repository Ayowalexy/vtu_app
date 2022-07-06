import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Share, TouchableOpacity, ActivityIndicator } from 'react-native'
import Accordion from 'react-native-collapsible/Accordion';
import * as Animatable from 'react-native-animatable';
import { useSelector } from 'react-redux';
import { Colors } from '../../components/utils/colors';
import { IIText } from '../../components/Text/Text';
import { Box } from '../../components/Flexer/Flexer';
import { useNavigation } from '@react-navigation/native';





const FrequentCards = () => {
    const navigation = useNavigation()
    const [activeSections, setActiveSections] = useState([])

    const SECTIONS = [
        {
            title: 'First Bank',
            body: `ACCOUNT NUMBER: 2374848393 ${"\n"}, ACCOUNT NAME: VTU Portal ${"\n"}, BANK NAME: First Bank`,
        }, {
            title: 'Access Bank',
            body: `ACCOUNT NUMBER: 2374848393 ${"\n"}, ACCOUNT NAME: VTU Portal ${"\n"}, BANK NAME: First Bank`,
        },




    ];

    const _renderSectionTitle = (section) => {
        return (
            <View style={styles.content}>
                <Text>{section.title}</Text>
            </View>
        );
    };

    const _renderHeader = (section, index, isActive, sections) => {
        return (
            <Animatable.View
                duration={300}
                transition="backgroundColor"
                style={{
                    width: '100%',

                    backgroundColor:
                        (isActive ? Colors.PRIMARY : Colors.WHITE)
                }}>
                <Box
                    w='100%'
                    h={40}
                    marginTop={10}
                    marginBottom={10}
                    flexDirection='row'
                    justifyContent='space-between'
                    paddingLeft={15}
                    paddingRight={15}
                    borderColor={Colors.DEFAULT}
                    // backgroundColor={ Colors.PRIMARY }
                    // elevation={10}

                    r={10}
                >
                    <IIText type='L'>Airtime</IIText>
                </Box>
            </Animatable.View>
        );
    }

    const _renderContent = (section, i, isActive, sections) => {
        return (
            <>

                <Animatable.View
                    duration={300}
                    transition="backgroundColor"
                    style={[{
                        backgroundColor: (isActive ? Colors.PRIMARY_FADED : Colors.PRIMARY),
                        // padding: 0,

                    }, styles.text]}>
                    <Animatable.View
                        duration={300}
                        easing="ease-out"

                        animation={isActive ? 'zoomIn' : false}>
                        <View style={{
                            display: 'flex',
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            justifyContent: 'space-between',
                            width: '100%'
                        }}>
                            <View
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    flexWrap: 'wrap',
                                    justifyContent: 'flex-start',
                                    alignItems: 'flex-start'
                                }}
                            >
                                {
                                    [
                                        'Airtel Mobile Topup (Prepaid)',
                                        '08145405006',
                                        '100.00'

                                    ].map((element, idx) => (
                                        <View
                                            key={idx}
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}>

                                            <IIText size={idx == 0 ? 13 : 13} type={idx == 0 ? 'L' : 'B'} marginLeft={10}>
                                                {element}
                                            </IIText>
                                        </View>

                                    ))
                                }
                            </View>
                            <TouchableOpacity
                                onPress={() => {
                                    navigation.navigate('Returning Airtime', {
                                        data: {
                                            name:'JOHN',
                                            saved_network: 'MTN',
                                            number: '123456789'
                                        }
                                    })
                                }}
                            >
                                <Box
                                    h={40}
                                    w={90}
                                    r={10}
                                    marginTop={30}
                                    backgroundColor={Colors.PRIMARY}
                                >
                                    <IIText type='B'>PAY NOW</IIText>
                                </Box>
                            </TouchableOpacity>
                        </View>
                    </Animatable.View>

                    <View
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            alignItems: 'flex-end',
                            marginTop: 10,

                        }}
                    >
                        <View />
                        <View
                            style={{
                                flexDirection: 'row',
                                width: 50,
                                justifyContent: 'space-between'
                            }}
                        >

                        </View>
                    </View>


                </Animatable.View>

            </>
        );
    }

    const _updateSections = (activeSections) => {
        setActiveSections(activeSections);
    };


    return (
        <ScrollView style={styles.container}>


            <Accordion
                underlayColor={'#2A286A20'}
                sections={SECTIONS}
                activeSections={activeSections}
                // renderSectionTitle={_renderSectionTitle}
                renderHeader={_renderHeader}
                renderContent={_renderContent}
                onChange={_updateSections}
                sectionContainerStyle={styles.accordionContent}
            />

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 30
    },
    accordionContent: {
        elevation: 0.2,
        marginBottom: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        overflow: 'hidden',
    },
    headerText: {
        padding: 15,
        fontWeight: 'bold', fontSize: 16,
        color: Colors.DEFAULT
    },
    text: {
        padding: 20
    }
})

export default FrequentCards