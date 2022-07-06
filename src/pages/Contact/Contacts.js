import React, { useState, useEffect } from "react";
import { FlatList, PermissionsAndroid, View, TouchableOpacity, Text } from "react-native";
import Contacts from 'react-native-contacts'
import { IIText } from "../../components/Text/Text";
import Search from "../../components/Search/Search";
import FLexer, { IView, Box, IFlexer } from "../../components/Flexer/Flexer";
import { Colors } from "../../components/utils/colors";
import GoBack from "../../components/GoBack/GoBack";
import { Header } from "../../components/Flexer/Flexer";



const Contact = ({route, navigation}) => {
  const [contacts, setContacts] = useState([]);
  const [allContacts, setAllContacts] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    (async () => {
      const res = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          'title': 'Contacts',
          'message': 'This app would like to view your contacts.',
          'buttonPositive': 'Please accept bare mortal'
        }
      )
      if (res === 'granted') {
        const contacts = await Contacts.getAll();
        const filter = contacts.filter(contact => contact.phoneNumbers.length > 0).sort((a, b) => a.displayName.localeCompare(b.displayName))
        setContacts(filter)
        setAllContacts(filter)

      }

    })()

  }, [])




  const searchHandler = () => {
    const filter = contacts.filter(element => element.displayName.includes(searchText))

    if (filter.length > 1 && searchText) {
      console.log("if", filter.length)
      setContacts(filter)
    } else {
      console.log('else', filter.length)
      setContacts(allContacts)
    }
  }

  const renderItem = ({ item }) => {

    const red = Math.floor(Math.random() * 100)
    const blue = Math.floor(Math.random() * 100)
    const green = Math.floor(Math.random() * 100)


    let displayName = item.displayName.split(' ')
    displayName = displayName.length > 1 ? displayName[0].charAt(0).concat(displayName[1].charAt(0)) : displayName[0].charAt(0)
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate(route?.params?.page, {
            number: item.phoneNumbers[0].number.split(' ').join('')
          })
        }}
        style={{
          display: 'flex',
          flexDirection: 'row',
          padding: 10,
          height: 70,
          marginTop: 10,

        }}>
        <View style={{
          width: 40,
          height: 40,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 50,
          backgroundColor: `rgba(${red}, ${green}, ${blue}, 1)`
        }}>
          <Text style={{
            color: '#fff',
            textTransform: 'uppercase'
          }}>
            {displayName}
          </Text>
        </View>
        <View style={{
          paddingHorizontal: 20
        }}>
          <Text style={{
            color: '#000',
            fontSize: 16
          }}>{item.displayName}</Text>
          <Text style={{
            color: 'rgba(0,0,0,0.6)'
          }}>{item.phoneNumbers[0].number}</Text>
        </View>

      </TouchableOpacity>
    )
  }

  return (
    <View >
      <Header>Contact</Header>
      <IView p={20}>
       
          <Search
            value={search}
            onChangeText={setSearch}
          />

        <FlatList
          data={contacts?.filter(element => element.displayName.toLowerCase().includes(search.toLowerCase()))}
          renderItem={renderItem}
          keyExtractor={({ item, idx }) => idx}
        />
      </IView>
    </View>
  )
}

export default Contact