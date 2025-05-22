import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Pdf from "react-native-pdf";

export default function Document() {
  const [fileData, setFileData] = useState(null);
  const [fileName, setFileName] = useState(null);
  const testImg = /\.(jpeg|jpg|gif|png|webp|bmp|svg)$/i;
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        console.log("User cancelled");
        return;
      }

      const asset = result.assets[0];

      const destPath = `${FileSystem.cacheDirectory}${asset.name}`;
      await FileSystem.copyAsync({
        from: asset.uri,
        to: destPath,
      });

      setFileData(destPath);
      setFileName(asset.name);
    } catch (err) {
      console.error("Document picking error:", err);
    }
  };
  console.log(fileData);
  return (
    <View style={{ flex: 1 }}>
      {fileName && <Text style={styles.head}> {fileName}</Text>}
      {fileData?.endsWith("pdf") ? (
        <Pdf
          source={{ uri: fileData }}
          style={{ flex: 1 }}
          onLoadComplete={(numPages) =>
            console.log(`Loaded PDF with ${numPages} pages`)
          }
          onError={(error) => console.log("PDF error:", error)}
        />
      ) : fileData && testImg.test(fileData) ? (
        <Image
          style={styles.image}
          source={{
            uri: fileData,
          }}
        />
      ) : (
        <Image
          style={styles.image}
          source={require("../../assets/images/unknownfile.png")}
        />
      )}

      <TouchableOpacity style={styles.btn} onPress={pickDocument}>
        <Text style={styles.btnText}>Select file</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 200,
    marginHorizontal: "auto",
    marginTop: 10,
    borderRadius: 10,
  },
  head: {
    textAlign: "center",
    padding: 10,
    fontSize: 16,
    fontWeight: 700,
  },
  btn: {
    justifyContent: "center",
    position: "absolute",
    width: "100%",
    alignContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    bottom: 0,
  },
  btnText: {
    textAlign: "center",
    padding: 10,
    fontSize: 16,
    color: "#fff",
  },
});
