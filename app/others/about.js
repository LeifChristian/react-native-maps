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

export default class Calendar extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerleft} onPress={() => this.props.navigation.navigate("DrawerOpen")}>
            <Image style={styles.baricon} source={require("../assets/img/bar_icon.png")} />
          </TouchableOpacity>
          <View style={styles.headercenter}>
            <Text style={styles.header_title}> About </Text>
          </View>

          <View style={styles.headerright}>
           
          </View>
        </View>

        <ScrollView style={styles.about_wrapper}> 
           <Text style={styles.about_data}> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum </Text>
        </ScrollView>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#2980b9", paddingTop: 0 },

  header: { height: 55, color: "#333", padding: 10, flexDirection: "row" },

  headerleft: { width: 20 },

  headercenter: { width: 295 },

  headerright: { width: 20 },

  backicon: { width: 15, height: 25, marginTop: 5 },

  baricon: { width: 20, height: 20, marginTop: 5 },

  header_title: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700"
  },

  about_wrapper:{ backgroundColor:'#fff', padding:15,},
  about_data:{ color:'#333' },
});
