import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{headerShown: false}}/>
      <Stack.Screen name="login" options={{title: "Log In"}}/>
      <Stack.Screen name="signup" options={{title: "Sign Up"}}/>
      <Stack.Screen name="home" options={{title: "Home"}}/>
    </Stack>
  );
}
