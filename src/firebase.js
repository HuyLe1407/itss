import app from 'firebase/compat/';
import "firebase/auth";
import "firebase/firestore";
//firebase config
const firebaseConfig =  {
    apiKey: "AIzaSyAX_YMwlbgI8_6M1NXMCrbFkUVWvLPzLco",
    authDomain: "itss2-3a120.firebaseapp.com",
    projectId: "itss2-3a120",
    storageBucket: "itss2-3a120.appspot.com",
    messagingSenderId: "673700012800",
    appId: "1:673700012800:web:a3a45be32374b21b44c9e5",
    measurementId: "G-W7LNFS6W3H"
};
// Initialize Firebase
app.initializeApp(firebaseConfig);


export const db = app.firestore();
export const auth = app.auth();
export default app;

