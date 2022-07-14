/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,Image,
  TextInput,
  Button,TouchableOpacity,ScrollView,
} from 'react-native';

export default class sucess extends Component {

  render() {

    return (

      <View style={styles.container}>
        <View style={styles.smilyicon}> 
           <Image style={styles.bigicon}
                         source={require('../assets/img/smily.png')}/>
        </View>

        <View style={styles.messagebox}>
            <Text style={styles.jumboTxt}> Success! </Text>
             <Text style={styles.smallTxt}> Your Network has been</Text>
             <Text style={styles.smallTxt}>  successfully created. </Text>
        </View>

        <View style={styles.groupinvite}> 
            <Text style={styles.linktitle}> Share group invite link </Text> 
            <View style={styles.inlineblock}> 
             <TextInput style={styles.input} placeholder="e.g. European Vacation "  placeholderTextColor="#cdcdcd" />
              <Image style={styles.shareicon}
                  source={require('../assets/img/share.png')}/>
            </View>
        </View>

         
       <View style={styles.footer}>
              <TouchableOpacity style={styles} onPress={() => this.props.navigation.navigate("Home")}>
               <Text style={styles.footjumbotxt}> Launch My Network</Text> 
              </TouchableOpacity>
              
       </View>

      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {flex:1,backgroundColor: '#2980b9',paddingTop:0,},

   smilyicon:{ justifyContent:'center', alignItems:'center'},

   bigicon:{ width:150, height:150, margin:30,}, 

   messagebox:{ backgroundColor:'#378dc5', padding:30,  
   justifyContent:'center', alignItems:'center', marginBottom:30,},

   jumboTxt:{ fontSize:40, color:'#fff', fontWeight:'700'},

   smallTxt:{ color:'#fff', fontSize:20, width:290, textAlign: 'center'},
   groupinvite:{ padding:15,},

   linktitle:{ fontSize:18, color:'#fff', fontWeight:'700', marginBottom:15,},

   input:{ width:280,backgroundColor:'#5297c5', borderRadius:4, padding:15,},

   shareicon:{ margin:15, },
   
   inlineblock:{ flexDirection:'row'},
   
   /*  Footer CSS*/
footer: {
    height:55,
    color: "#333",
    padding:10,
    flexDirection: "row",
    backgroundColor: "#145d8d",
    justifyContent: "center",
    alignItems: "center",
    marginLeft:10,
    marginRight:10,
    marginBottom:10,
  },


    footjumbotxt:{ color:'#fff', fontSize:18, fontWeight:'700' },

});



