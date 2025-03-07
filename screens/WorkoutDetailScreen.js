"use client"

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native"
import { WebView } from 'react-native-webview';

export default function WorkoutDetailScreen({ route, navigation }) {
  const { workout } = route.params
  
  // Video IDs for different workouts
  const videoIds = {
    "plank": "PjU6tadlw1I", // Plank video ID extracted from the URL
    "bicep curls": "ykJmrZ5v0Oo", // Example ID for bicep curls
    "squats": "YaXPRqUwItQ" // Example ID for squats
  };
  
  // Function to generate YouTube embed HTML
  const getYoutubeEmbedHTML = (videoId) => {
    return `
      <html>
        <body style="margin:0;padding:0;background-color:black;">
          <iframe 
            width="100%" 
            height="100%" 
            src="https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1&playsinline=1" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen
          ></iframe>
        </body>
      </html>
    `;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.workoutTitle}>{workout.name}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>here's the workout form:</Text>

        {/* Only show video for workouts that have a video ID */}
        {videoIds[workout.name] && (
          <View style={styles.videoContainer}>
            <WebView
              style={styles.webview}
              javaScriptEnabled={true}
              allowsInlineMediaPlayback={true}
              mediaPlaybackRequiresUserAction={false}
              source={{ html: getYoutubeEmbedHTML(videoIds[workout.name]) }}
              onShouldStartLoadWithRequest={(request) => {
                return request.mainDocumentURL || request.url.includes('youtube.com/embed');
              }}
            />
          </View>
        )}

        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Instructions:</Text>
          <Text style={styles.instructionsText}>
            {getInstructions(workout.name)}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.startButton}
          onPress={() => navigation.navigate("WorkoutTracking", { workout })}
        >
          <Text style={styles.startButtonText}>let's start</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

// Helper function to get instructions based on workout type
function getInstructions(workoutName) {
  switch(workoutName) {
    case "plank":
      return "1. Start in a push-up position\n2. Lower onto your forearms\n3. Keep your body in a straight line\n4. Hold the position\n5. Breathe normally";
    case "bicep curls":
      return "1. Stand with feet shoulder-width apart\n2. Hold dumbbells at your sides\n3. Curl the weights up to your shoulders\n4. Lower back down with control\n5. Repeat";
    case "squats":
      return "1. Stand with feet shoulder-width apart\n2. Lower your body as if sitting in a chair\n3. Keep your back straight\n4. Return to standing position\n5. Repeat";
    default:
      return "Follow proper form for this exercise.";
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  workoutTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#5a189a",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 15,
  },
  videoContainer: {
    height: 220,
    marginBottom: 30,
    borderRadius: 10,
    overflow: "hidden",
  },
  webview: {
    flex: 1,
    backgroundColor: 'black',
  },
  instructionsContainer: {
    backgroundColor: "#f5f5f5",
    padding: 20,
    borderRadius: 10,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  instructionsText: {
    fontSize: 16,
    lineHeight: 24,
  },
  startButton: {
    backgroundColor: "#5a189a",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  startButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "500",
  },
})

