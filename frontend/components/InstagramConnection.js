import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Linking
} from 'react-native';
import { checkInstagramStatus, getInstagramAuthUrl, disconnectInstagram } from '../services/instagram';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/Theme';
import { Card, Text, Button } from './ui';

const InstagramConnection = ({ onConnectionChange }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Check connection status on component mount
  useEffect(() => {
    checkConnectionStatus();
  }, []);

  const checkConnectionStatus = async () => {
    setIsLoading(true);
    try {
      const status = await checkInstagramStatus();
      setIsConnected(status.connected);
      
      if (status.connected && status.user) {
        setUserInfo(status.user);
      } else {
        setUserInfo(null);
      }

      // Notify parent component of connection change
      if (onConnectionChange) {
        onConnectionChange('instagram', status.connected);
      }
    } catch (error) {
      console.error('Failed to check Instagram status:', error);
      setIsConnected(false);
      setUserInfo(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async () => {
    setIsProcessing(true);
    try {
      const authData = await getInstagramAuthUrl();
      
      if (authData.success && authData.authUrl) {
        // Open Instagram authorization URL
        const supported = await Linking.canOpenURL(authData.authUrl);
        
        if (supported) {
          await Linking.openURL(authData.authUrl);
          
          Alert.alert(
            'Instagram Authorization',
            'You will be redirected to Instagram to authorize the app. After authorization, return to this app and refresh your connection status.',
            [
              {
                text: 'OK',
                onPress: () => {
                  // Poll for connection status after user returns
                  setTimeout(() => {
                    checkConnectionStatus();
                  }, 3000);
                }
              }
            ]
          );
        } else {
          Alert.alert(
            'Error',
            'Unable to open Instagram authorization page. Please try again or check your internet connection.'
          );
        }
      } else {
        Alert.alert(
          'Connection Error',
          authData.error || 'Failed to initiate Instagram connection. Please try again.'
        );
      }
    } catch (error) {
      console.error('Instagram connection error:', error);
      Alert.alert(
        'Connection Error',
        'Failed to connect to Instagram. Please check your internet connection and try again.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDisconnect = () => {
    Alert.alert(
      'Disconnect Instagram',
      `Are you sure you want to disconnect ${userInfo?.username}? You'll need to reconnect to post to Instagram.`,
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
      const result = await disconnectInstagram();
      
      if (result.success) {
        setIsConnected(false);
        setUserInfo(null);
        
        if (onConnectionChange) {
          onConnectionChange('instagram', false);
        }
        
        Alert.alert('Success', 'Successfully disconnected from Instagram');
      } else {
        Alert.alert('Error', result.error || 'Failed to disconnect from Instagram');
      }
    } catch (error) {
      console.error('Instagram disconnect error:', error);
      Alert.alert('Error', 'Failed to disconnect from Instagram. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRefresh = () => {
    checkConnectionStatus();
  };

  if (isLoading) {
    return (
      <Card variant="elevated">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={Colors.primary.main} />
          <Text variant="body" color="secondary" style={styles.loadingText}>
            Checking Instagram connection...
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
          <Text style={styles.platformIcon}>📷</Text>
        </View>
        <View style={styles.headerText}>
          <Text variant="heading" weight="semibold">
            Instagram
          </Text>
          <Text variant="caption" color="secondary">
            Share photos and stories
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
              @{userInfo?.username}
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
            Connect your Instagram Business account to share photos and media across your social platforms. 
            Perfect for visual content and stories.
          </Text>
          
          <Button
            variant="primary"
            size="lg"
            style={styles.connectButton}
            onPress={handleConnect}
            disabled={isProcessing}
            loading={isProcessing}
          >
            <Text style={styles.buttonIcon}>📷</Text>
            Connect Instagram
          </Button>
          
          <View style={styles.infoContainer}>
            <Text variant="small" color="secondary" style={styles.infoText}>
              • Share photos and videos{'\n'}
              • Post to your Instagram feed{'\n'}
              • Business account required{'\n'}
              • Secure OAuth 2.0 authentication{'\n'}
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
    backgroundColor: Colors.instagram,
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

export default InstagramConnection;