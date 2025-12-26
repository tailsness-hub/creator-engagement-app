import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Animated } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Layout } from '../../constants/Theme';
import Text from './Text';

/**
 * Modern Input Component
 * 
 * A flexible input component with floating labels and validation states
 */
const Input = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  helperText,
  variant = 'outlined',
  size = 'base',
  multiline = false,
  numberOfLines = 1,
  disabled = false,
  leftIcon,
  rightIcon,
  style,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [animatedValue] = useState(new Animated.Value(value ? 1 : 0));
  
  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };
  
  const handleBlur = () => {
    setIsFocused(false);
    if (!value) {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };
  
  const getInputStyle = () => {
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
      case 'filled':
        baseStyle.push(styles.filled);
        break;
      case 'underlined':
        baseStyle.push(styles.underlined);
        break;
      default:
        baseStyle.push(styles.outlined);
    }
    
    // State styles
    if (isFocused) {
      baseStyle.push(styles.focused);
    }
    
    if (error) {
      baseStyle.push(styles.error);
    }
    
    if (disabled) {
      baseStyle.push(styles.disabled);
    }
    
    // Multiline adjustments
    if (multiline) {
      baseStyle.push(styles.multiline);
    }
    
    return baseStyle;
  };
  
  const getContainerStyle = () => {
    const baseStyle = [styles.container];
    
    if (multiline) {
      baseStyle.push({ minHeight: Layout.inputHeight.lg * (numberOfLines || 1) });
    }
    
    return baseStyle;
  };
  
  const labelStyle = {
    position: 'absolute',
    left: leftIcon ? 48 : 16,
    top: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [size === 'lg' ? 20 : size === 'sm' ? 14 : 16, -8],
    }),
    fontSize: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [Typography.size.base, Typography.size.sm],
    }),
    color: error 
      ? Colors.error 
      : isFocused 
        ? Colors.primary 
        : Colors.text.secondary,
    backgroundColor: Colors.white,
    paddingHorizontal: 4,
    zIndex: 1,
  };
  
  return (
    <View style={getContainerStyle()}>
      {label && (
        <Animated.Text style={labelStyle}>
          {label}
        </Animated.Text>
      )}
      
      <View style={styles.inputContainer}>
        {leftIcon && (
          <View style={styles.leftIconContainer}>
            {leftIcon}
          </View>
        )}
        
        <TextInput
          style={[getInputStyle(), style]}
          value={value}
          onChangeText={onChangeText}
          placeholder={label ? undefined : placeholder}
          placeholderTextColor={Colors.text.tertiary}
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={!disabled}
          multiline={multiline}
          numberOfLines={numberOfLines}
          textAlignVertical={multiline ? 'top' : 'center'}
          {...props}
        />
        
        {rightIcon && (
          <View style={styles.rightIconContainer}>
            {rightIcon}
          </View>
        )}
      </View>
      
      {(error || helperText) && (
        <View style={styles.helperContainer}>
          <Text
            variant="caption"
            color={error ? 'error' : 'secondary'}
            style={styles.helperText}
          >
            {error || helperText}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.base,
  },
  
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  base: {
    flex: 1,
    fontSize: Typography.size.base,
    color: Colors.text.primary,
    fontWeight: Typography.weight.normal,
    paddingHorizontal: Spacing.base,
  },
  
  // Size variations
  sizeSmall: {
    height: Layout.inputHeight.sm,
    fontSize: Typography.size.sm,
    paddingHorizontal: Spacing.md,
  },
  sizeBase: {
    height: Layout.inputHeight.base,
  },
  sizeLarge: {
    height: Layout.inputHeight.lg,
    fontSize: Typography.size.lg,
    paddingHorizontal: Spacing.lg,
  },
  
  // Variant styles
  outlined: {
    borderWidth: 1,
    borderColor: Colors.border.light,
    borderRadius: BorderRadius.base,
    backgroundColor: Colors.white,
  },
  filled: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.base,
    borderBottomWidth: 2,
    borderBottomColor: Colors.border.medium,
  },
  underlined: {
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.medium,
    borderRadius: 0,
    paddingHorizontal: 0,
  },
  
  // State styles
  focused: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  error: {
    borderColor: Colors.error,
    borderWidth: 2,
  },
  disabled: {
    backgroundColor: Colors.gray[100],
    color: Colors.text.tertiary,
  },
  
  // Multiline
  multiline: {
    textAlignVertical: 'top',
    paddingTop: Spacing.md,
  },
  
  // Icon containers
  leftIconContainer: {
    paddingLeft: Spacing.base,
    paddingRight: Spacing.sm,
  },
  rightIconContainer: {
    paddingLeft: Spacing.sm,
    paddingRight: Spacing.base,
  },
  
  // Helper text
  helperContainer: {
    marginTop: Spacing.xs,
    marginHorizontal: Spacing.base,
  },
  helperText: {
    lineHeight: Typography.size.sm * 1.2,
  },
});

export default Input;