import { StyleSheet } from "react-native";
import { textStyle } from "~/styles/Ui/text";
import { colors } from "~/styles/Ui/colors";

export const LoginScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
      },
      title:{
        ...textStyle.h1,
        fontSize: 30,
        justifyContent: 'center',
        color: colors.primary,
        textAlign: 'center',
      },
      textLogo: {
        ...textStyle.h1,
        color: colors.gray,
        textAlign: 'center',
        marginBottom: 24,
      },
      textTitle: {
        ...textStyle.h2,
        marginTop: 40,
        color: 'black',
        textAlign: 'center',
        marginBottom: 24,
      },
      inputContainer: {
        justifyContent: 'space-between',
      },
      checkBoxContainer: {
        flexDirection: 'row',
        marginTop: 24,
        marginBottom: 16,
        gap: 4,
        justifyContent: 'center',
      },
      checkBoxText: {
        ...textStyle.body_sm,
        color: colors.gray,
      },
      linkText: {
        ...textStyle.body_sm,
        color: colors.primary,
      },
      linkTextFooter: {
        ...textStyle.body_sm,
        color: colors.primary,
        textDecorationLine: 'underline',
      },
      lineContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 24,
        marginBottom: 26,
      },
      inputPositionStyle: {},
})