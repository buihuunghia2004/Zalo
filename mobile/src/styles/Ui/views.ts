import { StyleSheet } from "react-native";
import { colors } from "./colors";

  export const viewStyle = StyleSheet.create({
    container: {
      flex: 1,
      display: 'flex',
    },
    container_row: {
      flex: 1,
      display: 'flex',
      flexDirection: 'row',
    },
    container_row_center: {
      flex: 1,
      display: 'flex',
      alignItems: "center",
      justifyContent: "center",
      flexDirection: 'row',
    },
    container_row_between: {
      flex: 1,
      display: 'flex',
      flexDirection: 'row',
      alignItems: "center",
      justifyContent: "space-between",
    },
    center: {
      display: 'flex',
      alignItems: "center",
      justifyContent: "center",
    },
    boder_full: {
      borderRadius: 40,
    },
    boder_medium: {
      borderRadius: 20,
    },
    boder_mall: {
      borderRadius: 10,
    },
    boder_with_primary: {
      borderWidth: 1,
      color: colors.primary
    },
    boder_with_gray: {
      borderWidth: 1,
      color: colors.gray_light
    },
  });
  