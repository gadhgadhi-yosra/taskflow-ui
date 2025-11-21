// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
apiKey: "AIzaSyC0VH_Nh0cLBa1kwCt6xWG2WjLO7ol4TsY",
authDomain: "task-flow-backend-73120.firebaseapp.com",
projectId: "task-flow-backend-73120",
storageBucket: "task-flow-backend-73120.firebasestorage.app",
messagingSenderId: "478949014084",
appId: "1:478949014084:web:542b335d6a18b164a71a11",
measurementId: "G-VZEW0VT69Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);