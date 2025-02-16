import { StyleSheet } from "react-native";
import { colors } from "./colors";
import { Fonts } from "./fonts";

export const textStyle = StyleSheet.create({
  messageText: {
    fontSize: 12,
    fontFamily: Fonts.NotoSans.regular,
    color: colors.black,
  },
  titleText: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: Fonts.NotoSans.regular,
    color: colors.white,
  },
  titleText_gray: {
    fontSize: 12,
    fontFamily: Fonts.NotoSans.regular,
    color: colors.white,
  },
  titleText_black_seen: {
    fontSize: 12,
    fontFamily: Fonts.NotoSans.regular,
    color: colors.black,
  },
  titleText_black_notSeen: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: Fonts.NotoSans.regular,
    color: colors.black,
  },

  description_seen: {
    fontSize: 11,
    fontFamily: Fonts.NotoSans.regular,
    color: colors.gray,
  },
  description_notSeen: {
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: Fonts.NotoSans.regular,
    color: colors.black,
  },
  description_missed: {
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: Fonts.NotoSans.regular,
    color: colors.red,
  },

  Notification: {
    position: 'relative',
    textAlign: 'center',
    fontFamily: Fonts.NotoSans.regular,
    borderColor: colors.white,
    color: colors.white,
    backgroundColor: colors.red,
    fontSize: 8,
    width: 22,
    height: 17,
    paddingHorizontal: 6,
    borderRadius: 20,
    borderWidth: 1.6
  },
  textTime: {
    fontSize: 10,
    fontFamily: Fonts.NotoSans.regular,
  },

  h1: {
    color: 'black',
    fontFamily: Fonts.NotoSans.regular,
    fontSize: 24,
    fontStyle: 'normal',
    fontWeight: '500',
  },
  h2: {
    color: 'black',
    fontFamily: Fonts.NotoSans.regular,
    fontSize: 20,
    fontStyle: 'normal',
    fontWeight: '500',
  },
  h3: {
    color: 'black',
    fontFamily: Fonts.NotoSans.regular,
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: 24,
  },
  h4: {
    color: 'black',
    fontFamily: Fonts.NotoSans.regular,
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '500',
  },
  body_xs: {
    color: 'black',
    fontFamily: Fonts.NotoSans.regular,
    fontSize: 10,
    fontStyle: 'normal',
    fontWeight: '300',
  },
  body_sm: {
    color: 'black',
    fontFamily: Fonts.NotoSans.regular,
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '300',
  },
  body_md: {
    color: 'black',
    fontFamily: Fonts.NotoSans.regular,
    fontSize: 14,
    fontWeight: '200',
  },
  body_lg: {
    color: 'black',
    fontFamily: Fonts.NotoSans.regular,
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '300',
  },
  button_sm: {
    color: 'black',
    fontFamily: Fonts.NotoSans.regular,
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '400',
  },
  button_lg: {
    color: 'black',
    fontFamily: Fonts.NotoSans.regular,
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
  },
  caption: {
    color: 'black',
    fontFamily: Fonts.NotoSans.regular,
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '500',
  }
});
