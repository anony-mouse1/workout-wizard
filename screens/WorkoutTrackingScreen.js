"use client"

import { useState, useEffect, useRef } from "react"
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions } from "react-native"
import PoseDetection from "../components/PoseDetection"
import CameraDebug from "../components/CameraDebug"

const { width, height } = Dimensions.get("window")

export default function WorkoutTrackingScreen({ route, navigation }) {
  const { workout } = route.params
  const [countdown, setCountdown] = useState(3)
  const [reps, setReps] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [isInCorrectPosition, setIsInCorrectPosition] = useState(false)
  const lastRepTime = useRef(0)
  const [showDebug, setShowDebug] = useState(false)
  
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  // Handle pose detection feedback
  const handlePoseDetected = (detectedFeedback) => {
    setFeedback(detectedFeedback)
    
    const now = Date.now()
    const isSuccess = detectedFeedback && detectedFeedback.type === "success"
    
    // Track if user is in correct position
    setIsInCorrectPosition(isSuccess)
    
    // Count rep only if:
    // 1. Feedback is success
    // 2. At least 1 second has passed since last rep (prevent double counting)
    if (isSuccess && now - lastRepTime.current > 1000) {
      lastRepTime.current = now
      
      setReps((prev) => {
        const newReps = prev + 1
        if (newReps >= 10) {
          // Navigate to feedback screen when 10 reps are completed
          setTimeout(() => {
            navigation.navigate("WorkoutFeedback", { workout, reps: newReps })
          }, 500)
        }
        return newReps
      })
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.workoutTitle}>{workout.name}</Text>
        <TouchableOpacity onPress={() => setShowDebug(!showDebug)}>
          <Text style={styles.debugButton}>{showDebug ? "Hide Debug" : "Debug"}</Text>
        </TouchableOpacity>
      </View>

      {showDebug ? (
        <CameraDebug />
      ) : countdown > 0 ? (
        <View style={styles.countdownContainer}>
          <Text style={styles.countdownText}>{countdown} sec to be in position...</Text>
          <View style={styles.cameraView}>
            <PoseDetection 
              workoutType={workout.name}
              onPoseDetected={() => {}} // Don't process poses during countdown
            />
            <View style={styles.countdownCircle}>
              <Text style={styles.countdownNumber}>{countdown}</Text>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.workoutContainer}>
          {feedback && (
            <View
              style={[styles.feedbackBanner, 
                feedback.type === "error" ? styles.errorBanner : 
                feedback.type === "info" ? styles.infoBanner : styles.successBanner]}
            >
              <View style={[styles.feedbackIcon, 
                feedback.type === "error" ? styles.errorIcon : 
                feedback.type === "info" ? styles.infoIcon : styles.successIcon]}>
                <Text style={styles.feedbackIconText}>
                  {feedback.type === "error" ? "✕" : feedback.type === "info" ? "i" : "✓"}
                </Text>
              </View>
              <Text style={styles.feedbackText}>{feedback.message}</Text>
            </View>
          )}

          <View style={styles.cameraView}>
            <PoseDetection 
              workoutType={workout.name}
              onPoseDetected={handlePoseDetected}
            />
            {isInCorrectPosition && (
              <View style={styles.repIndicator}>
                <Text style={styles.repIndicatorText}>+1</Text>
              </View>
            )}
          </View>

          <View style={styles.repContainer}>
            <Text style={styles.repText}>rep: {reps}</Text>
            <TouchableOpacity 
              style={styles.showWorkoutButton}
              onPress={() => navigation.navigate("WorkoutDetail", { workout })}
            >
              <Text style={styles.showWorkoutText}>show me the workout</Text>
              <Text style={styles.arrowIcon}>▲</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FF6B6B",
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  workoutTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
  debugButton: {
    color: 'white',
    backgroundColor: '#333',
    padding: 5,
    borderRadius: 5,
    fontSize: 12,
  },
  countdownContainer: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },
  countdownText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  cameraView: {
    width: width - 40,
    height: height * 0.6,
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
  },
  countdownCircle: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: -40,
    marginTop: -40,
  },
  countdownNumber: {
    color: "white",
    fontSize: 40,
    fontWeight: "bold",
  },
  workoutContainer: {
    flex: 1,
    padding: 20,
  },
  feedbackBanner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  errorBanner: {
    backgroundColor: "#FFEBEE",
  },
  infoBanner: {
    backgroundColor: "#E3F2FD",
  },
  successBanner: {
    backgroundColor: "#E8F5E9",
  },
  feedbackIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  errorIcon: {
    backgroundColor: "#F44336",
  },
  infoIcon: {
    backgroundColor: "#2196F3",
  },
  successIcon: {
    backgroundColor: "#4CAF50",
  },
  feedbackIconText: {
    color: "white",
    fontWeight: "bold",
  },
  feedbackText: {
    flex: 1,
  },
  repIndicator: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "rgba(76, 175, 80, 0.8)",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  repIndicatorText: {
    color: "white",
    fontWeight: "bold",
  },
  repContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  repText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  showWorkoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF6B6B",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  showWorkoutText: {
    color: "white",
    marginRight: 5,
  },
  arrowIcon: {
    color: "white",
  },
})

