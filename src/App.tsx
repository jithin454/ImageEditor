import React from "react";

import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { PESDK } from "react-native-photoeditorsdk";

function App(): React.JSX.Element {
  const openCamera = async (): Promise<void> => {
    try {
      // Add a photo from the assets directory.
      const photo = require("./resource/images/sample.jpg");

      // Open the photo editor and handle the export as well as any occuring errors.
      const result = await PESDK.openEditor(photo);

      if (result != null) {
        // The user exported a new photo successfully and the newly generated photo is located at `result.image`.
        console.log(result.image);
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
      <SafeAreaView>
        <TouchableOpacity style={styles.button} onPress={() => openCamera()}>
          <Text>Open camera</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "grey",
    padding: 20,
    borderRadius: 5,
  },
});

export default App;
