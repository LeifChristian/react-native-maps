import * as firebase from 'firebase';
const firebaseConfig = {
apiKey: "AIzaSyDS1AMxubrYwf8pO9jNfz4cT8FXk5cR3Cw",
authDomain: "pocketdesk-48f79.firebaseio.com",
databaseURL: "https://pocketdesk-48f79.firebaseio.com/",
storageBucket: "pocketdesk-48f79.appspot.com",
messagingSenderId: "150506226864",
}
firebase.initializeApp(firebaseConfig);
export default firebase;