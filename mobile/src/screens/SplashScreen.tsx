import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from '~/styles/Ui/colors'

export const SplashScreen = () => {
  return (
    <View style={{flex: 1}}>
      <Text style={{color: colors.primary, fontSize: 30, textAlign: 'center'}}>SplashScreen</Text>
    </View>
  )
}

const styles = StyleSheet.create({})