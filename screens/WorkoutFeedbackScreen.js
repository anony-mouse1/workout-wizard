import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';

export default function WorkoutFeedbackScreen({ route, navigation }) {
  const { workout, reps } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.congratsText}>Great job!</Text>
        
        <View style={styles.statsContainer}>
          <Text style={styles.workoutName}>{workout.name}</Text>
          <Text style={styles.repsText}>{reps} reps completed</Text>
          
          <View style={styles.feedbackContainer}>
            <Text style={styles.feedbackTitle}>Feedback:</Text>
            <Text style={styles.feedbackText}>
              Your form was good! Keep practicing to improve your technique.
            </Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("WorkoutList")}
        >
          <Text style={styles.buttonText}>Choose another workout</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.secondaryButtonText}>Back to home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  congratsText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#5a189a",
    marginBottom: 30,
  },
  statsContainer: {
    width: "100%",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 20,
    marginBottom: 30,
  },
  workoutName: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 10,
  },
  repsText: {
    fontSize: 18,
    marginBottom: 20,
  },
  feedbackContainer: {
    marginTop: 10,
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  feedbackText: {
    fontSize: 16,
    lineHeight: 24,
  },
  button: {
    backgroundColor: "#5a189a",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "500",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#5a189a",
  },
  secondaryButtonText: {
    color: "#5a189a",
    fontSize: 18,
    fontWeight: "500",
  },
});

