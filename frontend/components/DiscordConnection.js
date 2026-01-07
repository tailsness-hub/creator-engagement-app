import React, { useState, useEffect } from 'react';
import { 
  View, 
  TouchableOpacity, 
  Alert, 
  StyleSheet, 
  ActivityIndicator,
  Linking
} from 'react-native';
import { checkDiscordStatus, getDiscordAuthUrl, disconnectDiscord } from '../services/discord';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/Theme';
import { Card, Text, Button } from './ui';

const DiscordConnection = ({ onConnectionChange }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    checkConnectionStatus();
  }, []);

  const checkConnectionStatus = async () => {
    try {
      setIsLoading(true);
      const status = await checkDiscordStatus();
      setIsConnected(status.connected);
      setUser(status.user);
      
      // Notify parent component of connection status
      onConnectionChange && onConnectionChange({
        platform: 'discord',
        connected: status.connected,
        user: status.user
      });
    } catch (error) {
      console.error('Failed to check Discord status:', error);
      setIsConnected(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      const authData = await getDiscordAuthUrl();
      
      if (authData.success && authData.authUrl) {
        // Open Discord OAuth in browser
        const supported = await Linking.canOpenURL(authData.authUrl);
        
        if (supported) {
          Alert.alert(
            '🔗 Connect Discord',
            'You will be redirected to Discord to authorize the app. After authorization, return to this app.',
            [
              { text: 'Cancel', style: 'cancel' },
              { 
                text: 'Continue', 
                onPress: async () => {
                  await Linking.openURL(authData.authUrl);
                  // Note: In a real app, you'd handle the callback differently
                  // This is a simplified version for demonstration
                  setTimeout(() => {
                    checkConnectionStatus();
                  }, 5000);
                }
              }
            ]
          );
        } else {
          Alert.alert('Error', 'Cannot open Discord authorization URL');
        }
      }
    } catch (error) {
      Alert.alert('Connection Failed', error.message || 'Failed to connect to Discord');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    Alert.alert(
      '🔌 Disconnect Discord',
      `Are you sure you want to disconnect ${user?.username}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Disconnect', 
          style: 'destructive',
          onPress: async () => {
            try {
              await disconnectDiscord();
              setIsConnected(false);
              setUser(null);
              
              onConnectionChange && onConnectionChange({
                platform: 'discord',
                connected: false,
                user: null
              });
              
              Alert.alert('✅ Disconnected', 'Discord account disconnected successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to disconnect Discord account');
            }
          }
        }
      ]
    );
  };

  if (isLoading) {
    return (
      <Card margin="base" padding="xl">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={Colors.discord} />
          <Text variant="body" color="secondary" style={styles.loadingText}>
            Checking Discord connection...
          </Text>
        </View>
      </Card>
    );
  }

  return (
    <Card margin="base" padding="lg">
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Text style={styles.platformIcon}>🎮</Text>
        </View>
        <View style={styles.headerText}>
          <Text variant="subheading" weight="semibold">Discord</Text>
          <Text variant="caption" color="secondary">Connect to Discord servers</Text>
        </View>
        <View style={[
          styles.statusIndicator, 
          { backgroundColor: isConnected ? Colors.success : Colors.gray[400] }
        ]} />
      </View>

      {isConnected && user ? (
        <View style={styles.connectedContainer}>
          <View style={styles.userInfo}>
            <Text variant="body" color="secondary">Connected as</Text>
            <Text variant="body" weight="semibold" color="brand">
              {user.username}#{user.discriminator}
            </Text>
            <Text variant="caption" color="tertiary">
              Connected on {new Date().toLocaleDateString()}
            </Text>
          </View>
          
          <View style={styles.buttonContainer}>
            <Button
              title="Refresh Status"
              variant="outline"
              size="sm"
              onPress={checkConnectionStatus}
              loading={isLoading}
              style={styles.refreshButton}
            />
            <Button
              title="Disconnect"
              variant="error"
              size="sm"
              onPress={handleDisconnect}
            />
          </View>
        </View>
      ) : (
        <View style={styles.disconnectedContainer}>
          <Text variant="body" color="secondary" style={styles.disconnectedText}>
            Connect your Discord account to send announcements to Discord servers and channels
          </Text>
          
          <Button
            title="Connect Discord"
            onPress={handleConnect}
            loading={isConnecting}
            style={styles.connectButton}
            icon={!isConnecting && <Text style={styles.buttonIcon}>🎮</Text>}
          />
          
          <View style={styles.infoContainer}>
            <Text variant="caption" color="tertiary" style={styles.infoText}>
              • Send messages to Discord channels{'\n'}
              • Rich embed support with titles and links{'\n'}
              • Secure OAuth 2.0 authentication{'\n'}
              • Works with Discord servers and DMs
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
    backgroundColor: Colors.discord,
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

export default DiscordConnection;