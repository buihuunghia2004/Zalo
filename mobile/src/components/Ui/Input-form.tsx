import { Image, ImageProps, StyleProp, StyleSheet, Text, TextInput, TouchableOpacity, View, ViewStyle } from 'react-native'
import React, { useEffect, useState } from 'react'
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useSharedValue } from 'react-native-reanimated';
import { Assets } from '../../styles/Ui/assets';
import { iconSize } from '../../styles/Ui/icons';
import { colors } from '../../styles/Ui/colors';


interface Props {
  value?: string,
  placeholder?: string,
  leftIcon?: ImageProps,
  rightIcon?:ImageProps,
  clearIcon?: boolean,
  isPassword?: boolean,
  isError?: boolean,
  textError?: string,
  disable?: boolean,
  onFocus?: (e: any) => void;  
  onBlur?: (e: any) => void;   
  onChangeText: (text: string) => void;
  positionStyle?:StyleProp<ViewStyle>
}
interface State {
  state: string,
  style: StyleProp<any>,
  icon: ImageProps
}

const AppInput: React.FC<Props> = (props) => {
  const INACTIVE: State = { state: 'inactive', style: styles.inactive, icon: Assets.icons.back_gray }
  const FOCUSED: State = { state: 'foucused', style: styles.foucused, icon: Assets.icons.back_gray }
  const DISABLE: State = { state: 'disable', style: styles.disable, icon: Assets.icons.back_gray }
  const ERROR: State = { state: 'error', style: styles.error, icon: Assets.icons.back_gray}
  const {isError = false, textError = '', disable = false} = props
  const [state, setState] = useState<State>(INACTIVE)
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false)
  const translateX = useSharedValue(30);
  const translateY = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value }
      ],
    };
  });
  useEffect(() => {
    if (state.state === INACTIVE.state && props.value === '') {
      console.log(props.value);
      translateX.value = withTiming(20, { duration: 300 });
      translateY.value = withTiming(26, { duration: 300 });
    } else if (state.state === FOCUSED.state) {
      translateX.value = withTiming(0, { duration: 300 });
      translateY.value = withTiming(0, { duration: 300 });
    }
  }, [state])

  return (
    <View style={[props.positionStyle]}>
      <View style={[
        styles.containerInput,
        state.style,
        disable ? DISABLE.style : isError ? ERROR.style : state.style
      ]}>
        {props.leftIcon && <Image source={props.leftIcon} style={iconSize.large} />}
        <TextInput
          value={props.value}
          onChangeText={props.onChangeText}
          style={styles.input}
          editable={!disable}
          secureTextEntry={props.isPassword && !isShowPassword}
          onFocus={() => { setState(FOCUSED) }}
          onBlur={() => { setState(INACTIVE) }}
        />
        <TouchableOpacity onPress={props.isPassword ? () => setIsShowPassword(!isShowPassword) : () => props.onChangeText('')}>
          {props.isPassword &&
            <Image source={isShowPassword ? Assets.icons.eye_open : Assets.icons.eye_slash} style={iconSize.medium} /> 
          }
        </TouchableOpacity>
      </View>
      {isError && props.placeholder && !disable && <Text style={[styles.textError]}>{textError}</Text>}
       <Animated.Text style={[
        styles.label,
        animatedStyle,
        styles.labelBackground,
        disable ? DISABLE.style : isError ? ERROR.style : state.style
      ]}>{props.placeholder}</Animated.Text>
    </View>
  )
}

export default AppInput

const styles = StyleSheet.create({
   
      containerInput: {
        flexDirection: 'row',
        height: 50,
        maxHeight: 50,
        paddingHorizontal: 12,
        borderRadius: 14,
        borderWidth: 1,
        alignItems: 'center',
        backgroundColor: colors.white
      },
      input: {
        flex: 1,
        height: 45,
        color: colors.black,
        paddingHorizontal: 10
      },
      textError:{
        color: 'red'
      },
      inactive: {
        color: colors.gray,
        borderColor: colors.primary,
      },
      foucused: {
        color: colors.primary,
        borderColor: colors.primary,
      },
      disable: {
        color: colors.gray,
        borderColor: colors.gray,
        opacity: 0.5
      },
      error: {
        color: 'red',
        borderColor: 'red',
      },
      label:{
        // ...textStyles.body_sm,
        position: 'absolute',
        top: -10,
        paddingHorizontal: 5,
        borderRadius: 6,
        color: colors.primary
      },
      labelBackground:{
        backgroundColor: colors.white,
      },
      labelColor:{
        color: colors.primary
      }
})
