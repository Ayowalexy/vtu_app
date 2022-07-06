import React from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native'


const Touch = ({children}) => {
    return (
        <TouchableOpacity style={styles.container}>
            {children}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default Touch