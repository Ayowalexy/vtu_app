import React from 'react';
import { Share, View, Button, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import { Colors } from '../../components/utils/colors';

const ShareBank = ({data}) => {
    const onShare = async () => {
        try {
            const result = await Share.share({
                message:
                    data,
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                } else {
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            alert(error.message);
        }
    };
    return (
        <TouchableOpacity onPress={onShare}>
            <Icon name='share-alt' size={20} color={Colors.DEFAULT} />
        </TouchableOpacity>
    );
};

export default ShareBank;