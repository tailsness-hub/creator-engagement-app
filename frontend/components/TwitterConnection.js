import React, { useState, useEffect } from 'react';
import { 
  View, 
  Alert, 
  StyleSheet, 
  ActivityIndicator,
  Linking
} from 'react-native';
import { getTwitterStatus, initTwitterAuth, disconnectTwitter, postTestTweet } from '../services/twitter';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/Theme';
import { Card, Text, Button } from './ui';

const TwitterConnection = ({ onConnectionChange }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    checkTwitterStatus();
  }, []);

  const checkTwitterStatus = async () => {
    setIsLoading(true);
    try {
      const status = await getTwitterStatus();
      setIsConnected(status.connected);
      setUser(status.user);
      
      // Notify parent component of connection change
      if (onConnectionChange) {
        onConnectionChange('twitter', status.connected);
      }
    } catch (error) {
      console.error('Error checking Twitter status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async () => {
    setIsProcessing(true);
    try {
      const authResult = await initTwitterAuth();
      
      if (authResult.success && authResult.authUrl) {
        // Open Twitter authorization URL
        const supported = await Linking.canOpenURL(authResult.authUrl);
        
        if (supported) {
          await Linking.openURL(authResult.authUrl);
          
          // Show instructions to user
          Alert.alert(
            'Twitter Authorization',
            'You will be redirected to Twitter to authorize the app. After authorization, return to this app and refresh your connection status.',
            [
              {
                text: 'OK',
                onPress: () => {
                  // Poll for connection status after user returns
                  setTimeout(() => {
                    checkTwitterStatus();
                  }, 3000);
                }
              }
            ]
          );
        } else {
          Alert.alert(
            'Error',
            'Unable to open Twitter authorization page. Please try again or check your internet connection.'
          );
        }
      } else {
        Alert.alert(
          'Connection Error',
          authResult.error || 'Failed to initiate Twitter connection. Please try again.'
        );
      }
    } catch (error) {
      console.error('Twitter connection error:', error);
      Alert.alert(
        'Connection Error',
        'Failed to connect to Twitter. Please check your internet connection and try again.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDisconnect = () => {
    Alert.alert(
      'Disconnect Twitter',
      `Are you sure you want to disconnect @${user?.screenName}? You'll need to reconnect to post tweets.`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Disconnect',
          style: 'destructive',
          onPress: performDisconnect
        }
      ]
    );
  };

  const performDisconnect = async () => {
    setIsProcessing(true);
    try {
      const result = await disconnectTwitter();
      
      if (result.success) {
        setIsConnected(false);
        setUser(null);
        
        if (onConnectionChange) {
          onConnectionChange('twitter', false);
        }
        
        Alert.alert('Success', 'Successfully disconnected from Twitter');
      } else {
        Alert.alert('Error', result.error || 'Failed to disconnect from Twitter');
      }
    } catch (error) {
      console.error('Twitter disconnect error:', error);
      Alert.alert('Error', 'Failed to disconnect from Twitter. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTestTweet = async () => {
    setIsProcessing(true);
    try {
      const result = await postTestTweet();
      
      if (result.success) {
        Alert.alert(
          'Success',
          'Test tweet posted successfully! Check your Twitter profile to see it.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Error',
          result.error || 'Failed to post test tweet. Please try again.'
        );
      }
    } catch (error) {
      console.error('Test tweet error:', error);
      Alert.alert('Error', 'Failed to post test tweet. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRefresh = () => {
    checkTwitterStatus();
  };

  if (isLoading) {
    return (
      <Card variant="elevated">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={Colors.primary.main} />
          <Text variant="body" color="secondary" style={styles.loadingText}>
            Checking Twitter connection...
          </Text>
        </View>
      </Card>
    );
  }

  return (
    <Card variant="elevated">
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Text style={styles.platformIcon}>🐦</Text>
        </View>
        <View style={styles.headerText}>
          <Text variant="heading" weight="semibold">
            Twitter
          </Text>
          <Text variant="caption" color="secondary">
            Share your content as tweets
          </Text>
        </View>
        <View 
          style={[
            styles.statusIndicator,
            { backgroundColor: isConnected ? Colors.success.main : Colors.error.main }
          ]} 
        />
      </View>

      {/* Content */}
      {isConnected ? (
        <View style={styles.connectedContainer}>
          <View style={styles.userInfo}>
            <Text variant="body" color="secondary" align="center">
              Connected as
            </Text>
            <Text variant="subheading" weight="semibold" color="primary" align="center">
              @{user?.screenName}
            </Text>
          </View>
          
          <View style={styles.buttonContainer}>
            <Button
              variant="outline"
              size="base"
              style={styles.refreshButton}
              onPress={handleRefresh}
              disabled={isProcessing}
            >
              Refresh
            </Button>
            
            <Button
              variant="secondary"
              size="base"
              style={styles.refreshButton}
              onPress={handleTestTweet}
              disabled={isProcessing}
              loading={isProcessing}
            >
              Test Tweet
            </Button>
          </View>
          
          <Button
            variant="error"
            size="base"
            onPress={handleDisconnect}
            disabled={isProcessing}
            loading={isProcessing}
          >
            <Text style={styles.buttonIcon}>🔗</Text>
            Disconnect
          </Button>
        </View>
      ) : (
        <View style={styles.disconnectedContainer}>
          <Text variant="body" color="secondary" style={styles.disconnectedText}>
            Connect your Twitter account to share content across your social platforms. 
            You'll be able to post tweets with up to 280 characters.
          </Text>
          
          <Button
            variant="primary"
            size="lg"
            style={styles.connectButton}
            onPress={handleConnect}
            disabled={isProcessing}
            loading={isProcessing}
          >
            <Text style={styles.buttonIcon}>🐦</Text>
            Connect Twitter
          </Button>
          
          <View style={styles.infoContainer}>
            <Text variant="small" color="secondary" style={styles.infoText}>
              • Post tweets up to 280 characters{'\n'}
              • Share images and media{'\n'}
              • Secure OAuth 1.0a authentication{'\n'}
              • Revoke access anytime
            </Text>
          </View>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
  },
  loadingText: {
    marginLeft: Spacing.md,
  },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: Colors.twitter,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  platformIcon: {
    fontSize: 24,
    color: Colors.white,
  },
  headerText: {
    flex: 1,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  
  connectedContainer: {
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    paddingTop: Spacing.lg,
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  refreshButton: {
    flex: 1,
  },
  
  disconnectedContainer: {
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    paddingTop: Spacing.lg,
  },
  disconnectedText: {
    textAlign: 'center',
    marginBottom: Spacing.lg,
    lineHeight: 22,
  },
  connectButton: {
    width: '100%',
    marginBottom: Spacing.lg,
  },
  buttonIcon: {
    fontSize: 18,
    marginRight: Spacing.sm,
  },
  
  infoContainer: {
    backgroundColor: Colors.background.tertiary,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    width: '100%',
  },
  infoText: {
    textAlign: 'left',
    lineHeight: 18,
  },
});

export default TwitterConnection;