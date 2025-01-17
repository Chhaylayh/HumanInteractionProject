import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "@/firebase";
import { styles } from "../universalStyles";

export default function CreateProject() {
  const [projectName, setProjectName] = useState("");
  const [selectedApp, setSelectedApp] = useState("ChatGPT"); // Default to ChatGPT
  const [loading, setLoading] = useState(false);
  const user = auth.currentUser;

  const handleCreateProject = async () => {
    if (!loading) {
      setLoading(true);
      if (!projectName.trim()) {
        Alert.alert("Error", "Please enter a project name");
        setLoading(false);
        return;
      }
  
      try {
        // Add the project to Firestore
        const docRef = await addDoc(collection(db, "draftProjects"), {
          app: selectedApp,
          author: user?.uid,
          title: projectName,
          date: new Date().getTime(),
          published: false,
          steps: [],
        });
        // Pass projectId and projectName when navigating
        setLoading(false);
        router.push({
          pathname: "/createProjectTwo",
          params: { projectId: docRef.id, projectName , key: ""},
        });
      } catch (error) {
        console.error("Error creating project:", error);
        setLoading(false);
        Alert.alert("Error", "Failed to create project");
      }
    }
    
  };

  return (
    <View style={[localStyles.container, styles.beigeBackground]}>
      <Text style={localStyles.title}>Create a Project</Text>

      <Text style={localStyles.label}>Project Name:</Text>
      <TextInput
        style={[localStyles.input, { backgroundColor: "white" }]}
        placeholder="Write a Short Story with ChatGPT"
        value={projectName}
        onChangeText={setProjectName}
      />

      <Text style={localStyles.label}>Relevant App</Text>
      <View style={localStyles.pickerContainer}>
        <Picker
          selectedValue={selectedApp}
          onValueChange={(itemValue) => setSelectedApp(itemValue)}
          style={localStyles.picker}
          mode="dropdown"
        >
          <Picker.Item label="ChatGPT" value="ChatGPT" />
          <Picker.Item label="VS Code" value="VS Code" />
          <Picker.Item label="Microsoft Excel" value="Microsoft Excel" />
          <Picker.Item label="Discord" value="Discord" />
          <Picker.Item label="Microsoft Teams" value="Microsoft Teams" />
        </Picker>
      </View>
      <Pressable
        style={localStyles.nextButton}
        onPress={() => handleCreateProject()}
      >
        <Text style={localStyles.nextButtonText}>{loading ? "Loading..." : "Next"}</Text>
      </Pressable>
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5dc",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "darkblue",
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5,
    color: "darkblue",
  },
  input: {
    borderWidth: 2,
    borderColor: "#0000b0",
    borderRadius: 5,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 2,
    borderColor: "#0000b0",
    borderRadius: 5,
    marginBottom: 20,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  picker: {
    height: 50,
    width: "100%",
    color: "#000",
  },
  nextButton: {
    backgroundColor: "#000080",
    borderRadius: 5,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 20,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});