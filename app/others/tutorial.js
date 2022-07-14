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
import AppIntroSlider from 'react-native-app-intro-slider';

const styles_new = StyleSheet.create({
  image: {
    width:'100%',
    height:'100%',
  }
});

const slides = [
  {
    key: 'somethun',
    title: '',
    text: '',
    image: require('../assets/img/tutorial_01.png'),
    imageStyle: {
    width:'100%',
    height:'100%',
    bottom:10
  },
    backgroundColor: '#2980b9',
  },
   {
    key: 'somethun1',
    title: '',
    text: '',
    image: require('../assets/img/tutorial_02.png'),
     imageStyle: styles_new.image,
    backgroundColor: '#2980b9',
  },
   {
    key: 'somethun2',
    title: '',
    text: '',
    image: require('../assets/img/tutorial_03.png'),
     imageStyle: styles_new.image,
    backgroundColor: '#2980b9',
  },
   {
    key: 'somethun3',
    title: '',
    text: '',
    image: require('../assets/img/tutorial_04.png'),
     imageStyle: styles_new.image,
    backgroundColor: '#2980b9',
  }
 
];
export default class Tutorial extends Component {

   constructor(props) {
    super(props);
  
  }

   _onDone = () => {
   //this.props.navigation.navigate("Home");
   this.props.navigation.goBack();
  }
  _onSkip = () => {
   //this.props.navigation.navigate("Home");
   this.props.navigation.goBack();
  }
  render() {
     return (
         <AppIntroSlider
       slides={slides}
       showSkipButton
        onSlideChange={(a, b) => console.log(`Active slide changed from ${b} to ${a}`)}
        // bottomButton
         onSkip={this._onSkip}
          onDone={this._onDone}
        />
     
    );

  }
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#2980b9", paddingTop: 0 },

});
