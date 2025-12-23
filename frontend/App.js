import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';

export default function App() {
  const [isBlastingOff, setIsBlastingOff] = useState(false);

  const handleBlastOff = async () => {
    setIsBlastingOff(true);
    
    // Placeholder for blast off functionality
    // This will eventually send notifications to all connected platforms
    Alert.alert(
      '🚀 Blast Off!',
      'Your content announcement is ready to be sent!\n\n(Connect your social accounts to enable this feature)',
      [{ text: 'OK', onPress: () => setIsBlastingOff(false) }]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Creator Engagement App</Text>
      <Text style={styles.subtitle}>The "Blast Off" Button for Your Content</Text>
      
      <TouchableOpacity
        style={[styles.blastOffButton, isBlastingOff && styles.blastOffButtonDisabled]}
        onPress={handleBlastOff}
        disabled={isBlastingOff}
        activeOpacity={0.8}
      >
        <Text style={styles.blastOffButtonText}>
          {isBlastingOff ? '🚀 Launching...' : '🚀 BLAST OFF!'}
        </Text>
      </TouchableOpacity>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Press the button to notify your audience across all connected platforms
        </Text>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 50,
    textAlign: 'center',
  },
  blastOffButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 20,
    paddingHorizontal: 60,
    borderRadius: 50,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  blastOffButtonDisabled: {
    backgroundColor: '#ccc',
  },
  blastOffButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  infoContainer: {
    marginTop: 40,
    paddingHorizontal: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
  },
});
