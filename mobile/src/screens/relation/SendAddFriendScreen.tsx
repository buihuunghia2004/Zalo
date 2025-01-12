import {StyleSheet} from 'react-native';
import {
  View,
  Text,
  Image,
  TextInput,
  Switch,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {MainNavProp, StackNames} from '~/routers/types';
import {useTypedRoute} from '~/hooks/userMainRoute';
import {colors} from '~/styles/Ui/colors';
import {Assets} from '~/styles/Ui/assets';
import AppButton from '~/components/Ui/Button';
import AppBar from '~/components/Common/AppBar';
import {relationApi} from '~/features/relation/relationService';
import {SendRequestReq} from '~/features/relation/relationDto';
import SimpleModal from '~/components/Common/modal/SimpleModal';
import { textStyle } from '~/styles/Ui/text';

const SendAddFriendScreen = () => {
  const mainNav = useNavigation<MainNavProp>();
  const route = useTypedRoute<typeof StackNames.SenAddFriendScreen>();
  const baseProfile = route.params.baseProfile;

  const [toastMessage, setToastMessage] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const showModal = () => {
    setModalVisible(true);
  };

  const handleSenReq = () => {
    const receiverId = baseProfile.id;
    const dto: SendRequestReq = {receiverId};
    relationApi
      .sendRequest(dto)
      .then(response => {
        showModal()
        showToast('Thêm số điện thoại tài khoản này vào danh bạ')
        console.log('Request sent successfully:', response);
      })
      .catch(error => {
        console.error('Failed to send request:', error);
      });
  };
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <AppBar
        title="Kết bạn"
        iconButtonLeft={['back']}
        onChangeInputText={text => console.log('Input changed:', text)}
        onPressInput={() => console.log('cc')}
        onPress={action => {
          switch (action) {
            case 'search':
              break;
            case 'bell':
              break;
            case 'setting':
              break;
          }
        }}
        style={{backgroundColor: colors.secondary_light}}
      />
      <View style={{padding: 15}}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <Image source={Assets.images.demo} style={styles.profileImage} />
          <View style={styles.profileDetails}>
            <Text style={styles.profileName}>Đặng Văn Đạt</Text>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editText}>Sửa</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Message Input */}
        <TextInput
          style={styles.messageInput}
          placeholderTextColor={colors.black}
          placeholder="Xin chào, mình là Nhân. Kết bạn với mình nhé!"
          maxLength={150}
          multiline
        />
        <Text style={styles.characterCount}>/150</Text>

        {/* Toggle Button */}
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Chặn xem nhật ký của tôi</Text>
          <Switch
            trackColor={{false: '#767577', true: '#81b0ff'}}
            thumbColor={'#f5dd4b'}
          />
        </View>
        <AppButton
          style={{borderRadius: 20, backgroundColor: colors.primary}}
          title="Gửi lời mời"
          onPress={handleSenReq}
        />
      </View>
      {/* Hiển thị Modal và Toast */}
      <SimpleModal
        toast="Đã gửi lời mời kết bạn thành công"
        title="Thông báo"
        textLeftButton="không"
        textRightButton="có"
        description="Thêm số điện thoại này vào danh bạ điện thoại"
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
      />
    </ScrollView>
  );
};

export default SendAddFriendScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  backText: {
    fontSize: 24,
    color: '#333',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  profileDetails: {
    marginLeft: 15,
  },
  profileName: {
    ...textStyle.body_md,
    fontWeight: 'bold'
  },
  editButton: {
    marginTop: 5,
  },
  editText: {
    fontSize: 16,
    color: '#007BFF',
  },
  messageInput: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    textAlignVertical: 'top',
    marginBottom: 10,
    fontSize: 16,
  },
  characterCount: {
    fontSize: 12,
    color: '#888',
    marginBottom: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  sendButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  sendButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});
