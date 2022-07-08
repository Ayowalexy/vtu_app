import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Share, TouchableOpacity, ActivityIndicator } from 'react-native'
import Accordion from 'react-native-collapsible/Accordion';
import * as Animatable from 'react-native-animatable';
import { useSelector } from 'react-redux';
import { Colors } from '../../components/utils/colors';
import { IIText } from '../../components/Text/Text';
import { Box } from '../../components/Flexer/Flexer';





const VoucherCards = ({ data }) => {
    const [activeSections, setActiveSections] = useState([])
    const [sections, setSections] = useState([])

    const SECTIONS = [
        {
            title: 'First Bank',
            body: `ACCOUNT NUMBER: 2374848393 ${"\n"}, ACCOUNT NAME: VTU Portal ${"\n"}, BANK NAME: First Bank`,
        }, {
            title: 'Access Bank',
            body: `ACCOUNT NUMBER: 2374848393 ${"\n"}, ACCOUNT NAME: VTU Portal ${"\n"}, BANK NAME: First Bank`,
        },




    ];


    useEffect(() => {

        let shape = [];
        let arr = [data]
        if (arr?.length) {
            for (let e of arr) {
                shape.push({
                    title: e?.pin,
                    body: JSON.stringify({
                        "Amount": e?.amount,
                        "Status": e?.status == 1 ? 'Used' : 'Not Used',
                        ['Used By']: e?.used_by,
                        'Serial Number': e?.serial_number,
                        'Date': e?.date_used
                    })
                })
            }
            setSections(shape)
        }
    }, [])

    console.log("sections", sections)

    const _renderSectionTitle = (section) => {
        return (
            <View style={styles.content}>
                <Text>{section.title}</Text>
            </View>
        );
    };

    const _renderHeader = (section, index, isActive, sections) => {

        const useData = JSON.parse(section?.body)
        console.log(useData)

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
                    h={60}
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

                    <Box
                        flexDirection='row'
                        width='100%'
                        justifyContent='space-between'
                    >
                        <Box
                            flexDirection='column'
                            justifyContent='flex-start'
                            alignItems='flex-start'
                        >
                            <IIText type='L'>
                                PIN: <IIText type='B'>{section?.title}</IIText>
                            </IIText>






                        </Box>
                        <Box
                            flexDirection='column'
                            justifyContent='flex-start'
                            alignItems='flex-end'
                        >




                            <IIText
                                type='B'
                                size={13}
                            >

                                ₦{useData?.Amount}
                            </IIText>

                        </Box>
                    </Box>

                </Box>


            </Animatable.View>
        );
    }

    const _renderContent = (section, i, isActive, sections) => {
        const useData = JSON.parse(section?.body)

        return (
            <>

                <Animatable.View
                    duration={300}
                    transition="backgroundColor"
                    style={[{
                        backgroundColor: (isActive ? Colors.PRIMARY_FADED : Colors.PRIMARY),
                        padding: 20,

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
                            <Box
                                flexDirection='row'
                                width='100%'
                                justifyContent='space-between'
                            >
                                <Box
                                    flexDirection='column'
                                    justifyContent='flex-start'
                                    alignItems='flex-start'
                                >
                                    <IIText type='L'>
                                        PIN: <IIText type='B'>{section?.title}</IIText>
                                    </IIText>

                                    <IIText size={13} type='L' >
                                        Serial Number: <IIText type='B'>{useData?.['Serial Number']}</IIText>
                                    </IIText>

                                    <IIText size={13} type='L' >
                                        Used By: <IIText type='B'>{useData?.['Used By']}</IIText>
                                    </IIText>
                                    <IIText size={13} type='L' >
                                        Date: <IIText type='B'>{useData?.Date?.split(' ')[0]}</IIText>
                                    </IIText>


                                </Box>
                                <Box
                                    flexDirection='column'
                                    justifyContent='flex-start'
                                    alignItems='flex-end'
                                >


                                    <IIText size={13} type='L' >
                                        Status: <IIText type='B'>{useData?.Status}</IIText>
                                    </IIText>
                                    <IIText size={13} type='L' >
                                        Date: <IIText type='B'>{useData?.Date?.split(' ')[0]}</IIText>
                                    </IIText>
                                    <IIText
                                        type='L'
                                        size={13}
                                    >

                                        Amount: <IIText type='B'>₦{useData?.Amount}</IIText>
                                    </IIText>

                                </Box>
                            </Box>
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
                sections={sections}
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

export default VoucherCards