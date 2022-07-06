import React, { useState, useEffect, useContext } from 'react';
import { NetworkContext } from '../../context/NetworkContext';
import { View, Text, StyleSheet, ScrollView, Share, TouchableOpacity, ActivityIndicator } from 'react-native'
import Accordion from 'react-native-collapsible/Accordion';
import * as Animatable from 'react-native-animatable';
import { useSelector } from 'react-redux';
import { Colors } from '../../components/utils/colors';
import { IIText } from '../../components/Text/Text';
import { Box } from '../../components/Flexer/Flexer';
import { useNavigation } from '@react-navigation/native';
import { Header } from '../../components/Flexer/Flexer';
import { IView } from '../../components/Flexer/Flexer';
import NetworkModal from '../../components/Modal/Network';
import Spinner from '../../components/Spinner/Spinner';
import { getAllFAQsAndFetchOne } from '../../services/network';
import { useMutation } from 'react-query';
import { useRoute } from '@react-navigation/native';





const SupportDetails = () => {
    const navigation = useNavigation()
    const [activeSections, setActiveSections] = useState([])
    const { isConnected } = useContext(NetworkContext)
    const [type, setType] = useState('')
    const [visible, setVisible] = useState(false);
    const [msg, setMsg] = useState('')
    const route = useRoute();
    const [sections, setSections] = useState([])

    const { isLoading, mutate } = useMutation(getAllFAQsAndFetchOne, {
        onSuccess: data => {
            console.log(data?.data)
            if (data.status == 200) {
                setSections(data?.data)
            } else {
                setVisible(true)
            }
        }
    })

    const SECTIONS = [
        {
            title: 'Q: How to fund my account?',
            body: `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.`,
        }, {
            title: 'Q: Why is my account constantly debited?',
            body: `Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old`,
        },
    ];


    const handleFetch = () => {
        if (isConnected) {
            setType('internet')
            setVisible(true)
            return;
        }

        setMsg('Fetching question, Please wait....')

        const payload = {
            type: 'children',
            subject_id: route?.params?.ticket_id
        }
        mutate(payload)
    }

    console.log()

    useEffect(() => {
        handleFetch()
    }, [])


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
                    <IIText type='L'>
                        {'Q: '.concat(section?.sub_question)}
                    </IIText>
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
                            <IIText type='B'>
                                {'Answer:\n\n'.concat(section?.sub_answer)}
                            </IIText>

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
        <ScrollView>

            
                <Header>Support Details</Header>
                <IView p={10} top={30}>
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


                </IView>
                <View>
                    <IIText paddingTop={60} type='B' textAlign='center'>Not satisfied with these answers? {"\n"} Kindly contact support</IIText>
                </View>
                <NetworkModal
                    type={type}
                    visible={visible}
                    setVisible={setVisible}
                />
                {isLoading && (<Spinner
                    loading={msg}
                />)}

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20
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

export default SupportDetails