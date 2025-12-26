import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { testInstagramPost, validateImageUrl } from '../services/instagram';

const InstagramImageSetup = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [isTesting, setIsTesting] = useState(false);

  const handleImageUrlChange = (url) => {
    setImageUrl(url);
  };

  const handleCaptionChange = (text) => {
    setCaption(text);
  };

  const validateUrl = () => {
    if (!imageUrl.trim()) {
      Alert.alert('Error', 'Please enter an image URL');
      return false;
    }

    if (!validateImageUrl(imageUrl)) {
      Alert.alert(
        'Invalid Image URL',
        'Please enter a valid HTTPS URL ending with .jpg, .jpeg, .png, .gif, or .webp'
      );
      return false;
    }

    return true;
  };

  const handleTestPost = async () => {
    if (!validateUrl()) return;

    try {
      setIsTesting(true);
      
      const testCaption = caption.trim() || 'Test post from Creator Engagement App! 🚀\n\n#test #creatortools #instagram';
      
      const result = await testInstagramPost(imageUrl, testCaption);
      
      Alert.alert(
        'Test Successful! ✅',
        'Your test post was successfully published to Instagram!',
        [{ text: 'OK', style: 'default' }]
      );
      
      // Clear the form after successful test
      setImageUrl('');
      setCaption('');
      
    } catch (error) {
      console.error('Instagram test post error:', error);
      
      let errorMessage = 'Failed to test Instagram post. ';
      
      if (error.response?.data?.message) {
        errorMessage += error.response.data.message;
      } else if (error.message) {
        errorMessage += error.message;
      } else {
        errorMessage += 'Please check your image URL and try again.';
      }
      
      Alert.alert('Test Failed', errorMessage);
    } finally {
      setIsTesting(false);
    }
  };

  const isValidUrl = imageUrl.trim() ? validateImageUrl(imageUrl) : null;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Text style={styles.iconText}>🖼️</Text>
        </View>
        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>Instagram Image Setup</Text>
          <Text style={styles.subtitle}>Configure image posting for Instagram</Text>
        </View>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Image URL *</Text>
          <TextInput
            style={[
              styles.input,
              styles.urlInput,
              isValidUrl === false && styles.inputError,
              isValidUrl === true && styles.inputSuccess
            ]}
            value={imageUrl}
            onChangeText={handleImageUrlChange}
            placeholder="https://example.com/image.jpg"
            placeholderTextColor="#999"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            multiline
          />
          {isValidUrl === false && (
            <Text style={styles.errorText}>
              Invalid URL. Must be HTTPS and end with .jpg, .jpeg, .png, .gif, or .webp
            </Text>
          )}
          {isValidUrl === true && (
            <Text style={styles.successText}>✅ Valid image URL format</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Test Caption (optional)</Text>
          <TextInput
            style={[styles.input, styles.captionInput]}
            value={caption}
            onChangeText={handleCaptionChange}
            placeholder="Enter a custom caption for testing..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            maxLength={2200}
          />
          <Text style={styles.characterCount}>
            {caption.length}/2200 characters
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.testButton,
            (!imageUrl.trim() || isValidUrl === false) && styles.testButtonDisabled
          ]}
          onPress={handleTestPost}
          disabled={!imageUrl.trim() || isValidUrl === false || isTesting}
        >
          {isTesting ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.testButtonText}>Test Instagram Post</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>📋 How to Use Instagram Integration</Text>
        
        <View style={styles.stepContainer}>
          <Text style={styles.stepNumber}>1</Text>
          <Text style={styles.stepText}>
            Upload your image to a public hosting service (Imgur, Cloudinary, etc.)
          </Text>
        </View>
        
        <View style={styles.stepContainer}>
          <Text style={styles.stepNumber}>2</Text>
          <Text style={styles.stepText}>
            Copy the HTTPS URL of your image (must end with .jpg, .png, etc.)
          </Text>
        </View>
        
        <View style={styles.stepContainer}>
          <Text style={styles.stepNumber}>3</Text>
          <Text style={styles.stepText}>
            Paste the URL above and optionally add a test caption
          </Text>
        </View>
        
        <View style={styles.stepContainer}>
          <Text style={styles.stepNumber}>4</Text>
          <Text style={styles.stepText}>
            Click "Test Instagram Post" to publish to your account
          </Text>
        </View>

        <View style={styles.requirementsContainer}>
          <Text style={styles.requirementsTitle}>⚠️ Requirements</Text>
          <Text style={styles.requirementsText}>
            • Image must be publicly accessible via HTTPS{'\n'}
            • Supported formats: JPG, PNG, GIF, WebP{'\n'}
            • Instagram account must be connected{'\n'}
            • Posts appear immediately on your profile
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginVertical: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    width: 50,
    height: 50,
    backgroundColor: '#E4405F',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  iconText: {
    fontSize: 24,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  formContainer: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E1E5E9',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F8F9FA',
    color: '#333',
  },
  urlInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  captionInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#FF5252',
    backgroundColor: '#FFF5F5',
  },
  inputSuccess: {
    borderColor: '#4CAF50',
    backgroundColor: '#F8FFF8',
  },
  errorText: {
    color: '#FF5252',
    fontSize: 12,
    marginTop: 5,
  },
  successText: {
    color: '#4CAF50',
    fontSize: 12,
    marginTop: 5,
  },
  characterCount: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    textAlign: 'right',
  },
  testButton: {
    backgroundColor: '#E4405F',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  testButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  testButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  infoContainer: {
    backgroundColor: '#F8F9FA',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#E4405F',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 24,
    height: 24,
    backgroundColor: '#E4405F',
    color: '#FFFFFF',
    borderRadius: 12,
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 12,
    marginTop: 2,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  requirementsContainer: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E1E5E9',
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF9800',
    marginBottom: 8,
  },
  requirementsText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
});

export default InstagramImageSetup;