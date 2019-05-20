import * as firebase from "firebase";

export function getFirebaseConfig () {
    return {
        apiKey: "AIzaSyAjQAoc785iVH4wrK2EuAkoQ42JI1482hE",
        authDomain: "auction-dapp.firebaseapp.com",
        databaseURL: "https://auction-dapp.firebaseio.com",
        projectId: "auction-dapp",
        storageBucket: "auction-dapp.appspot.com",
        messagingSenderId: "869897458910",
        appId: "1:869897458910:web:d3f4713c909dbdc0"
        };
}

export const firebaseApp = firebase.initializeApp(getFirebaseConfig());