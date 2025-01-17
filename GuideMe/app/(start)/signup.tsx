import { useState } from "react";
import {
  Text,
  View,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { styles } from "../universalStyles";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { auth, db } from "@/firebase";
import { collection, doc, setDoc } from "firebase/firestore";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = () => {
    // Simple validation
    if (email === "" || password === "" || !email.includes('@')) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Signed up
        const user = userCredential.user;
        const username = user.displayName;
        try {
          const docRef = await setDoc(doc(collection(db, "users"), user.uid), {
            uid: user.uid,
            username: user.email?.split("@")[0],
            accountDate: new Date().getTime(),
            inProgress: [],
            finishedProjects: [],
            contributed: [],
            relevantApps: [],
            score: 0,
          });
          console.log("Document written with ID: ", docRef);
        } catch (e) {
          // console.error("Error adding document: ", e);
        }
        router.replace('/home/dashboard')
      })
      .catch((error) => {
        //Alert.alert("Error", error.message);
        if (error.code === 'auth/invalid-email') {
          Alert.alert('Invalid Email. Please re-enter your email address.')
        }
        else if (error.code === 'auth/email-already-in-use') {
          Alert.alert('Email already in use. Try logging in instead.')
        } else if (error.code === 'auth/weak-password') {
          Alert.alert('Please enter a password that is at least 6 characters long.')
        } else {
          Alert.alert("Error", "Please try again");
        }
      });
  };
  const handleLogin = () => {
    router.push({ pathname: "/login" });
  };

  return (
    <View style={[styles.container, styles.beigeBackground]}>
      {/* Welcome Message */}
      <Text style={styles.titleBlue}>Get Started!</Text>

      {/* Username Label */}
      <Text style={styles.inputLabel}>Email</Text>
      <TextInput
        placeholder="Enter your username"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
      />

      {/* Password Label */}
      <Text style={styles.inputLabel}>Password</Text>
      <TextInput
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      {/* Log In Button */}
      <Pressable style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </Pressable>

      <Text style={[styles.inputLabel, { marginTop: 50 }]}>
        Already have an account?{" "}
      </Text>
      {/* Sign Up Button */}
      <Pressable style={styles.secondaryButton} onPress={handleLogin}>
        <Text style={styles.secondaryButtonText}>Log In</Text>
      </Pressable>
    </View>
  );
}
