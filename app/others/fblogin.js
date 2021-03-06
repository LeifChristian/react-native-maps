import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
  ScrollView
} from "react-native";

const FBSDK = require("react-native-fbsdk");
const { LoginButton,AccessToken } = FBSDK;


export default class Login extends React.Component
{
  render()
  {
    return (
      <View>
        <LoginButton
          publishPermissions={["publish_actions"]}
          onLoginFinished={(error, result) => {
            if (error) {
              alert("Login failed with error: " + result.error);
            } else if (result.isCancelled) {
              alert("Login was cancelled");
            } else {
              alert(
                "Login was successful with permissions: " +
                  result.grantedPermissions
              );
            }
          }}
          onLogoutFinished={() => alert("User logged out")}
        />
      </View>
    );

  }
}

