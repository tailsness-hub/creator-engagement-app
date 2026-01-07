import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { testDiscordWebhook } from '../services/discord';

const DiscordWebhookSetup = ({ onWebhookSaved }) => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [webhookStatus, setWebhookStatus] = useState(null); // null, 'valid', 'invalid'

  const validateWebhookUrl = (url) => {
    const webhookRegex = /^https:\/\/discord(?:app)?\.com\/api\/webhooks\/\d+\/[\w-]+$/;
    return webhookRegex.test(url);
  };

  const handleTestWebhook = async () => {
    if (!webhookUrl.trim()) {
      Alert.alert('Error', 'Please enter a webhook URL');
      return;
    }

    if (!validateWebhookUrl(webhookUrl)) {
      setWebhookStatus('invalid');
      Alert.alert(
        'Invalid Webhook URL',
        'Please enter a valid Discord webhook URL.\n\nExample:\nhttps://discord.com/api/webhooks/123456789/abcdef...'
      );
      return;
    }

    try {
      setIsTestingWebhook(true);
      setWebhookStatus(null);
      
      const result = await testDiscordWebhook(webhookUrl);
      
      if (result.success) {
        setWebhookStatus('valid');
        onWebhookSaved && onWebhookSaved(webhookUrl);
        Alert.alert(
          '✅ Webhook Test Successful!',
          'Your Discord webhook is working correctly. Check your Discord channel for a test message.'
        );
      } else {
        setWebhookStatus('invalid');
        Alert.alert(
          '❌ Webhook Test Failed',
          result.error || 'The webhook URL is not working properly.'
        );
      }
    } catch (error) {
      setWebhookStatus('invalid');
      Alert.alert(
        'Test Failed',
        'Failed to test webhook. Please check the URL and try again.'
      );
    } finally {
      setIsTestingWebhook(false);
    }
  };

  const handleWebhookChange = (text) => {
    setWebhookUrl(text);
    setWebhookStatus(null);
  };

  const getInputBorderColor = () => {
    if (webhookStatus === 'valid') return '#00C851';
    if (webhookStatus === 'invalid') return '#ff4444';
    return '#ddd';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Discord Webhook Setup</Text>
        <Text style={styles.subtitle}>
          Add a Discord webhook URL for instant posting without OAuth
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Webhook URL</Text>
        <TextInput
          style={[styles.input, { borderColor: getInputBorderColor() }]}
          value={webhookUrl}
          onChangeText={handleWebhookChange}
          placeholder="https://discord.com/api/webhooks/..."
          placeholderTextColor="#999"
          multiline
          textAlignVertical="top"
          autoCapitalize="none"
          autoCorrect={false}
        />
        
        {webhookStatus === 'valid' && (
          <Text style={styles.statusText}>✅ Webhook verified and ready!</Text>
        )}
        
        {webhookStatus === 'invalid' && (
          <Text style={[styles.statusText, { color: '#ff4444' }]}>
            ❌ Invalid or non-working webhook URL
          </Text>
        )}
      </View>

      <TouchableOpacity 
        style={[styles.testButton, isTestingWebhook && styles.testButtonDisabled]}
        onPress={handleTestWebhook}
        disabled={isTestingWebhook || !webhookUrl.trim()}
      >
        {isTestingWebhook ? (
          <View style={styles.testButtonContent}>
            <ActivityIndicator size="small" color="#fff" />
            <Text style={styles.testButtonText}>Testing...</Text>
          </View>
        ) : (
          <Text style={styles.testButtonText}>Test Webhook</Text>
        )}
      </TouchableOpacity>

      <View style={styles.helpContainer}>
        <Text style={styles.helpTitle}>How to get a Discord webhook:</Text>
        <Text style={styles.helpText}>
          1. Go to your Discord server{'\n'}
          2. Right-click on the channel → Edit Channel{'\n'}
          3. Go to Integrations → Webhooks{'\n'}
          4. Create New Webhook{'\n'}
          5. Copy the webhook URL
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#333',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  statusText: {
    fontSize: 12,
    color: '#00C851',
    marginTop: 6,
    fontWeight: '500',
  },
  testButton: {
    backgroundColor: '#5865F2',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  testButtonDisabled: {
    backgroundColor: '#ccc',
  },
  testButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  testButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  helpContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
  },
  helpTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  helpText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
});

export default DiscordWebhookSetup;