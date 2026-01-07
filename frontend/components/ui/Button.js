import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows, Layout } from '../../constants/Theme';

/**
 * Modern Button Component
 * 
 * A highly customizable button component following the design system
 */
const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'base',
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
  ...props
}) => {
  const getButtonStyle = () => {
    const baseStyle = [styles.base];
    
    // Size variations
    switch (size) {
      case 'sm':
        baseStyle.push(styles.sizeSmall);
        break;
      case 'lg':
        baseStyle.push(styles.sizeLarge);
        break;
      default:
        baseStyle.push(styles.sizeBase);
    }
    
    // Variant styles
    switch (variant) {
      case 'secondary':
        baseStyle.push(styles.secondary);
        break;
      case 'outline':
        baseStyle.push(styles.outline);
        break;
      case 'ghost':
        baseStyle.push(styles.ghost);
        break;
      case 'success':
        baseStyle.push(styles.success);
        break;
      case 'warning':
        baseStyle.push(styles.warning);
        break;
      case 'error':
        baseStyle.push(styles.error);
        break;
      default:
        baseStyle.push(styles.primary);
    }
    
    // Disabled state
    if (disabled || loading) {
      baseStyle.push(styles.disabled);
    }
    
    return baseStyle;
  };
  
  const getTextStyle = () => {
    const baseTextStyle = [styles.text];
    
    // Size text variations
    switch (size) {
      case 'sm':
        baseTextStyle.push(styles.textSmall);
        break;
      case 'lg':
        baseTextStyle.push(styles.textLarge);
        break;
      default:
        baseTextStyle.push(styles.textBase);
    }
    
    // Variant text styles
    switch (variant) {
      case 'outline':
      case 'ghost':
        baseTextStyle.push(styles.textColored);
        break;
      default:
        baseTextStyle.push(styles.textWhite);
    }
    
    if (disabled || loading) {
      baseTextStyle.push(styles.textDisabled);
    }
    
    return baseTextStyle;
  };
  
  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {loading && (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outline' || variant === 'ghost' ? Colors.primary : Colors.white}
          style={styles.loader}
        />
      )}
      {icon && !loading && icon}
      <Text style={[getTextStyle(), textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: BorderRadius.base,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    ...Shadows.base,
  },
  
  // Size variations
  sizeSmall: {
    height: Layout.buttonHeight.sm,
    paddingHorizontal: Spacing.md,
  },
  sizeBase: {
    height: Layout.buttonHeight.base,
    paddingHorizontal: Spacing.xl,
  },
  sizeLarge: {
    height: Layout.buttonHeight.lg,
    paddingHorizontal: Spacing['2xl'],
  },
  
  // Variant styles
  primary: {
    backgroundColor: Colors.primary,
  },
  secondary: {
    backgroundColor: Colors.secondary,
  },
  outline: {
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  success: {
    backgroundColor: Colors.success,
  },
  warning: {
    backgroundColor: Colors.warning,
  },
  error: {
    backgroundColor: Colors.error,
  },
  
  // Disabled state
  disabled: {
    backgroundColor: Colors.gray[300],
    shadowOpacity: 0,
    elevation: 0,
  },
  
  // Text styles
  text: {
    fontWeight: Typography.weight.semibold,
    textAlign: 'center',
  },
  textSmall: {
    fontSize: Typography.size.sm,
  },
  textBase: {
    fontSize: Typography.size.base,
  },
  textLarge: {
    fontSize: Typography.size.lg,
  },
  textWhite: {
    color: Colors.white,
  },
  textColored: {
    color: Colors.primary,
  },
  textDisabled: {
    color: Colors.gray[500],
  },
  
  // Loading indicator
  loader: {
    marginRight: Spacing.sm,
  },
});

export default Button;