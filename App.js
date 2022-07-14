import { StatusBar } from 'expo-status-bar';
import {React, useState, useEffect, useRef} from 'react';
import Geocoder from 'react-native-geocoding';
import MapView from'react-native-maps';
import { Marker } from "react-native-maps";
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';

import axios from 'axios';

const baseUrl = 'http://54.183.11.135:3800/';

// import Realm from "realm";

const locations = [];

export default function App() {

  // Geocoder.init("AIzaSyCuOOvaNrtEmSfpBlobkE8NJYK-Z45IKtE")

  // pm2GetProcess?password=b03ddf3ca2e714a6548e7495e2a03f5e824eaac9837cd7f159c67b90fb4b7342



  const tokyoRegion = {
    latitude: 35.6762,
    longitude: 139.6503,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };
  

//   Geocoder.geocodePosition({lat: tokyoRegion.latitude, lng: tokyoRegion.longitude}).then(res => { console.log(res)
//     // res is an Array of geocoding object (see below)
// })
// .catch(err => console.log(err))

 const [lat, setLat] = useState(39.97343096953564)
 const [latD, setLatD] = useState(0.0922)
 
 const [long, setLong] = useState(-75.12520805829233)
 const [longD, setLongD] = useState(0.0421)

 const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [display, setDisplay] = useState("null");
  const mapRef = useRef(null);

  const [places, setPlaces] = useState([])

  let region = {
    "latitude": lat,
    "latitudeDelta": latD,
    "longitude": long,
    "longitudeDelta": longD,
  }

 useEffect(() => {
  (async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
    console.log(location);

    Location.watchPositionAsync({
      enableHighAccuracy:true
          }, location => {
           console.log(location.coords.latitude, 'current location');
           locations.push({lat: location.coords.latitude, long: location.coords.longitude})
           console.log(locations, 'lo')
           setDisplay(`lat: ${location.coords.latitude.toString()}, long: ${location.coords.longitude}`)
          });
    
  })();
}, []);


const goToData = () => {var axios = require('axios');
var data = JSON.stringify({
  "password": "b03ddf3ca2e714a6548e7495e2a03f5e824eaac9837cd7f159c67b90fb4b7342",
  "coords": locations
});

var config = {
  method: 'post',
  url: 'http://54.183.11.135:3800/temp?password=b03ddf3ca2e714a6548e7495e2a03f5e824eaac9837cd7f159c67b90fb4b7342',
  headers: { 
    'Content-Type': 'application/json'
  },
  data : data
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));

  let obj = JSON.stringify(response.data);

  let stripped = JSON.parse(obj);

  console.log(stripped)

  setPlaces(stripped);
  console.log(places, 'place')

  alert(JSON.stringify(stripped).replace('[', '').replace("{", "").replace('}', '').replace(']', ''));
})
.catch(function (error) {
  console.log(error);
});

}


const list = () => {

  console.log(places, 'plazzzzzz')
  return places.map((element) => {
    return (
      <View key={element.id} style={{margin: 10}}>
        <Text>{element.lat}</Text>
        <Text>{element.long}</Text>
      </View>
    );
  });
};

list();


const clearData = () => {var axios = require('axios');


try {
  
  var data = JSON.stringify({
    "password": "b03ddf3ca2e714a6548e7495e2a03f5e824eaac9837cd7f159c67b90fb4b7342",
    "coords": locations
  });
  
  var config = {
    method: 'post',
    url: 'http://54.183.11.135:3800/clear?password=b03ddf3ca2e714a6548e7495e2a03f5e824eaac9837cd7f159c67b90fb4b7342',
    headers: { 
      'Content-Type': 'application/json'
    },
    data : data
  };
  
  axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data));
  
    let obj = JSON.stringify(response.data);
  
    let stripped = JSON.parse(obj);
  
    console.log(stripped)
  
  })
  .catch(function (error) {
    console.log(error);
  });
  


} catch (error) {
  console.log(error)
}



}

 const move = (direction) => {

  switch(direction) {
   
      case 'up' : setLat(prevState => prevState + (prevState*.01)); // alert(lat); //setLatD(prevState => prevState + 1); alert(latD)
      break;
      case 'down' : setLat(prevState => prevState - (prevState*.01)); //alert(lat); //setLatD(prevState => prevState - 1); alert(latD)
      break;
      case 'left' : setLong(prevState => prevState - (Math.abs(prevState)/100)); //alert(long); //setLongD(prevState => prevState + 1); alert(longD)
      break;
      case 'right' : setLong(prevState => prevState + (Math.abs(prevState)/100)); //alert(long); //setLongD(prevState => prevState - 1); alert(longD)
      break;
      case 'minus' : setLongD(prevState=> prevState + (prevState/4)); console.log(longD)//  setLatD(prevState=> prevState - .01); 
      break;
      case 'plus' : setLongD(prevState=> prevState - (prevState/4));  console.log(longD) // setLatD(prevState=> prevState + .01); 
      break;

  }
}

const myApiKey="Key Received from Google map"


const showMyLocation = async () => {

  setLat(location.coords.latitude);
  setLong(location.coords.longitude);

}

const setToPlace = () => {
  setLat(38.897957);
  setLong(-77.036560);
}

const goToTokyo = () => {
  //Animate the user to new region. Complete this animation in 3 seconds
  
  mapRef.current.animateToRegion(tokyoRegion, 3 * 1000);

  setTimeout(function() {setLat(tokyoRegion.latitude)
    setLong(tokyoRegion.longitude)}, 3200)
  
};

  return (
    <View style={styles.container}>
      {/* <Text>Open up App.js to start working on your app!fff</Text>
      <StatusBar style="auto" /> */}
      
      <MapView ref={mapRef} style={{height: '60%', width: '100%'}} 
      showsUserLocation={true}
      region={region}><Marker coordinate={region} /></MapView> 

      <View style={{backgroundColor:'white'}}>{list()}</View>

      <Text style={{color: 'white', fontSize: 16, marginTop: '2%'}}>{display}</Text>

      <Text style={{display: 'none'}} ><Button title={'White House'} onPressIn={()=> {setToPlace()}}> </Button> </Text>

      <View style={[styles.group, styles.top]}><TouchableOpacity
        style={styles.button} onPressIn={()=> {move('up')}}
      >
        <Text style={styles.buttonStyle}>UP</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.button}
        onPressIn={()=> {move('down')}}
      >
        <Text style={styles.buttonStyle}>DOWN</Text>
      </TouchableOpacity></View>
      <View style={styles.group}><TouchableOpacity
        style={styles.button}
        onPressIn={()=> {move('left')}}
      >
        <Text style={styles.buttonStyle}>LEFT</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.button}
        onPressIn={()=> {move('right')}}
      >
        <Text style={styles.buttonStyle}>RIGHT</Text>
      </TouchableOpacity></View><View style={styles.group}><TouchableOpacity
        style={styles.button}
        onPressIn={()=> {move('plus')}}
      >
        <Text style={styles.buttonStyleLarge}>+</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.button}
        onPressIn={()=> {move('minus')}}
      >
        <Text style={styles.buttonStyleLarge}>--</Text>
      </TouchableOpacity></View>

      <TouchableOpacity
        style={styles.button}
        onPressIn={()=> {showMyLocation('minus')}}
      >
        <Text style={styles.buttonStyle}>Where Am I?</Text>
      </TouchableOpacity>

      <View style={styles.group}><TouchableOpacity
        style={styles.button}
        onPressIn={()=> {goToTokyo()}}
      >
        <Text style={styles.buttonStyle}>Tokyo</Text>
      </TouchableOpacity> 

      <TouchableOpacity
        style={styles.button}
        onPressIn={()=> {goToData()}}
      >
        <Text style={styles.buttonStyle}>Data</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPressIn={()=> {clearData()}}
      >
        <Text style={styles.buttonStyle}>ClearData</Text>
      </TouchableOpacity>
      </View>

      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // flexDirection:'row',
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },

  top: {marginTop: '3%'},
  group: {flexDirection: 'row'},

  upDown: {textAlign: 'center', marginTop: '5%', marginLeft: 'auto', marginRight: 'auto', padding: '2%'},
  leftRight: {textAlign: 'center', marginLeft: '35%', marginRight: 'auto'},

  buttonStyle: {marginBottom: '5%', marginTop: '5%', marginRight: '3%',color: 'black',textAlign: 'center', fontSize: 24, borderRadius: 12, padding: 6, backgroundColor:'blueviolet', marginTop: 2},

  
  buttonStyleLarge: {marginBottom: '5%', marginTop: '5%', color: 'black', marginRight: '1%',fontWeight: "800", textAlign: 'center', fontSize: 28, width: 52,borderRadius: 12, padding: 6, backgroundColor:'blueviolet', marginTop: 2}


});