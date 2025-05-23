import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Pdf from "react-native-pdf";
import DocxToString from "../../utils/docx";
interface FileData {
  name?: string;
  uri?: string;
}

export default function Document() {
  const [fileData, setFileData] = useState<FileData[]>([]);
  const testImg = /\.(jpeg|jpg|gif|png|webp|bmp|svg)$/i;
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        multiple: true,
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        console.log("User cancelled");
        return;
      }

      const filesData = [];

      for (const asset of result.assets) {
        const destPath = `${FileSystem.cacheDirectory}${asset.name}`;

        await FileSystem.copyAsync({
          from: asset.uri,
          to: destPath,
        });

        filesData.push({
          name: asset.name,
          uri: destPath,
        });
      }
      setFileData(filesData);
      console.log(fileData);
    } catch (err) {
      console.error("Document picking error:", err);
    } finally {
      DocxToString(fileData[0].uri);
      console.log(fileData[0].uri);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.topHead}>
        {fileData[0] ? "Selected Files" : "Please Select File"}
      </Text>
      <ScrollView>
        <View style={styles.fileSections}>
          {fileData.map((val, index) => {
            return val?.uri?.endsWith("pdf") ? (
              <TouchableOpacity style={styles.pdfView} key={index}>
                <Text style={styles.head} numberOfLines={1}>
                  {val.name}
                </Text>

                <Pdf
                  source={{ uri: val.uri }}
                  style={styles.pdfStyle}
                  singlePage={true}
                  scale={1.7}
                  onLoadComplete={(numPages) =>
                    console.log(`Loaded PDF with ${numPages} pages`)
                  }
                  onError={(error) => console.log("PDF error:", error)}
                />
              </TouchableOpacity>
            ) : testImg.test(val.name) ? (
              <TouchableOpacity style={styles.pdfView} key={index}>
                <Text style={styles.head} numberOfLines={1}>
                  {val.name}
                </Text>

                <Image
                  style={styles.image}
                  source={{
                    uri: val.uri,
                  }}
                />
              </TouchableOpacity>
            ) : (
              !testImg.test(val.name) && (
                <TouchableOpacity style={styles.pdfView} key={index}>
                  <Text style={styles.head} numberOfLines={1}>
                    {val.name}
                  </Text>

                  <Image
                    style={styles.errImage}
                    source={require("../../assets/images/unknownfile.png")}
                  />
                </TouchableOpacity>
              )
            );
          })}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.btn} onPress={pickDocument}>
        <Text style={styles.btnText}>Select file</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  topHead: {
    fontSize: 20,
    fontWeight: 800,
    margin: 10,
  },
  image: {
    height: "85%",
    width: "100%",
    marginHorizontal: "auto",
    borderRadius: 10,
    objectFit: "cover",
  },
  errImage: {
    height: "80%",
    width: "100%",
    margin: "auto",
    borderRadius: 10,
    objectFit: "contain",
  },
  head: {
    textAlign: "center",
    fontSize: 12,
    fontWeight: 700,
    paddingBottom: 10,
    fontFamily: "Poppins-Regular",
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
  pdfStyle: {
    flex: 1,
    backgroundColor: "#DFE3E7",
    borderRadius: 10,
  },
  pdfView: {
    backgroundColor: "#DFE3E7",
    height: 200,
    width: "49%",
    borderRadius: 10,
    paddingTop: 10,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  fileSections: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
    marginBottom: 50,
  },
});
