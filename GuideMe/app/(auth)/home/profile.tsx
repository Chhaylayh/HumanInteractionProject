import { Pressable, Text, View, FlatList, Image, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { styles } from "../../universalStyles";
import { auth, db } from "@/firebase";
import { useEffect, useState } from "react";
import { collection, doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { User } from "@/dbMocks/user";

interface ItemProps {
  title: string;
  image: string;
  background: string;
}

{/* array that contains all suggested app info */}
const DATA = [
  { id: '1', title: 'ChatGPT', background: 'lightgreen', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/2048px-ChatGPT_logo.svg.png' },
  { id: '2', title: 'VS Code', background: 'lightblue', image: 'https://tidalcycles.org/assets/images/vscodeicon-42dc264fde2adb74cc197fe6d02b183c.png' },
  { id: '3', title: 'Microsoft Excel', background: 'green', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Microsoft_Office_Excel_%282019%E2%80%93present%29.svg/826px-Microsoft_Office_Excel_%282019%E2%80%93present%29.svg.png' },
  { id: '4', title: 'Discord', background: 'darkblue', image: 'https://static.vecteezy.com/system/resources/previews/023/741/066/non_2x/discord-logo-icon-social-media-icon-free-png.png' },
  { id: '5', title: 'Miscrosoft Teams', background: '#B19CD9', image: 'https://www.thomas-krenn.com/redx/tools/mb_image.php/ct.ZHmFQ/cid.y04aedfd415189e63/Microsoft_Teams.png' },
];

{/* item display */}
const Item: React.FC<ItemProps> = ({ title, image, background }) => (
  <View style={[styles.item, { width: 150, marginRight: 20, backgroundColor: background, borderRadius: 10 }]} >
    <Pressable
      onPress={() => {
        router.push({pathname:"/home/project/browseProjects", params: {app: title}});
      }}
    >
      <Image
        source={{ uri: image }}
        style={{ width: 100, height: 100, marginBottom: 10 }}
        resizeMode="cover"
      />
      {/* <Text style={[styles.itemText, { alignSelf: "center"}]}>{title}</Text> */}
    </Pressable>
  </View>
);

export default function Profile() {
  const user = auth.currentUser;
  const name = user?.email?.split("@")[0];
  const [userData, setUserData] = useState<User>();

  useEffect(() => {
    if (user?.uid) {
      const docRef = doc(collection(db, "users"), user?.uid);
      getDoc(docRef).then((uDoc) => {
        if (uDoc.exists()) {
          setUserData(uDoc.data() as User)
        }
      });
    }
  }, [user]);

  return ( userData &&
    <View style={[styles.container, { paddingHorizontal: 20 }]}>
      <Text style={[styles.titleBlue, { alignSelf: "center"}]}>{name}</Text>
      {userData.accountDate && <Text style={[styles.itemText]}>Member since {new Date(userData.accountDate).toLocaleString()}</Text>}
      {userData.accountDate && <Text style={[styles.itemText]}>{userData.score} Points</Text>}
      {userData.accountDate && <Text style={[styles.itemText]}>{userData.finishedProjects.length} Finished Projects</Text>}
      {userData.accountDate && <Text style={[styles.itemText]}>{userData.contributed.length} Contributed Projects</Text>}
        <Pressable
          style={[styles.button, {position: "absolute", bottom: 20}]}
          onPress={() => {
            signOut(auth).then(()=>router.replace('/login')).catch((error) => {
                Alert.alert("There was a problem signing you out. Please try again.")
              })
          }}
        >
          <Text style={styles.buttonText}>Log Out</Text>
        </Pressable>
    </View>
  );
}
