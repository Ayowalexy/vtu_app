import React, { Component } from 'react';

import {
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Box } from '../Flexer/Flexer';
import { IIText } from '../Text/Text';
import { Colors } from '../utils/colors';

import RNHTMLtoPDF from 'react-native-html-to-pdf';

const PDF = ({data}) => {
    const createPDF = async () => {
        let options = {
            html: `
            <div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
            <div style="width: 100%; box-shadow:5px 5px 5px rgba(0, 0, 0, 0.4); border-radius: 10px; ">
                <h1 style="font-weight: bold; padding-bottom: 10px; border-bottom-color: 1px;">Transaction Details</h1>
                <div >
                    <p>Date: ${data?.date} </p>
                </div>
                <div>
                    <p>Time: ${data?.time}</p>
                </div>
                <div>
                    <p>Reference: ${data?.reference}</p>
                </div>
                <div>
                    <p>Amount: ${data?.amount}</p>
                </div>
                <div>
                    <p>Amount: ${data?.status}</p>
                </div>
               
            </div>
            
            <div style="width: 100%; box-shadow:5px 5px 5px rgba(0, 0, 0, 0.4); border-radius: 10px; ">
                <h1 style="font-weight: bold;  padding-bottom: 10px; border-bottom-color: 1px;">Account Details</h1>
                <div>
                    <p>Account Name: ${data?.name}</p>
                </div>
                <div>
                    <p>Account Number: ${data?.account_number}</p>
                </div>
                <div>
                    <p>Channel: ${data?.channel}</p>
                </div>
               
            </div>
        </div>
            `,
            fileName: data?.reference,
            directory: 'Downloads',
            // font: ['android/app/src/main/assets/fonts/Popppins-Bold.tff', 'android/app/src/main/assets/fonts/Popppins-Regular.tff']
        };

        try {
            let file = await RNHTMLtoPDF.convert(options)
            alert(file.filePath);
        } catch (e) {
            console.log(e)
        }
    }
    return (

        <TouchableOpacity style={{
            width: '48%',
            height: 40,
            marginBottom: 30
        }} onPress={createPDF}>
            <Box
                w='100%'
                h={40}
                r={20}
                backgroundColor={Colors.PRIMARY}

            >
                <IIText type='L' color={Colors.DEFAULT}>Download</IIText>
            </Box>
        </TouchableOpacity>

    )
}

export default PDF