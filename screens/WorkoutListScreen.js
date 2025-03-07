import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from "react-native"

export default function WorkoutListScreen({ navigation }) {
  const workouts = [
    { id: 1, name: "bicep curls" },
    { id: 2, name: "plank" },
    { id: 3, name: "squats" },
  ]

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.title}>choose your workout</Text>
      </View>

      <View style={styles.workoutList}>
        {workouts.map((workout) => (
          <TouchableOpacity
            key={workout.id}
            style={styles.workoutButton}
            onPress={() => navigation.navigate("WorkoutDetail", { workout })}
          >
            <Text style={styles.workoutButtonText}>{workout.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
  },
  workoutList: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    gap: 50,
  },
  workoutButton: {
    backgroundColor: "#5a189a",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  workoutButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "500",
  },
}) 