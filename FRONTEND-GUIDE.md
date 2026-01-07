# Frontend Development Guide

## Creator Engagement App - React Native Frontend

### Overview

The frontend is a React Native mobile application built with Expo that provides a modern, intuitive interface for multi-platform social media management.

## Architecture

### Component Structure

```
components/
├── ui/                     # Design System Components
│   ├── Button.js          # Modern button with variants and states
│   ├── Card.js            # Elevated card containers
│   ├── Text.js            # Typography system
│   ├── Input.js           # Form inputs with validation
│   └── index.js           # Barrel exports
├── DiscordConnection.js   # Discord OAuth and status management
├── InstagramConnection.js # Instagram OAuth and status management  
├── TwitterConnection.js   # Twitter OAuth and status management
├── DiscordWebhookSetup.js # Discord webhook configuration
├── InstagramImageSetup.js # Instagram media setup
└── BlastOffComposer.js    # Multi-platform content composer
```

### Service Layer

```
services/
├── discord.js    # Discord API integration
├── instagram.js  # Instagram API integration  
└── twitter.js    # Twitter API integration
```

### Design System

```
constants/
└── Theme.js      # Design tokens and styling constants
```

## Design System

### Theme Tokens

#### Colors
```javascript
// Primary Brand Colors
Colors.primary.main = '#3B82F6'      // Blue
Colors.primary.dark = '#1E40AF'
Colors.primary.light = '#60A5FA'

// Platform Colors
Colors.discord = '#5865F2'           // Discord purple
Colors.instagram = '#E4405F'         // Instagram pink  
Colors.twitter = '#1DA1F2'           // Twitter blue

// Semantic Colors
Colors.success.main = '#10B981'      // Green
Colors.error.main = '#EF4444'        // Red
Colors.warning.main = '#F59E0B'      // Amber
```

#### Typography
```javascript
// Font Sizes (rem scale)
Typography.size.display = 32         // Hero text
Typography.size.title = 28           // Page titles
Typography.size.heading = 20         // Section headers
Typography.size.subheading = 18      // Subsection headers
Typography.size.body = 16            // Body text
Typography.size.caption = 14         // Secondary text
Typography.size.small = 12           // Fine print

// Font Weights
Typography.weight.light = '300'
Typography.weight.normal = '400'
Typography.weight.medium = '500'
Typography.weight.semibold = '600'
Typography.weight.bold = '700'
```

#### Spacing (8pt Grid System)
```javascript
Spacing.xs = 4     // Micro spacing
Spacing.sm = 8     // Small gaps  
Spacing.md = 16    // Default spacing
Spacing.lg = 24    // Large sections
Spacing.xl = 32    // Major layout gaps
Spacing.xxl = 48   // Hero sections
```

### Component API

#### Button Component
```jsx
import { Button } from './ui';

// Variants
<Button variant="primary">Primary Action</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="error">Delete</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="base">Default</Button>
<Button size="lg">Large</Button>

// States
<Button loading={true}>Loading...</Button>
<Button disabled={true}>Disabled</Button>
```

#### Card Component
```jsx
import { Card } from './ui';

// Variants
<Card variant="base">Default card</Card>
<Card variant="elevated">Elevated with shadow</Card>
<Card variant="outlined">Border only</Card>
<Card variant="flat">No elevation</Card>
```

#### Text Component
```jsx
import { Text } from './ui';

// Semantic variants
<Text variant="display">Hero Text</Text>
<Text variant="heading">Section Title</Text>
<Text variant="body">Body content</Text>
<Text variant="caption">Secondary info</Text>

// Colors and weights
<Text color="primary">Branded text</Text>
<Text color="secondary">Muted text</Text>
<Text weight="semibold">Bold text</Text>
```

## Service Layer Pattern

### API Service Structure
```javascript
// services/platform.js template
export class PlatformService {
  static async getStatus() {
    // Check connection status
  }
  
  static async initAuth() {
    // Start OAuth flow
  }
  
  static async disconnect() {
    // Revoke access
  }
  
  static async post(content) {
    // Post content to platform
  }
}

// Convenience exports
export const getPlatformStatus = PlatformService.getStatus;
export const initPlatformAuth = PlatformService.initAuth;
```

### Error Handling Pattern
```javascript
try {
  const result = await PlatformService.someAction();
  if (result.success) {
    // Handle success
    setData(result.data);
  } else {
    // Handle API error
    Alert.alert('Error', result.error);
  }
} catch (error) {
  // Handle network/system error
  console.error('Service error:', error);
  Alert.alert('Error', 'Please check your connection');
}
```

## Component Development

### Connection Component Pattern

All platform connection components follow this structure:

```jsx
const PlatformConnection = ({ onConnectionChange }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    checkConnectionStatus();
  }, []);

  const checkConnectionStatus = async () => {
    // Implementation
  };

  const handleConnect = async () => {
    // OAuth flow
  };

  const handleDisconnect = () => {
    // Confirmation and disconnect
  };

  // Render with modern UI components
  return (
    <Card variant="elevated">
      {/* Header with platform branding */}
      {/* Connected/disconnected state */}
      {/* Action buttons */}
    </Card>
  );
};
```

### State Management

#### Local State (useState)
```javascript
// Connection status
const [isConnected, setIsConnected] = useState(false);
const [user, setUser] = useState(null);

// UI state
const [isLoading, setIsLoading] = useState(true);
const [isProcessing, setIsProcessing] = useState(false);

// Form state
const [message, setMessage] = useState('');
const [enabledPlatforms, setEnabledPlatforms] = useState({
  discord: true,
  instagram: false,
  twitter: true
});
```

#### Caching with AsyncStorage
```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Cache connection status
const cacheStatus = async (platform, status) => {
  await AsyncStorage.setItem(
    `${platform}_status`, 
    JSON.stringify(status)
  );
};

// Retrieve cached data
const getCachedStatus = async (platform) => {
  const cached = await AsyncStorage.getItem(`${platform}_status`);
  return cached ? JSON.parse(cached) : null;
};
```

## Development Workflow

### Adding New Platform

1. **Create API Service**
   ```bash
   # Create service file
   touch services/newplatform.js
   ```

2. **Implement Service Methods**
   ```javascript
   export class NewPlatformService {
     static async getStatus() { /* ... */ }
     static async initAuth() { /* ... */ }
     static async post(content) { /* ... */ }
   }
   ```

3. **Create Connection Component**
   ```bash
   # Create component file
   touch components/NewPlatformConnection.js
   ```

4. **Add to BlastOffComposer**
   ```javascript
   // Add platform to enabledPlatforms state
   // Add platform toggle UI
   // Add platform to posting logic
   ```

5. **Add to Main App**
   ```javascript
   // Import component
   // Add to connection change handler
   // Add to platform setup checks
   ```

### Testing Strategy

#### Unit Testing
```javascript
// Component testing
import { render, fireEvent } from '@testing-library/react-native';
import PlatformConnection from '../PlatformConnection';

test('shows loading state initially', () => {
  const { getByText } = render(<PlatformConnection />);
  expect(getByText('Checking connection...')).toBeTruthy();
});
```

#### Integration Testing
```javascript
// Service testing
import { PlatformService } from '../services/platform';

test('handles API errors gracefully', async () => {
  const result = await PlatformService.getStatus();
  expect(result).toHaveProperty('connected');
  expect(result).toHaveProperty('error');
});
```

### Performance Optimization

#### Image Optimization
```javascript
// Use appropriate image formats
<Image 
  source={{ uri: imageUrl }}
  style={{ width: 100, height: 100 }}
  resizeMode="cover"
  defaultSource={require('./placeholder.png')}
/>
```

#### List Rendering
```javascript
// Use FlatList for large datasets
<FlatList
  data={items}
  renderItem={({ item }) => <Item data={item} />}
  keyExtractor={item => item.id}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
/>
```

#### Memory Management
```javascript
// Cleanup in useEffect
useEffect(() => {
  const timer = setInterval(checkStatus, 30000);
  return () => clearInterval(timer); // Cleanup
}, []);
```

## Debugging

### Common Issues

#### OAuth Flow Problems
```javascript
// Debug OAuth redirects
console.log('Auth URL:', authData.authUrl);
console.log('Redirect URI:', redirectUri);

// Check URL scheme registration in app.json
{
  "expo": {
    "scheme": "creator-engagement-app"
  }
}
```

#### API Connection Issues
```javascript
// Debug network requests
const response = await fetch(url);
console.log('Response status:', response.status);
console.log('Response headers:', response.headers);
```

#### Component State Issues
```javascript
// Debug state changes
useEffect(() => {
  console.log('Connection status changed:', isConnected);
}, [isConnected]);
```

### Development Tools

#### Expo DevTools
```bash
# Open developer menu
# - iOS Simulator: Cmd+D
# - Android Emulator: Cmd+M
# - Device: Shake gesture
```

#### React Native Debugger
```bash
# Install and connect
npm install -g react-devtools
react-devtools
```

#### Network Debugging
```javascript
// Enable network logs in development
if (__DEV__) {
  XMLHttpRequest = GLOBAL.originalXMLHttpRequest || XMLHttpRequest;
}
```

## Deployment

### Production Build
```bash
# Build for production
expo build:ios     # iOS App Store
expo build:android # Google Play Store
```

### Environment Configuration
```javascript
// app.config.js
export default {
  expo: {
    name: "Creator Engagement App",
    version: "1.0.0",
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000'
    }
  }
};
```

### Performance Monitoring
```javascript
// Add performance tracking
import { Performance } from 'expo-performance';

Performance.mark('app-start');
// ... app initialization
Performance.mark('app-ready');
Performance.measure('app-startup', 'app-start', 'app-ready');
```

## Best Practices

### Code Organization
- Keep components small and focused (< 200 lines)
- Use custom hooks for complex logic
- Implement proper TypeScript types
- Follow consistent naming conventions

### Performance
- Minimize re-renders with useMemo/useCallback
- Lazy load components not immediately visible
- Optimize images and assets
- Use FlatList for large datasets

### User Experience
- Provide loading states for all async operations
- Show meaningful error messages
- Implement offline functionality where possible
- Use haptic feedback for important actions

### Security
- Never store sensitive tokens in AsyncStorage
- Validate all user inputs
- Use HTTPS for all API calls
- Implement proper deep link validation

---

**Frontend Version**: 1.0.0  
**React Native**: 0.81.5  
**Expo SDK**: 54.0.0  
**Last Updated**: December 26, 2025