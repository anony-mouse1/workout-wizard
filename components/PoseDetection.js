import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

// Simple component without TensorFlow.js dependencies
export default function PoseDetection() {
  // Camera state
  const [facing, setFacing] = useState('front');
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraReady, setCameraReady] = useState(false);
  
  // Refs
  const cameraRef = useRef(null);

  // Initialize camera with front camera
  useEffect(() => {
    console.log('Initializing camera with front camera');
  }, []);

  // Log permission status for debugging
  useEffect(() => {
    console.log('Camera permission status:', permission);
  }, [permission]);

  function toggleCameraFacing() {
    console.log('Current facing before toggle:', facing);
    // Toggle between 'back' and 'front' string values
    const newFacing = facing === 'back' ? 'front' : 'back';
    console.log('Setting facing to:', newFacing);
    setFacing(newFacing);
  }

  if (!permission) {
    // Camera permissions are still loading
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Checking camera permissions...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={styles.text}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

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
        <View style={styles.buttonContainer}>
          <Button
            title="Flip Camera"
            onPress={toggleCameraFacing}
            color="white"
          />
        </View>
        
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>
            Camera: {cameraReady ? '✓' : '⌛'}
          </Text>
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
  text: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 5,
  },
  statusContainer: {
    position: 'absolute',
    top: 20,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 5,
  },
  statusText: {
    color: 'white',
    fontSize: 16,
  }
});
