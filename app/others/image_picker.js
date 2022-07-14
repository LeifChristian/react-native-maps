import React from "react";

import {
  AppRegistry,
  StyleSheet,
  Text,
  Button,
  View,
  PixelRatio,
  TouchableOpacity,
  Image
} from "react-native";

import ImagePicker from "react-native-image-picker";

export default class Imagepicker extends React.Component {
  state = {
    response: null,

    avatarSource: null,

    videoSource: null
  };

  selectPhotoTapped() {
    const options = {
      quality: 1.0,

      maxWidth: 500,

      maxHeight: 500,

      storageOptions: {
        skipBackup: true
      }
    };

    ImagePicker.showImagePicker(options, response => {
    //  console.log("Response = ", response);

      if (response.didCancel) {
     //   console.log("User cancelled photo picker");
      } else if (response.error) {
     //   console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
     //   console.log("User tapped custom button: ", response.customButton);
      } else {
        let source = { uri: response.uri };

        // You can also display the image using data:

        // let source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          avatarSource: source,

          response: response
        });
      }
    });
  }

  selectVideoTapped() {
    const options = {
      title: "Video Picker",

      takePhotoButtonTitle: "Take Video...",

      mediaType: "video",

      videoQuality: "medium"
    };

    ImagePicker.showImagePicker(options, response => {
     // console.log("Response = ", response);

      if (response.didCancel) {
      //  console.log("User cancelled video picker");
      } else if (response.error) {
      //  console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
      //  console.log("User tapped custom button: ", response.customButton);
      } else {
        this.setState({
          videoSource: response.uri
        });
      }
    });
  }

  uploadImage() {
    var PicturePath = this.state.response.uri;

    var fileName = this.state.response.fileName;

    var fileType = this.state.response.type;

  //  console.log("Path : " + PicturePath);

    if (PicturePath) {
      // Create the form data object

      var data = new FormData();

      data.append("userPhoto", {
        uri: PicturePath,
        name: fileName,
        type: fileType
      });

      //data.append('userPhoto',PicturePath);

      // Create the config object for the POST

      // You typically have an OAuth2 token that you use for authentication

      const config = {
        method: "POST",

        header: {
          "content-type": "multipart/form-data"
        },

        body: data
      };

    //  console.log(data);

      fetch(
        "http://pocketdesk.expertteam.in:8080/api/network/userPhoto",
        config
      )
        .then(responseData => {
          // Log the response form the server

          // Here we get what we sent to Postman back

       //   console.log(responseData);

        //  console.log(responseData.body);
        })
        .catch(err => {
       //   console.log(err);
        });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
          <View
            style={[
              styles.avatar,
              styles.avatarContainer,
              { marginBottom: 20 }
            ]}
          >
            {this.state.avatarSource === null ? (
              <Text>Select a Photo</Text>
            ) : (
              <Image style={styles.avatar} source={this.state.avatarSource} />
            )}
          </View>
        </TouchableOpacity>

        <Button title="Upload" onPress={() => this.uploadImage()} />

        <TouchableOpacity onPress={this.selectVideoTapped.bind(this)}>
          <View style={[styles.avatar, styles.avatarContainer]}>
            <Text>Select a Video</Text>
          </View>
        </TouchableOpacity>

        {this.state.videoSource && (
          <Text style={{ margin: 8, textAlign: "center" }}>
            {this.state.videoSource}
          </Text>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    justifyContent: "center",

    alignItems: "center",

    backgroundColor: "#F5FCFF"
  },

  avatarContainer: {
    borderColor: "#9B9B9B",

    borderWidth: 1 / PixelRatio.get(),

    justifyContent: "center",

    alignItems: "center"
  },

  avatar: {
    borderRadius: 75,

    width: 150,

    height: 150
  }
});
