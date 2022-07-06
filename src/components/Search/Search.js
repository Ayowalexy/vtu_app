import React from "react";
import { TextInput, StyleSheet, View } from "react-native";
import { Colors } from "../utils/colors";
import Icon from 'react-native-vector-icons/Ionicons'


const Search = ({ value, onChangeText, color, top, placeHolder, ...otherProps }) => {
    return (
       <View>
         <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholderTextColor={Colors.DEFAULT}
            style={[styles.box, {
                    backgroundColor: color ? color : Colors.WHITE,
                    elevation: color ? null : 1,
                    marginTop: top
                }]}
            {...otherProps}
            // placeholder={placeHolder}

        />
        <View style={{
            position: 'absolute',
            right: 10,
            top: 15

        }}>
            <Icon name='search' size={20} color={Colors.DEFAULT} />
        </View>
       </View>
    )
}

const styles = StyleSheet.create({
    box: {
        width: '100%',
        borderRadius: 10,
        // backgroundColor: Colors.SEARCH,
        height: 50,
        paddingLeft: 10,
    }
})

export default Search