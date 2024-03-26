// Import the functions you need from the SDKs you need
import { getApps, initializeApp, type FirebaseApp, getApp } from "firebase/app";
// Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC_AOiqOwwzTQe-5vMkcNhGwKj6gRNrmHs",
  authDomain: "soen-341-7abfe.firebaseapp.com",
  projectId: "soen-341-7abfe",
  storageBucket: "gs://soen-341-7abfe.appspot.com",
  messagingSenderId: "402041511910",
  appId: "1:402041511910:web:dfc83ae20b776650b94027",
  measurementId: "G-CF1B5VEEGX",
};

export async function getFirebaseApp(): Promise<FirebaseApp> {
  const apps = getApps();
  if (!apps.length) {
    // Initialize Firebase app if there are no apps
    return initializeApp(firebaseConfig);
  } else {
    // Otherwise, return the first app
    return getApp();
  }
}
