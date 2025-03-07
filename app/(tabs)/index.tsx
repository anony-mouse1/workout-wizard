import React from 'react';
import { StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

import { Text, View } from '../../components/ThemedText';

export default function HomeScreen() {
  const router = useRouter();

  const workouts = [
    {
      id: 1,
      name: 'Bicep Curls',
      description: 'Track your bicep curl form and count reps',
      image: require('../../assets/images/react-logo.png'),
    },
    {
      id: 2,
      name: 'Squats',
      description: 'Perfect your squat form with real-time feedback',
      image: require('../../assets/images/react-logo.png'),
    },
    {
      id: 3,
      name: 'Push-ups',
      description: 'Count push-ups and check your form',
      image: require('../../assets/images/react-logo.png'),
    },
  ];

  const navigateToWorkout = (workout) => {
    router.push({
      pathname: '/WorkoutTracking',
      params: { workout: JSON.stringify(workout) }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Workout Wizard</Text>
        <Text style={styles.subtitle}>Choose a workout to track</Text>
      </View>

      <ScrollView style={styles.workoutList}>
        {workouts.map((workout) => (
          <TouchableOpacity
            key={workout.id}
            style={styles.workoutCard}
            onPress={() => navigateToWorkout(workout)}
          >
            <Image source={workout.image} style={styles.workoutImage} />
            <View style={styles.workoutInfo}>
              <Text style={styles.workoutName}>{workout.name}</Text>
              <Text style={styles.workoutDescription}>{workout.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  workoutList: {
    flex: 1,
  },
  workoutCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  workoutImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
  },
  workoutInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  workoutName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  workoutDescription: {
    fontSize: 14,
    opacity: 0.7,
  },
});
