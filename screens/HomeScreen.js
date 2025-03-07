import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from "react-native"

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.content}>
        <Text style={styles.brandText}>
          <Text style={styles.emoji}>💪</Text> workout wizard
        </Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => navigation.navigate("WorkoutList")}
        >
          <Text style={styles.startButtonText}>get started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  brandText: {
    fontSize: 24,
    fontWeight: "600",
  },
  emoji: {
    fontSize: 26,
  },
  footer: {
    padding: 20,
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: "#5a189a",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  startButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "500",
  },
})

