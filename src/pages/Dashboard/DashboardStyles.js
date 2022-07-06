
import { StyleSheet, Dimensions } from "react-native"
import { Colors } from "../../components/utils/colors"

const styles = StyleSheet.create({
    container: {
        padding: 15
    },
    box: {
        height: 300,
        backgroundColor: Colors.PRIMARY_FADED,
        width: '100%',
        paddingLeft: 20,
        paddingRight: 20
    },
    box_1: {
        width: '100%',
        height: 145,
        backgroundColor: Colors.DEFAULT,
        borderRadius: 10
    },
    box_3: {
        width: '18%',
        height: 70,
        backgroundColor: Colors.WHITE,
        borderRadius: 10,
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    flex: {
        display: 'flex',
        alignItems: 'flex-end',
        height: 30,
        width: '100%',
        marginRight: 10
    },
    pad: {
        padding: 15,
        backgroundColor: Colors.WHITE
    },
    box_flex: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        padding: 30,
        elevation: 0.4,
        backgroundColor: Colors.WHITE,

    },
    ad: {
        width: '100%',
        height: 200,
        borderRadius: 15,

    },
    wrapper: {
        marginTop: 10,
        height: 450,
        padding: 20,
        marginBottom: 70
    },
    parent_box: {
        width: 100,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30
    },
    text: {

        textAlign: 'center',
        paddingTop: 15,
        color: Colors.PRIMARY_DEEP,
        fontFamily: 'Poppins-Regular'

    }, add_box: {
        elevation: 0.6,
        backgroundColor: Colors.WHITE,
        borderRadius: 15,
        height: 350,
        width: '90%',
        backgroundColor: Colors.DEFAULT

    },
    header: {
        fontFamily: 'Poppins-Medium',
        fontSize: 16,
        padding: 10
    },
    header_sub: {
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
        padding: 10,
        color: Colors.WHITE
    },
    pagination: {
        left: -(Dimensions.get('window').width) + 80
    }
})

export default styles