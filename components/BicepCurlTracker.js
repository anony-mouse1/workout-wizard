import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, Platform, Image } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import Svg, { Circle, Line } from 'react-native-svg';
import { Pose } from '@mediapipe/pose';
import * as FileSystem from 'expo-file-system';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

// Bicep curl tracking component with MediaPipe
export default function BicepCurlTracker() {
  // Camera state
  const [facing, setFacing] = useState('front');
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraReady, setCameraReady] = useState(false);
  
  // Tracking state
  const [repCount, setRepCount] = useState(0);
  const [curlingUp, setCurlingUp] = useState(false);
  const [angle, setAngle] = useState(180);
  const [feedback, setFeedback] = useState('Get ready');
  const [isTracking, setIsTracking] = useState(false);
  const [isProcessingFrame, setIsProcessingFrame] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [lastPhotoUri, setLastPhotoUri] = useState(null);
  
  // Landmarks state
  const [landmarks, setLandmarks] = useState({
    rightShoulder: { x: 0.6, y: 0.3, visibility: 1 },
    rightElbow: { x: 0.7, y: 0.5, visibility: 1 },
    rightWrist: { x: 0.8, y: 0.7, visibility: 1 },
  });
  
  // Refs
  const cameraRef = useRef(null);
  const poseRef = useRef(null);
  const frameId = useRef(0);
  const processingTimeoutRef = useRef(null);

  // Screen dimensions
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  // Initialize MediaPipe Pose
  useEffect(() => {
    if (isTracking && !isModelLoaded) {
      setFeedback('Loading pose detection model...');
      initializePose();
    }
    
    return () => {
      if (poseRef.current) {
        poseRef.current.close();
        poseRef.current = null;
      }
      
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
      }
    };
  }, [isTracking]);

  // Initialize MediaPipe Pose
  const initializePose = async () => {
    try {
      // Create a new Pose instance
      const pose = new Pose({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
        }
      });

      // Configure pose options - we only need upper body landmarks
      pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: false,
        smoothSegmentation: false,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
        selfieMode: facing === 'front',
      });

      // Set up pose detection callback
      pose.onResults((results) => {
        if (results.poseLandmarks) {
          // Extract only the landmarks we need
          const newLandmarks = {
            rightShoulder: results.poseLandmarks[12], // Right shoulder
            rightElbow: results.poseLandmarks[14],    // Right elbow
            rightWrist: results.poseLandmarks[16],    // Right wrist
          };
          
          setLandmarks(newLandmarks);
          
          // Calculate angle at elbow
          const shoulder = newLandmarks.rightShoulder;
          const elbow = newLandmarks.rightElbow;
          const wrist = newLandmarks.rightWrist;
          
          if (shoulder && elbow && wrist && 
              shoulder.visibility > 0.7 && 
              elbow.visibility > 0.7 && 
              wrist.visibility > 0.7) {
            
            const currentAngle = calculateAngle(shoulder, elbow, wrist);
            setAngle(Math.round(currentAngle));
            
            // Bicep curl logic
            if (currentAngle > 160 && curlingUp) {
              setCurlingUp(false);
              setFeedback('Arm extended, now curl up');
            } 
            else if (currentAngle < 60 && !curlingUp) {
              setCurlingUp(true);
              setRepCount(prevCount => prevCount + 1);
              setFeedback('Good curl! Now extend your arm');
            }
            else if (currentAngle < 90) {
              setFeedback('Curling up - keep going!');
            } else {
              setFeedback('Extending arm - keep going!');
            }
          } else {
            setFeedback('Position your right arm in view of the camera');
          }
        } else {
          setFeedback('No pose detected. Make sure your upper body is visible.');
        }
        
        setIsProcessingFrame(false);
      });
      
      await pose.initialize();
      poseRef.current = pose;
      setIsModelLoaded(true);
      setFeedback('Model loaded! Position yourself for bicep curls.');
      console.log('MediaPipe Pose initialized');
    } catch (error) {
      console.error('Error initializing MediaPipe Pose:', error);
      setFeedback('Error initializing pose detection: ' + error.message);
      setIsTracking(false);
      setIsModelLoaded(false);
    }
  };

  // Function to calculate angle between three points
  const calculateAngle = (a, b, c) => {
    // Convert to radians
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs(radians * 180.0 / Math.PI);
    
    // Ensure angle is between 0 and 180
    if (angle > 180.0) {
      angle = 360 - angle;
    }
    
    return angle;
  };

  // Process camera frames
  const processFrame = async () => {
    if (!isTracking || !cameraRef.current || !poseRef.current || isProcessingFrame || !isModelLoaded) {
      return;
    }
    
    try {
      setIsProcessingFrame(true);
      
      // Take a picture
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.5,
        base64: true,
        skipProcessing: true,
      });
      
      setLastPhotoUri(photo.uri);
      
      // Create an HTML Image element from the base64 data
      const img = new Image();
      img.src = `data:image/jpeg;base64,${photo.base64}`;
      
      // Wait for the image to load
      img.onload = async () => {
        try {
          // Process the image with MediaPipe Pose
          await poseRef.current.send({ image: img });
          
          // Schedule next frame with a small delay to prevent overwhelming the device
          processingTimeoutRef.current = setTimeout(() => {
            setIsProcessingFrame(false);
            if (isTracking) {
              frameId.current = requestAnimationFrame(processFrame);
            }
          }, 100);
        } catch (error) {
          console.error('Error in image processing:', error);
          setFeedback('Error processing image: ' + error.message);
          setIsProcessingFrame(false);
        }
      };
      
      img.onerror = () => {
        console.error('Error loading image');
        setFeedback('Error loading camera image');
        setIsProcessingFrame(false);
      };
      
    } catch (error) {
      console.error('Error taking picture:', error);
      setFeedback('Error accessing camera: ' + error.message);
      setIsProcessingFrame(false);
      
      // Try again after a delay
      processingTimeoutRef.current = setTimeout(() => {
        if (isTracking) {
          frameId.current = requestAnimationFrame(processFrame);
        }
      }, 1000);
    }
  };

  // Start/stop frame processing
  useEffect(() => {
    if (isTracking && cameraReady && isModelLoaded && !isProcessingFrame) {
      frameId.current = requestAnimationFrame(processFrame);
    }
    
    return () => {
      if (frameId.current) {
        cancelAnimationFrame(frameId.current);
      }
      
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
      }
    };
  }, [isTracking, cameraReady, isModelLoaded, isProcessingFrame]);

  // Toggle camera facing
  function toggleCameraFacing() {
    const newFacing = facing === 'back' ? 'front' : 'back';
    setFacing(newFacing);
    
    // Update selfieMode if pose is initialized
    if (poseRef.current) {
      poseRef.current.setOptions({
        selfieMode: newFacing === 'front',
      });
    }
  }

  // Toggle tracking
  function toggleTracking() {
    const newTrackingState = !isTracking;
    setIsTracking(newTrackingState);
    
    if (newTrackingState) {
      setFeedback(isModelLoaded ? 'Starting tracking...' : 'Loading pose detection model...');
      if (!isModelLoaded) {
        setRepCount(0);
      }
    } else {
      setFeedback('Tracking paused');
      if (frameId.current) {
        cancelAnimationFrame(frameId.current);
      }
      
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
      }
    }
  }

  // Permission handling
  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Checking camera permissions...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>We need your permission to show the camera</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={requestPermission}
        >
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Convert normalized coordinates to screen coordinates
  const toScreenCoords = (point) => {
    if (!point || point.visibility < 0.5) return null;
    return {
      x: point.x * screenWidth,
      y: point.y * screenHeight
    };
  };

  // Get screen coordinates for landmarks
  const rightShoulder = toScreenCoords(landmarks.rightShoulder);
  const rightElbow = toScreenCoords(landmarks.rightElbow);
  const rightWrist = toScreenCoords(landmarks.rightWrist);

  return (
    <View style={styles.container}>
      <CameraView 
        style={styles.camera} 
        facing={facing}
        ref={cameraRef}
        onCameraReady={() => {
          console.log('Camera is ready');
          setCameraReady(true);
        }}
      >
        {/* SVG overlay for drawing landmarks */}
        <Svg style={styles.overlay} width={screenWidth} height={screenHeight}>
          {/* Right arm */}
          {rightShoulder && rightElbow && (
            <Line
              x1={rightShoulder.x}
              y1={rightShoulder.y}
              x2={rightElbow.x}
              y2={rightElbow.y}
              stroke="green"
              strokeWidth="3"
            />
          )}
          {rightElbow && rightWrist && (
            <Line
              x1={rightElbow.x}
              y1={rightElbow.y}
              x2={rightWrist.x}
              y2={rightWrist.y}
              stroke="green"
              strokeWidth="3"
            />
          )}
          
          {/* Landmarks */}
          {rightShoulder && (
            <Circle cx={rightShoulder.x} cy={rightShoulder.y} r="8" fill="red" />
          )}
          {rightElbow && (
            <Circle cx={rightElbow.x} cy={rightElbow.y} r="8" fill="red" />
          )}
          {rightWrist && (
            <Circle cx={rightWrist.x} cy={rightWrist.y} r="8" fill="red" />
          )}
        </Svg>
        
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>
            {isModelLoaded ? 'Model: Ready' : 'Model: Loading...'}
          </Text>
        </View>
        
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>
            Reps: {repCount} | Angle: {angle}°
          </Text>
          <Text style={styles.feedbackText}>{feedback}</Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, isTracking ? styles.stopButton : styles.startButton]}
            onPress={toggleTracking}
          >
            <Text style={styles.buttonText}>
              {isTracking ? 'Stop Tracking' : 'Start Tracking'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.button}
            onPress={toggleCameraFacing}
          >
            <Text style={styles.buttonText}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    padding: 20,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 15,
    borderRadius: 10,
    minWidth: 150,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: 'rgba(0,100,0,0.7)',
  },
  stopButton: {
    backgroundColor: 'rgba(150,0,0,0.7)',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  statsContainer: {
    position: 'absolute',
    top: 80,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 15,
    borderRadius: 10,
    width: '80%',
  },
  statusContainer: {
    position: 'absolute',
    top: 30,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 5,
  },
  statusText: {
    color: 'white',
    fontSize: 14,
  },
  statsText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  feedbackText: {
    color: '#00FF00',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  }
}); 