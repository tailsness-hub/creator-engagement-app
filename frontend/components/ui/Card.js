import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius, Shadows } from '../../constants/Theme';

/**
 * Modern Card Component
 * 
 * A flexible card container with consistent styling and elevation
 */
const Card = ({
  children,
  variant = 'base',
  padding = 'base',
  margin = 'none',
  style,
  ...props
}) => {
  const getCardStyle = () => {
    const baseStyle = [styles.base];
    
    // Variant styles
    switch (variant) {
      case 'flat':
        baseStyle.push(styles.flat);
        break;
      case 'outlined':
        baseStyle.push(styles.outlined);
        break;
      case 'elevated':
        baseStyle.push(styles.elevated);
        break;
      case 'subtle':
        baseStyle.push(styles.subtle);
        break;
      default:
        baseStyle.push(styles.standard);
    }
    
    // Padding variations
    switch (padding) {
      case 'none':
        break;
      case 'sm':
        baseStyle.push(styles.paddingSmall);
        break;
      case 'lg':
        baseStyle.push(styles.paddingLarge);
        break;
      case 'xl':
        baseStyle.push(styles.paddingExtraLarge);
        break;
      default:
        baseStyle.push(styles.paddingBase);
    }
    
    // Margin variations
    switch (margin) {
      case 'sm':
        baseStyle.push(styles.marginSmall);
        break;
      case 'base':
        baseStyle.push(styles.marginBase);
        break;
      case 'lg':
        baseStyle.push(styles.marginLarge);
        break;
      default:
        // no margin
        break;
    }
    
    return baseStyle;
  };
  
  return (
    <View style={[getCardStyle(), style]} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.white,
  },
  
  // Variant styles
  standard: {
    ...Shadows.md,
  },
  flat: {
    // No shadow
    backgroundColor: Colors.background.secondary,
  },
  outlined: {
    borderWidth: 1,
    borderColor: Colors.border.light,
    ...Shadows.sm,
  },
  elevated: {
    ...Shadows.lg,
  },
  subtle: {
    backgroundColor: Colors.background.tertiary,
    ...Shadows.sm,
  },
  
  // Padding variations
  paddingSmall: {
    padding: Spacing.md,
  },
  paddingBase: {
    padding: Spacing.xl,
  },
  paddingLarge: {
    padding: Spacing['2xl'],
  },
  paddingExtraLarge: {
    padding: Spacing['3xl'],
  },
  
  // Margin variations
  marginSmall: {
    marginVertical: Spacing.sm,
  },
  marginBase: {
    marginVertical: Spacing.base,
  },
  marginLarge: {
    marginVertical: Spacing.xl,
  },
});

export default Card;