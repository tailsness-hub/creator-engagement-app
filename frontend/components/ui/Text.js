import React from 'react';
import { Text as RNText, StyleSheet } from 'react-native';
import { Colors, Typography } from '../../constants/Theme';

/**
 * Modern Text Component
 * 
 * A text component with predefined styles following the design system
 */
const Text = ({
  children,
  variant = 'body',
  color = 'primary',
  weight = 'normal',
  align = 'left',
  style,
  ...props
}) => {
  const getTextStyle = () => {
    const baseStyle = [styles.base];
    
    // Variant styles (size and line height)
    switch (variant) {
      case 'display':
        baseStyle.push(styles.display);
        break;
      case 'title':
        baseStyle.push(styles.title);
        break;
      case 'heading':
        baseStyle.push(styles.heading);
        break;
      case 'subheading':
        baseStyle.push(styles.subheading);
        break;
      case 'body':
        baseStyle.push(styles.body);
        break;
      case 'caption':
        baseStyle.push(styles.caption);
        break;
      case 'small':
        baseStyle.push(styles.small);
        break;
      default:
        baseStyle.push(styles.body);
    }
    
    // Color variations
    switch (color) {
      case 'primary':
        baseStyle.push(styles.colorPrimary);
        break;
      case 'secondary':
        baseStyle.push(styles.colorSecondary);
        break;
      case 'tertiary':
        baseStyle.push(styles.colorTertiary);
        break;
      case 'inverse':
        baseStyle.push(styles.colorInverse);
        break;
      case 'success':
        baseStyle.push(styles.colorSuccess);
        break;
      case 'warning':
        baseStyle.push(styles.colorWarning);
        break;
      case 'error':
        baseStyle.push(styles.colorError);
        break;
      case 'brand':
        baseStyle.push(styles.colorBrand);
        break;
      default:
        baseStyle.push(styles.colorPrimary);
    }
    
    // Weight variations
    switch (weight) {
      case 'light':
        baseStyle.push(styles.weightLight);
        break;
      case 'normal':
        baseStyle.push(styles.weightNormal);
        break;
      case 'medium':
        baseStyle.push(styles.weightMedium);
        break;
      case 'semibold':
        baseStyle.push(styles.weightSemibold);
        break;
      case 'bold':
        baseStyle.push(styles.weightBold);
        break;
      default:
        baseStyle.push(styles.weightNormal);
    }
    
    // Text alignment
    switch (align) {
      case 'left':
        baseStyle.push(styles.alignLeft);
        break;
      case 'center':
        baseStyle.push(styles.alignCenter);
        break;
      case 'right':
        baseStyle.push(styles.alignRight);
        break;
      default:
        baseStyle.push(styles.alignLeft);
    }
    
    return baseStyle;
  };
  
  return (
    <RNText style={[getTextStyle(), style]} {...props}>
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  base: {
    fontFamily: Typography.family.regular,
  },
  
  // Variant styles
  display: {
    fontSize: Typography.size['5xl'],
    lineHeight: Typography.size['5xl'] * Typography.lineHeight.tight,
    fontWeight: Typography.weight.bold,
  },
  title: {
    fontSize: Typography.size['4xl'],
    lineHeight: Typography.size['4xl'] * Typography.lineHeight.tight,
    fontWeight: Typography.weight.bold,
  },
  heading: {
    fontSize: Typography.size['3xl'],
    lineHeight: Typography.size['3xl'] * Typography.lineHeight.tight,
    fontWeight: Typography.weight.semibold,
  },
  subheading: {
    fontSize: Typography.size['2xl'],
    lineHeight: Typography.size['2xl'] * Typography.lineHeight.normal,
    fontWeight: Typography.weight.semibold,
  },
  body: {
    fontSize: Typography.size.base,
    lineHeight: Typography.size.base * Typography.lineHeight.normal,
  },
  caption: {
    fontSize: Typography.size.sm,
    lineHeight: Typography.size.sm * Typography.lineHeight.normal,
  },
  small: {
    fontSize: Typography.size.xs,
    lineHeight: Typography.size.xs * Typography.lineHeight.normal,
  },
  
  // Color styles
  colorPrimary: {
    color: Colors.text.primary,
  },
  colorSecondary: {
    color: Colors.text.secondary,
  },
  colorTertiary: {
    color: Colors.text.tertiary,
  },
  colorInverse: {
    color: Colors.text.inverse,
  },
  colorSuccess: {
    color: Colors.success,
  },
  colorWarning: {
    color: Colors.warning,
  },
  colorError: {
    color: Colors.error,
  },
  colorBrand: {
    color: Colors.primary,
  },
  
  // Weight styles
  weightLight: {
    fontWeight: Typography.weight.light,
  },
  weightNormal: {
    fontWeight: Typography.weight.normal,
  },
  weightMedium: {
    fontWeight: Typography.weight.medium,
  },
  weightSemibold: {
    fontWeight: Typography.weight.semibold,
  },
  weightBold: {
    fontWeight: Typography.weight.bold,
  },
  
  // Alignment styles
  alignLeft: {
    textAlign: 'left',
  },
  alignCenter: {
    textAlign: 'center',
  },
  alignRight: {
    textAlign: 'right',
  },
});

export default Text;