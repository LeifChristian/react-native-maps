import { StatusBar } from 'expo-status-bar';
import {React, useState} from 'react';
import MapView from'react-native-maps';
import { StyleSheet, Text, View, Button } from 'react-native';

let variable = 31.97343096953564;

const move = (direction) => {

  switch(direction) {

      case 'up' : alert('up')
      break;
      case 'down' : alert('down')
      break;
      case 'left' : alert('left')
      break;
      case 'right' : alert('right')
      break;

  }
}

export default function App() {

 const [lat, setLat] = useState(39.97343096953564)
 
 const [long, setLong] = useState(-75.12520805829233)
  return (
    <View style={styles.container}>
      {/* <Text>Open up App.js to start working on your app!fff</Text>
      <StatusBar style="auto" /> */}
      
      <MapView style={{height: '50%', width: '100%'}} 
                initialRegion={{
                    "latitude": 39.97343096953564, //lat,
                    "latitudeDelta": 0.0922,
                    "longitude": -75.12520805829233, //long,
                    "longitudeDelta": 0.0421,
                }} /> 


           <Text style={styles.upDown}><Button title={'up'} onPress={()=> {move('up')}}></Button> 
               <Button title={'down'} onPress={()=> {move('down')}}></Button> </Text>

               
                <Text style = {styles.leftRight}>  <Button title={'left'} onPress={()=> {move('left')}}></Button> 
               <Button title={'right'} onPress={()=> {move('right')}}></Button></Text>

              
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  upDown: {textAlign: 'center'},
  leftRight: {textAlign: 'center'}

});