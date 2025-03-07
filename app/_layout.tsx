import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import 'react-native-reanimated';

import '../global.css';
import Colors from '../constants/Colors';

// Prevent the splash screen from auto-hiding before asset loading is complete.
export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

export default function RootLayoutNav() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Do something on mount
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors[colorScheme ?? 'light'].background,
          },
          headerTintColor: Colors[colorScheme ?? 'light'].text,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="WorkoutTracking"
          options={{
            title: 'Workout Tracking',
            headerShown: false,
          }}
          // @ts-ignore
          getComponent={() => require('../screens/WorkoutTrackingScreen').default}
        />
        <Stack.Screen
          name="WorkoutDetail"
          options={{
            title: 'Workout Details',
          }}
          // @ts-ignore
          getComponent={() => require('../screens/WorkoutDetailScreen').default}
        />
        <Stack.Screen
          name="WorkoutFeedback"
          options={{
            title: 'Workout Feedback',
          }}
          // @ts-ignore
          getComponent={() => require('../screens/WorkoutFeedbackScreen').default}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
