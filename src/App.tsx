import React, { useState } from "react";
import {
  Alert,
  Image,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  launchCamera,
  Asset,
  ImagePickerResponse,
  launchImageLibrary,
} from "react-native-image-picker";
import { check, PERMISSIONS, request, RESULTS } from "react-native-permissions";
import { PESDK } from "react-native-photoeditorsdk";

function App(): React.JSX.Element {
  const [image, setImage] = useState<any>("");
  const requestPermissions = async () => {
    try {
      const result = await request(
        Platform.OS === "ios"
          ? PERMISSIONS.IOS.CAMERA
          : PERMISSIONS.ANDROID.CAMERA
      );

      if (result === "granted") {
        const options: any = {
          mediaType: "photo",
          includeBase64: false,
          maxHeight: 2000,
          maxWidth: 2000,
        };

        setTimeout(() => {
          launchCamera(options, (response: ImagePickerResponse) => {
            if (response.didCancel) {
              console.log("User cancelled camera");
            } else if (response.errorMessage) {
              console.log("Camera Error: ", response.errorMessage);
            } else if (response.assets && response.assets.length > 0) {
              const asset: Asset = response.assets[0];
              openPhotoFromLocalPathExample(asset.uri ? asset.uri : "");
            }
          });
        }, 500);
      } else {
        Alert.alert(
          "Camera Permission",
          "Camera Permission needed.",
          [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            {
              text: "OK",
              onPress: () => console.log("OK Pressed"),
            },
          ],
          { cancelable: false }
        );
      }
    } catch (error) {
      console.error("Permission Request Error:", error);
    }
  };
  const requestGalleryPermission = async () => {
    console.log("requestin permissions");
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        openGallery();
      } else {
        console.log("not granted");
        Alert.alert(
          "Camera Permission",
          "Camera Permission needed.",
          [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            {
              text: "OK",
              onPress: () => console.log("OK Pressed"),
            },
          ],
          { cancelable: false }
        );
      }
    } else {
      check(PERMISSIONS.IOS.PHOTO_LIBRARY)
        .then((result) => {
          console.warn("result is", result);
          switch (result) {
            case RESULTS.UNAVAILABLE:
              Alert.alert(
                "Camera Permission",
                "Camera Permission needed.",
                [
                  {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                  },
                  {
                    text: "OK",
                    onPress: () => console.log("OK Pressed"),
                  },
                ],
                { cancelable: false }
              );
              // setPermissionType('gallery');
              // setImagePermissionVisible(true);
              break;
            case RESULTS.DENIED:
              request(PERMISSIONS.IOS.PHOTO_LIBRARY).then((result) => {
                switch (result) {
                  case RESULTS.GRANTED:
                    openGallery();
                    break;
                  case RESULTS.DENIED:
                    Alert.alert(
                      "Camera Permission",
                      "Camera Permission needed.",
                      [
                        {
                          text: "Cancel",
                          onPress: () => console.log("Cancel Pressed"),
                          style: "cancel",
                        },
                        {
                          text: "OK",
                          onPress: () => console.log("OK Pressed"),
                        },
                      ],
                      { cancelable: false }
                    );
                    // setPermissionType('gallery');
                    // setImagePermissionVisible(true);
                    break;
                  case RESULTS.BLOCKED:
                    Alert.alert(
                      "Camera Permission",
                      "Camera Permission needed.",
                      [
                        {
                          text: "Cancel",
                          onPress: () => console.log("Cancel Pressed"),
                          style: "cancel",
                        },
                        {
                          text: "OK",
                          onPress: () => console.log("OK Pressed"),
                        },
                      ],
                      { cancelable: false }
                    );
                    // setPermissionType('gallery');
                    // setImagePermissionVisible(true);
                    break;
                  default:
                    openGallery();
                }
              });
              break;
            case RESULTS.GRANTED:
              openGallery();
              break;
            case RESULTS.BLOCKED:
              Alert.alert(
                "Camera Permission",
                "Camera Permission needed.",
                [
                  {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                  },
                  {
                    text: "OK",
                    onPress: () => console.log("OK Pressed"),
                  },
                ],
                { cancelable: false }
              );
              // setPermissionType('gallery');
              // setImagePermissionVisible(true);
              break;
            default:
              openGallery();
          }
        })
        .catch((error) => {});
    }
  };
  const openGallery = () => {
    const options: any = {
      mediaType: "photo",
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.errorMessage) {
        console.log("Image picker error: ", response?.errorMessage);
      } else {
        console.log("img resp", response.assets);
        let imageUri = response.assets?.[0]?.uri;
        openPhotoFromLocalPathExample(imageUri ? imageUri : "");
      }
    });
  };

  const openPhotoFromLocalPathExample = async (url: string): Promise<void> => {
    try {
      // Add a photo from the assets directory.

      // Open the photo editor and handle the export as well as any occuring errors.
      const result = await PESDK.openEditor(url);

      if (result != null) {
        // The user exported a new photo successfully and the newly generated photo is located at `result.image`.
        console.log("result image", result.image);
        setImage(result.image);
      } else {
        // The user tapped on the cancel button within the editor.
        return;
      }
    } catch (error) {
      // There was an error generating the photo.
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={{ uri: image }} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={requestPermissions}>
          <Text>Open camera</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={requestGalleryPermission}
        >
          <Text>Open Gallery</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    alignItems: "center",
  },
  image: {
    height: 150,
    width: 150,
    backgroundColor: "white",
    marginTop: 50,
    marginBottom: 100,
  },
  buttonContainer: {
    flexDirection: "row",
  },
  button: {
    backgroundColor: "grey",
    height: 50,
    width: 100,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
  },
});

export default App;
