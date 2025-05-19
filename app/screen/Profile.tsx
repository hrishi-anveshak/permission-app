import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import opencage from "opencage-api-client";

import React, { useRef, useState } from "react";
import {
  Alert,
  Button,
  Image,
  Modal,
  PermissionsAndroid,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
export default function Profile() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [modalVisible, setModalVisible] = useState(false);
  const [cameraMode, setCameraMode] = useState(false);
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [locationStats, setLocationStats] = useState({});

  const cameraRef = useRef(null);
  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Give Camera Permission</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission to access camera roll is required!");
      return;
    }

    // Launch the image picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    console.log(result);

    if (!result.canceled) {
      setImage(result?.assets[0].uri);
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setImage(photo.uri);
      setCameraMode(!cameraMode);
    }
    console.log(image);
  };
  // location

  const getCurrentLocation = async () => {
    await Location.requestForegroundPermissionsAsync();

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
  };

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("microphone permission granted");
      } else {
        console.log("microphone permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const getLocationStats = () => {
    opencage
      .geocode({
        q: `${location?.coords.latitude},${location?.coords.longitude}`,
        language: "fr",
        key: "8de5ee0eeec440fb9b995ded282ee1dc",
      })
      .then((data) => {
        console.log(data.results);
        if (data.status.code == 200 && data.results.length > 0) {
          setLocationStats(data.results[0].components);
          console.log(data.results.components);
        }
      });
  };
  return (
    <View style={styles.container}>
      <Button
        title="Location"
        onPress={() => {
          getCurrentLocation();
          requestCameraPermission();
          getLocationStats();
        }}
      />
      <Text style={styles.editText}>{locationStats?.country}</Text>
      <Text style={styles.editText}>{locationStats?.state}</Text>
      <View style={styles.avatar}>
        {image && !cameraMode && (
          <Image source={{ uri: image }} style={styles.image} />
        )}
        <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
          <View style={styles.edit}>
            <Text style={styles.editText}>Edit </Text>
            <Icon name="edit" size={22} style={{ marginTop: 3 }} />
          </View>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View
          style={styles.modalBg}
          onTouchEnd={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.modalView}>
            <Button
              title="Camera"
              onPress={() => {
                setCameraMode(!cameraMode);
                setModalVisible(!modalVisible);
              }}
            />
            <Button title="Pick an image from gallery" onPress={pickImage} />
          </View>
        </View>
      </Modal>

      {cameraMode && (
        <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={toggleCameraFacing}
            >
              <Text style={styles.text}>Flip Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={takePicture}>
              <Text style={styles.text}>Take Picture</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  modalView: {
    width: "100%",
    height: 200,
    position: "absolute",
    bottom: 0,
    zIndex: 10,
    backgroundColor: "#000",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  modalBg: {
    height: "100%",
    width: "100%",
    zIndex: -10,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginHorizontal: "auto",
  },
  avatar: {
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    gap: 20,
  },
  editText: {
    fontSize: 22,
    fontWeight: 500,
  },
  edit: {
    flexDirection: "row",
  },
});
