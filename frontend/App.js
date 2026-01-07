import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, Alert, SafeAreaView } from 'react-native';
import { useState } from 'react';

// Import Discord components
import DiscordConnection from './components/DiscordConnection';
import DiscordWebhookSetup from './components/DiscordWebhookSetup';

// Import Instagram components
import InstagramConnection from './components/InstagramConnection';
import InstagramImageSetup from './components/InstagramImageSetup';

// Import Twitter components
import TwitterConnection from './components/TwitterConnection';

// Import shared components
import BlastOffComposer from './components/BlastOffComposer';

// Import services
import { sendDiscordBlastOff } from './services/discord';
import { sendInstagramBlastOff } from './services/instagram';
import { postTweet } from './services/twitter';

export default function App() {
  const [isBlastingOff, setIsBlastingOff] = useState(false);
  const [connectedPlatforms, setConnectedPlatforms] = useState([]);
  const [discordWebhookUrl, setDiscordWebhookUrl] = useState('');

  const handleConnectionChange = (connectionInfo) => {
    setConnectedPlatforms(prev => {
      const filtered = prev.filter(p => p.platform !== connectionInfo.platform);
      return [...filtered, connectionInfo];
    });
  };

  const handleWebhookSaved = (webhookUrl) => {
    setDiscordWebhookUrl(webhookUrl);
  };

  const handleBlastOff = async (messageData) => {
    setIsBlastingOff(true);
    
    try {
      // Check if Discord is in the enabled platforms
      if (messageData.platforms.includes('discord')) {
        const discordPayload = {
          message: messageData.content,
          embedOptions: messageData.embedOptions
        };

        // Add webhook URL if available
        if (discordWebhookUrl) {
          discordPayload.webhookUrl = discordWebhookUrl;
        }

        const result = await sendDiscordBlastOff(discordPayload);
        
        if (result.success) {
          Alert.alert(
            '🚀 Blast Off Successful!',
            `Your announcement has been sent to Discord!\n\nMessage: "${messageData.content}"`,
            [{ text: 'Awesome!' }]
          );
        } else {
          Alert.alert(
            '❌ Blast Off Failed',
            result.message || 'Failed to send message to Discord'
          );
        }
      }

      // Check if Instagram is in the enabled platforms
      if (messageData.platforms.includes('instagram')) {
        const instagramPayload = {
          message: messageData.content,
          title: messageData.embedOptions?.title,
          platform: messageData.embedOptions?.platform,
          url: messageData.embedOptions?.url,
          imageUrl: messageData.embedOptions?.imageUrl
        };

        // Validate image URL is present for Instagram
        if (!instagramPayload.imageUrl) {
          Alert.alert(
            '❌ Instagram Error',
            'Instagram posts require an image URL. Please provide an image URL in the enhancement options.'
          );
          return;
        }

        const result = await sendInstagramBlastOff(instagramPayload);
        
        if (result.success) {
          Alert.alert(
            '📷 Instagram Success!',
            `Your post has been published to Instagram!\n\nUsername: @${result.username}`,
            [{ text: 'Great!' }]
          );
        } else {
          Alert.alert(
            '❌ Instagram Failed',
            result.message || 'Failed to post to Instagram'
          );
        }
      }

      // Check if Twitter is in the enabled platforms
      if (messageData.platforms.includes('twitter')) {
        const twitterPayload = {
          message: messageData.content,
          mediaUrl: messageData.embedOptions?.imageUrl // Optional image URL
        };

        const result = await postTweet(twitterPayload.message, twitterPayload.mediaUrl);
        
        if (result.success) {
          Alert.alert(
            '🐦 Twitter Success!',
            `Your tweet has been posted successfully!\n\nTweet ID: ${result.tweetId}`,
            [{ text: 'Excellent!' }]
          );
        } else {
          Alert.alert(
            '❌ Twitter Failed',
            result.error || 'Failed to post tweet'
          );
        }
      }
    } catch (error) {
      console.error('Blast off error:', error);
      Alert.alert(
        '❌ Error',
        'Something went wrong. Please check your connections and try again.'
      );
    } finally {
      setIsBlastingOff(false);
    }
  };

  const isDiscordSetup = connectedPlatforms.some(p => p.platform === 'discord' && p.connected) || discordWebhookUrl;
  const isInstagramSetup = connectedPlatforms.some(p => p.platform === 'instagram' && p.connected);
  const isTwitterSetup = connectedPlatforms.some(p => p.platform === 'twitter' && p.connected);
  const isAnyPlatformSetup = isDiscordSetup || isInstagramSetup || isTwitterSetup;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Creator Engagement App</Text>
          <Text style={styles.subtitle}>The "Blast Off" Button for Your Content</Text>
        </View>

        {/* Connection Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔗 Platform Connections</Text>
          
          {/* Discord Integration */}
          <DiscordConnection onConnectionChange={handleConnectionChange} />
          
          {!connectedPlatforms.some(p => p.platform === 'discord' && p.connected) && (
            <DiscordWebhookSetup onWebhookSaved={handleWebhookSaved} />
          )}

          {/* Instagram Integration */}
          <InstagramConnection onConnectionChange={handleConnectionChange} />
          
          {connectedPlatforms.some(p => p.platform === 'instagram' && p.connected) && (
            <InstagramImageSetup />
          )}

          {/* Twitter Integration */}
          <TwitterConnection onConnectionChange={handleConnectionChange} />
        </View>

        {/* Blast Off Composer */}
        {isAnyPlatformSetup ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🚀 Ready to Blast Off</Text>
            <BlastOffComposer 
              onSendMessage={handleBlastOff}
              isLoading={isBlastingOff}
              connectedPlatforms={connectedPlatforms}
            />
          </View>
        ) : (
          <View style={styles.setupPrompt}>
            <Text style={styles.setupPromptTitle}>🔧 Setup Required</Text>
            <Text style={styles.setupPromptText}>
              Connect your Discord or Instagram account (or add a Discord webhook URL) above to start sending "Blast Off" messages!
            </Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            🎯 Instantly notify your audience across all platforms when you go live or post new content
          </Text>
        </View>
      </ScrollView>
      
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  setupPrompt: {
    backgroundColor: '#fff3cd',
    borderRadius: 12,
    padding: 20,
    margin: 16,
    borderWidth: 1,
    borderColor: '#ffeaa7',
  },
  setupPromptTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#856404',
    marginBottom: 8,
  },
  setupPromptText: {
    fontSize: 14,
    color: '#856404',
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    fontStyle: 'italic',
  },
});
