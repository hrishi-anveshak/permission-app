import React from "react";
import { StyleSheet, Text, View } from "react-native";
interface Contact {
  name?: string;
  phoneNumbers?: { number: string }[];
  emails?: { email: string }[];
}
export default function Contact_Cards({ data }: { data: Contact }) {
  return (
    <View style={styles.cards}>
      <Text style={styles.text} numberOfLines={1}>
        {data?.name}
      </Text>
      <Text>{data?.phoneNumbers?.[0]?.number}</Text>
      <Text>{data?.emails?.[0]?.email}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "#000",
    fontSize: 18,
  },
  cards: {
    margin: 5,
    width: "90%",
  },
});
