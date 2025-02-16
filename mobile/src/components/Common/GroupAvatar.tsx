import React from "react";
import { View, Image, StyleSheet, Text } from "react-native";

interface GroupAvatarProps {
  roomAvatarUrls: string[];
}

const GroupAvatar: React.FC<GroupAvatarProps> = ({ roomAvatarUrls }) => {
  const maxAvatars = 4;
  const displayedAvatars = roomAvatarUrls.slice(0, maxAvatars);

  return (
    <View style={styles.container}>
      {displayedAvatars.map((uri, index) => (
        <Image key={index} source={{ uri }} style={[styles.avatar, getPosition(index)]} />
      ))}
      {roomAvatarUrls.length > maxAvatars && (
        <View style={[styles.moreAvatar, getPosition(maxAvatars - 1)]}>
          <Text style={styles.moreText}>+{roomAvatarUrls.length - maxAvatars}</Text>
        </View>
      )}
    </View>
  );
};

// Hàm tính toán vị trí của ảnh dựa trên index
const getPosition = (index: number) => {
  const positions = [
    { top: 0, left: 0 },
    { top: 0, right: 10 },
    { bottom: 0, left: 0 },
    { bottom: 0, right: 0 },
  ];
  return positions[index] || {};
};

const styles = StyleSheet.create({
  container: {
    width: 48,
    height: 48,
    position: "relative",
  },
  avatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    position: "absolute",
    borderWidth: 1.5,
    borderColor: "#fff",
  },
  moreAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    borderWidth: 1.5,
    borderColor: "#fff",
  },
  moreText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
});

export default GroupAvatar;
