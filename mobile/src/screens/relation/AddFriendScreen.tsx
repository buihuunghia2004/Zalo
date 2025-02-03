import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity } from "react-native";
import { Assets } from "../../styles/Ui/assets";
import { colors } from "../../styles/Ui/colors";
import { iconSize } from "../../styles/Ui/icons";
import { userApi } from "~/features/user/userService";
import { useNavigation } from "@react-navigation/native";
import { MainNavProp } from "~/routers/types";
import { ProfileOptions, ProfilePersonalPagram } from "~/routers/main/mainPagramTypes";

const AddFriendScreen = () => {

  const mainNav = useNavigation<MainNavProp>();

  const [email, setEmail] = useState('')
  
  const handleSenReq = () => {    
    userApi.searchUserByEmail(email)
      .then(data => { 
        
        const pagram: ProfilePersonalPagram = { ...data, options: ProfileOptions.NotFriend }; 
       
        mainNav.navigate('ProfilePersonalScreen', {profile: pagram});
        
        setEmail('');
      })
      .catch(error => {
        console.error('Error in handleSenReq:', error);
      });
  };
  

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={mainNav.goBack}>
          <Image style={iconSize.medium} source={Assets.icons.back_gray}/>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thêm bạn</Text>
      </View>

      {/* QR Code Section */}
      <View style={styles.qrCodeContainer}>
        <Text style={styles.qrTitle}>Nhận</Text>
        <Image
          style={styles.qrCodeImage}
          source={Assets.images.demo} 
        />
        <Text style={styles.qrDescription}>Quét mã để thêm bạn Zalo với tôi</Text>
      </View>

      {/* Input số điện thoại */}
      <View style={styles.inputContainer}>
        <TextInput
          value={email}
          onChangeText={(text)=>setEmail(text)}
          style={styles.input}
          keyboardType="email-address"
          placeholder="Email"
          placeholderTextColor={colors.gray}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSenReq}>
          <Image style={iconSize.medium} source={Assets.icons.birth_white}/>
        </TouchableOpacity>
      </View>

      {/* Các nút hành động */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton}>
        <Image style={iconSize.medium} source={Assets.icons.qr_primary}/>
        <Text style={styles.actionText}>Quét mã QR</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
        <Image style={iconSize.large} source={Assets.icons.contacts_primary}/>
        <Text style={styles.actionText}>Danh bạ máy</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
            <Image style={iconSize.medium} source={Assets.icons.friend_know}/>
          <Text style={styles.actionText}>Bạn bè có thể quen</Text>
        </TouchableOpacity>
      </View>

      {/* Ghi chú */}
      <Text style={styles.note}>
        Xem lời mời kết bạn đã gửi tại trang Danh bạ Zalo
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 16,
  },
  qrCodeContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  qrTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  qrCodeImage: {
    width: 150,
    height: 150,
    marginBottom: 8,
  },
  qrDescription: {
    fontSize: 14,
    color: "#555",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 24,
  },
  inputPrefix: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    color: colors.black
  },
  sendButton: {
    backgroundColor: "#007AFF",
    padding: 8,
    borderRadius: 4,
  },
  actions: {
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  actionText: {
    fontSize: 16,
    marginLeft: 8,
  },
  note: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
  },
});

export default AddFriendScreen;
