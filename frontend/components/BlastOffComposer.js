import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet,
  Switch,
  ScrollView
} from 'react-native';

const BlastOffComposer = ({ onSendMessage, isLoading = false, connectedPlatforms = [] }) => {
  const [message, setMessage] = useState('');
  const [enabledPlatforms, setEnabledPlatforms] = useState({
    discord: true,
    instagram: false,
    twitter: true,
  });
  const [embedOptions, setEmbedOptions] = useState({
    title: '',
    platform: '',
    url: '',
    imageUrl: '', // For Instagram
  });

  const handlePlatformToggle = (platform) => {
    setEnabledPlatforms(prev => ({
      ...prev,
      [platform]: !prev[platform]
    }));
  };

  const handleSend = () => {
    if (!message.trim()) return;
    
    const messageData = {
      content: message.trim(),
      platforms: Object.entries(enabledPlatforms)
        .filter(([_, enabled]) => enabled)
        .map(([platform]) => platform),
      embedOptions: {
        ...embedOptions,
        title: embedOptions.title || '🚀 New Content Alert!',
      }
    };

    onSendMessage && onSendMessage(messageData);
  };

  const isDiscordConnected = connectedPlatforms.some(p => p.platform === 'discord' && p.connected);
  const isInstagramConnected = connectedPlatforms.some(p => p.platform === 'instagram' && p.connected);
  const isTwitterConnected = connectedPlatforms.some(p => p.platform === 'twitter' && p.connected);
  const canSend = message.trim() && Object.values(enabledPlatforms).some(enabled => enabled);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📝 Your Message</Text>
        <TextInput
          style={styles.messageInput}
          value={message}
          onChangeText={setMessage}
          placeholder="What's happening? Share your excitement with your audience!"
          placeholderTextColor="#999"
          multiline
          textAlignVertical="top"
          maxLength={280}
        />
        <Text style={styles.characterCount}>
          {message.length}/280 characters
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎯 Target Platforms</Text>
        
        <View style={styles.platformItem}>
          <View style={styles.platformInfo}>
            <Text style={styles.platformIcon}>🎮</Text>
            <View style={styles.platformDetails}>
              <Text style={styles.platformName}>Discord</Text>
              <Text style={styles.platformStatus}>
                {isDiscordConnected ? 'Connected ✅' : 'Setup required ⚠️'}
              </Text>
            </View>
          </View>
          <Switch
            value={enabledPlatforms.discord}
            onValueChange={() => handlePlatformToggle('discord')}
            trackColor={{ false: '#ddd', true: '#5865F2' }}
            thumbColor={enabledPlatforms.discord ? '#fff' : '#f4f3f4'}
            disabled={!isDiscordConnected}
          />
        </View>

        <View style={styles.platformItem}>
          <View style={styles.platformInfo}>
            <Text style={styles.platformIcon}>📷</Text>
            <View style={styles.platformDetails}>
              <Text style={styles.platformName}>Instagram</Text>
              <Text style={styles.platformStatus}>
                {isInstagramConnected ? 'Connected ✅' : 'Setup required ⚠️'}
              </Text>
            </View>
          </View>
          <Switch
            value={enabledPlatforms.instagram}
            onValueChange={() => handlePlatformToggle('instagram')}
            trackColor={{ false: '#ddd', true: '#E4405F' }}
            thumbColor={enabledPlatforms.instagram ? '#fff' : '#f4f3f4'}
            disabled={!isInstagramConnected}
          />
        </View>

        <View style={styles.platformItem}>
          <View style={styles.platformInfo}>
            <Text style={styles.platformIcon}>🐦</Text>
            <View style={styles.platformDetails}>
              <Text style={styles.platformName}>Twitter</Text>
              <Text style={styles.platformStatus}>
                {isTwitterConnected ? 'Connected ✅' : 'Setup required ⚠️'}
              </Text>
            </View>
          </View>
          <Switch
            value={enabledPlatforms.twitter}
            onValueChange={() => handlePlatformToggle('twitter')}
            trackColor={{ false: '#ddd', true: '#1DA1F2' }}
            thumbColor={enabledPlatforms.twitter ? '#fff' : '#f4f3f4'}
            disabled={!isTwitterConnected}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>✨ Enhancement Options</Text>
        
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Custom Title (optional)</Text>
          <TextInput
            style={styles.smallInput}
            value={embedOptions.title}
            onChangeText={(text) => setEmbedOptions(prev => ({ ...prev, title: text }))}
            placeholder="🚀 New Content Alert!"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Platform/Game (optional)</Text>
          <TextInput
            style={styles.smallInput}
            value={embedOptions.platform}
            onChangeText={(text) => setEmbedOptions(prev => ({ ...prev, platform: text }))}
            placeholder="e.g., Twitch, YouTube, TikTok"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Direct Link (optional)</Text>
          <TextInput
            style={styles.smallInput}
            value={embedOptions.url}
            onChangeText={(text) => setEmbedOptions(prev => ({ ...prev, url: text }))}
            placeholder="https://..."
            placeholderTextColor="#999"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {enabledPlatforms.instagram && (
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Image URL (required for Instagram) *</Text>
            <TextInput
              style={styles.smallInput}
              value={embedOptions.imageUrl}
              onChangeText={(text) => setEmbedOptions(prev => ({ ...prev, imageUrl: text }))}
              placeholder="https://example.com/image.jpg"
              placeholderTextColor="#999"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Text style={styles.helpText}>
              Must be a publicly accessible HTTPS URL ending with .jpg, .png, .gif, or .webp
            </Text>
          </View>
        )}
      </View>

      <TouchableOpacity 
        style={[styles.sendButton, !canSend && styles.sendButtonDisabled]}
        onPress={handleSend}
        disabled={!canSend || isLoading}
      >
        <Text style={styles.sendButtonText}>
          {isLoading ? '🚀 Launching...' : '🚀 BLAST OFF!'}
        </Text>
      </TouchableOpacity>

      {!canSend && (
        <Text style={styles.warningText}>
          {!message.trim() 
            ? 'Enter a message to blast off' 
            : 'Connect at least one platform to send messages'
          }
        </Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  messageInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    marginTop: 6,
  },
  platformItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  platformInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  platformIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  platformDetails: {
    flex: 1,
  },
  platformName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  platformStatus: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  inputRow: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 6,
  },
  smallInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: '#333',
  },
  sendButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 50,
    alignItems: 'center',
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
    elevation: 0,
  },
  sendButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  warningText: {
    fontSize: 14,
    color: '#ff4444',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  helpText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    fontStyle: 'italic',
    lineHeight: 16,
  },
});

export default BlastOffComposer;