import {
  Image,
  ImageProps,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import React from 'react';
import {colors} from '../../styles/Ui/colors';
import {iconSize} from '../../styles/Ui/icons';
import {borderRadius, spacing} from '../../utils/Ui/dimensions';

interface ButtonProps {
  title?: string;
  onPress: () => void;
  disabled?: boolean;
  outline?: boolean;
  leftIcon?: ImageProps;
  rightIcon?: ImageProps;
  centerIcon?: ImageProps;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}
const AppButton: React.FC<ButtonProps> = ({
  title = '',
  onPress,
  disabled = false,
  outline,
  leftIcon,
  rightIcon,
  centerIcon,
  style,
  textStyle
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        disabled && styles.disabled,
        outline ? styles.outline : styles.solid,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}>
      {leftIcon && <Image source={leftIcon} style={iconSize.medium} />}
      {centerIcon ? (
        <Image source={centerIcon} style={iconSize.medium} />
      ) : (
        <Text style={[outline ? {color: colors.primary} : {color: colors.white}, textStyle]}>
          {title}
        </Text>
      )}

      {rightIcon && <Image source={rightIcon} style={iconSize.medium} />}
    </TouchableOpacity>
  );
};
export default AppButton;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },

  disabled: {
    opacity: 0.5,
  },
  solid: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.medium,
    paddingVertical: spacing.small,
    paddingHorizontal: spacing.small,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outline: {
    borderRadius: borderRadius.medium,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: spacing.small,
    paddingHorizontal: spacing.small,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
