import app from 'firebase/compat/';
import "firebase/auth";
import "firebase/firestore";
//firebase config
const firebaseConfig =  {
    apiKey: "AIzaSyDPyHzyIbJPjAJWCWi4muH_0DBKuxU_wBw",
    authDomain: "itss-e82ad.firebaseapp.com",
    projectId: "itss-e82ad",
    storageBucket: "itss-e82ad.appspot.com",
    messagingSenderId: "540205170113",
    appId: "1:540205170113:web:5b692e6b0c6ec686304340",
    measurementId: "G-MFMJQ02RSC"
};
// Initialize Firebase
app.initializeApp(firebaseConfig);


export const db = app.firestore();
export const auth = app.auth();
export default app;

