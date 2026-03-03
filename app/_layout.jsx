import { router, Stack } from 'expo-router';
import { AuthProvider, useAuth } from '../context/AuthContext';
import '../global.css';
import { useEffect } from 'react';
import {
  useFonts,
  Mulish_400Regular,
  Mulish_600SemiBold,
  Mulish_700Bold,
  Mulish_800ExtraBold,
  Mulish_200ExtraLight,
  Mulish_300Light_Italic,
  Mulish_500Medium,
} from '@expo-google-fonts/mulish';
import { TiltNeon_400Regular } from '@expo-google-fonts/tilt-neon';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

SplashScreen.preventAutoHideAsync();

const RootLayoutNav = () => {
  const { token, loading } = useAuth();

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
    Mulish_200ExtraLight,
    Mulish_400Regular,
    Mulish_600SemiBold,
    Mulish_700Bold,
    Mulish_800ExtraBold,
    Mulish_300Light_Italic,
    Mulish_500Medium,
    TiltNeon_400Regular,
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
