import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';
import { Camera } from 'expo-camera';

export default function CameraDebug() {
  const [permissionStatus, setPermissionStatus] = useState('Not checked');

  // Function to check camera permissions
  const checkPermissions = async () => {
    try {
      console.log('Testing Camera.requestCameraPermissionsAsync()...');
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      console.log('Camera permission result:', cameraPermission);
      setPermissionStatus(cameraPermission.status);
    } catch (error) {
      console.error('Error testing camera permissions:', error);
      setPermissionStatus('Error: ' + error.message);
    }
  };
  
  useEffect(() => {
    // Check permissions on component mount
    checkPermissions();
  }, []);
  
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Camera Debug Info</Text>
      
      <Text style={styles.subtitle}>Camera Information:</Text>
      <Text style={styles.info}>
        Using expo-camera for camera access instead of deprecated expo-permissions.
      </Text>
      <Text style={styles.info}>
        This helps avoid native module errors with ExponentCamera.
      </Text>
      
      <Text style={styles.subtitle}>Current Permission Status:</Text>
      <Text style={styles.status}>{permissionStatus}</Text>
      
      <Button 
        title="Request Camera Permission" 
        onPress={checkPermissions} 
      />
      
      <Text style={styles.footer}>Check console logs for more details</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
  },
  info: {
    fontSize: 14,
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  status: {
    fontSize: 14,
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  footer: {
    fontSize: 14,
    marginTop: 20,
    textAlign: 'center',
  },
}); 