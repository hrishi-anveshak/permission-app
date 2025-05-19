import * as Contacts from "expo-contacts";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Contact_Cards from "../components/Contact_Cards";
export default function Contact() {
  const [contacts, setContacts] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    (async () => {
      setLoading(true);
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.Emails, Contacts.Fields.PhoneNumbers],
        });

        if (data.length > 0) {
          setContacts(data);
        }
        setLoading(false);
      } else {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.head}>Contacts</Text>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : contacts?.length > 0 ? (
        <FlatList
          data={contacts}
          renderItem={({ item }) => <Contact_Cards data={item} />}
          keyExtractor={(item) => item?.id}
        />
      ) : (
        <Text style={styles.text}>
          Please grant contact access permission to use this feature.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    marginHorizontal: 10,
  },
  text: {
    color: "#000",
    fontSize: 18,
  },
  head: {
    fontSize: 25,
    fontWeight: 800,
  },
});
