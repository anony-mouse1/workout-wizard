"use client"

import React from 'react';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
import BicepCurlTracker from '../components/BicepCurlTracker';

export default function WorkoutTrackingScreen({ route, navigation }) {
  const { workout } = route.params || { workout: { name: 'Bicep Curls' } };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{workout.name}</Text>
      </View>
      
      <View style={styles.trackerContainer}>
        <BicepCurlTracker />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 15,
    backgroundColor: '#3498db',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  trackerContainer: {
    flex: 1,
  },
});

