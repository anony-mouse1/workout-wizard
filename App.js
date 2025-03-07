import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import HomeScreen from "./screens/HomeScreen"
import WorkoutListScreen from "./screens/WorkoutListScreen"
import WorkoutDetailScreen from "./screens/WorkoutDetailScreen"
import WorkoutTrackingScreen from "./screens/WorkoutTrackingScreen"
import WorkoutFeedbackScreen from "./screens/WorkoutFeedbackScreen"

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="WorkoutList" component={WorkoutListScreen} />
        <Stack.Screen name="WorkoutDetail" component={WorkoutDetailScreen} />
        <Stack.Screen name="WorkoutTracking" component={WorkoutTrackingScreen} />
        <Stack.Screen name="WorkoutFeedback" component={WorkoutFeedbackScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

