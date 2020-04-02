import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyDu8HwJDhbLdoirtdD170By73XL1mGEiAs",
    authDomain: "datn-house-helper-app-web.firebaseapp.com",
    databaseURL: "https://datn-house-helper-app-web.firebaseio.com/",
    storageBucket: "datn-house-helper-app-web.appspot.com"
};
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
export {
    storage
}