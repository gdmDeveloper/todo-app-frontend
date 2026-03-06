import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import { useEffect } from 'react';
import '../global.css';

import {
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black,
  useFonts,
} from '@expo-google-fonts/inter';

import {
  RobotoCondensed_100Thin_Italic,
  RobotoCondensed_200ExtraLight,
  RobotoCondensed_300Light,
  RobotoCondensed_400Regular,
  RobotoCondensed_500Medium_Italic,
  RobotoCondensed_800ExtraBold,
} from '@expo-google-fonts/roboto-condensed';

import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

SplashScreen.preventAutoHideAsync();

const RootLayoutNav = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="tasks/new" />
        <Stack.Screen name="groups/join" />
        <Stack.Screen name="groups/new" />
      </Stack>
    </GestureHandlerRootView>
  );
};

export default function RootLayout() {
  const [loaded] = useFonts({
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
    RobotoCondensed_100Thin_Italic,
    RobotoCondensed_200ExtraLight,
    RobotoCondensed_300Light,
    RobotoCondensed_400Regular,
    RobotoCondensed_500Medium_Italic,
    RobotoCondensed_800ExtraBold,
  });

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
