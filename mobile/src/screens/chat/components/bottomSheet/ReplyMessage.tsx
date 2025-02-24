import React, { forwardRef, useImperativeHandle, useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { colors } from "~/styles/Ui/colors";
import { iconSize } from "~/styles/Ui/icons";
import { Assets } from "~/styles/Ui/assets";
import { textStyle } from "~/styles/Ui/text";
import { useChatStore } from "~/stores/zustand/chat.store";

export interface ReplyMessageRef {
  show: (name: string, message: string) => void;
  hide: () => void;
}

const ReplyMessageComponent = forwardRef<ReplyMessageRef>((_, ref) => {
  const {setCurentMessageRepling} = useChatStore()
  const [isVisible, setIsVisible] = useState(false);
  const [senderName, setSenderName] = useState("");
  const [messageContent, setMessageContent] = useState("");

  // Dùng useImperativeHandle để tạo phương thức điều khiển từ cha
  useImperativeHandle(ref, () => ({
    show: (name, message) => {
      setSenderName(name);
      setMessageContent(message);
      setIsVisible(true);
    },
    hide: () => {
      setIsVisible(false)
    },
  }));

  if (!isVisible) return null;

  return (
    <View style={styles.replyContainer}>
      <View style={styles.replyIndicator}></View>
      <View style={{ flex: 1 }}>
        <Text style={textStyle.body_sm}>{senderName}</Text>
        <View style={{ flexDirection: "row" }}>
          <Text style={textStyle.body_md}>{messageContent}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => {
        setCurentMessageRepling(null)
        setIsVisible(false)
      }}>
        <Image source={Assets.icons.back_gray} style={iconSize.medium} />
      </TouchableOpacity>
    </View>
  );
});

export default React.memo(ReplyMessageComponent);

const styles = StyleSheet.create({
  replyContainer: {
    backgroundColor: "white",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    paddingRight: 20,
    borderBottomColor: colors.gray_light,
    borderBottomWidth: 1,
    marginBottom: 2,
  },
  replyIndicator: {
    backgroundColor: colors.secondary,
    width: 2,
    height: "100%",
    borderRadius: 10,
    marginHorizontal: 10,
  },
});
