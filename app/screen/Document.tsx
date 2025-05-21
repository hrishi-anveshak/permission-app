import * as DocumentPicker from "expo-document-picker";
import React, { useState } from "react";
import { Button, Text, View } from "react-native";
export default function Document() {
  const [docData, setDocData] = useState({});
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.canceled) {
        console.log("User canceled document picking");
      } else {
        setDocData(result.assets[0]);
      }
    } catch (err) {
      console.error("Document picking error:", err);
    }
  };
  console.log(docData);
  return (
    <View>
      <Text>Document</Text>
      <Button title="Pick Document" onPress={pickDocument} />
    </View>
  );
}
