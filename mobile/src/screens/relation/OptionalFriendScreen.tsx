import {Image, StyleSheet, Switch, Text, View} from 'react-native';
import React, { useEffect, useState } from 'react';
import {viewStyle} from '~/styles/Ui/views';
import AppBar from '~/components/Common/AppBar';
import {colors} from '~/styles/Ui/colors';
import {imagesStyle} from '~/styles/Ui/image';
import {Assets} from '~/styles/Ui/assets';
import {textStyle} from '~/styles/Ui/text';
import AppButton from '~/components/Ui/Button';
import {useNavigation} from '@react-navigation/native';
import {MainNavProp} from '~/routers/types';
import SimpleModal from '~/components/Common/modal/SimpleModal';

const OptionalFriendScreen = () => {
  const mainNav = useNavigation<MainNavProp>();

    const [toastMessage, setToastMessage] = useState('');
    const [isModalVisible, setModalVisible] = useState(false);

  return (
    <View style={viewStyle.container}>
      <AppBar
        title="Tùy chọn bạn bè"
        iconButtonLeft={['back']}
        onPressInput={() => console.log('a')}
        onPress={mainNav.goBack}
        style={styles.appBar}
      />
      <View style={[viewStyle.container,{backgroundColor: colors.gray_light, gap: 6},]}>
        <View style={[viewStyle.container_row_between, styles.infoContainer]}>
          <Image style={imagesStyle.avatar_50} source={Assets.images.demo} />

          <View style={{justifyContent: 'flex-start', flex: 1}}>
            <Text>Nhân</Text>
            <Text>Vừa kết bạn</Text>
          </View>
        </View>
        <View style={styles.switchContainer}>
          <Text style={[textStyle.body_md]}>Chặn xem nhật ký của tôi</Text>
          <Switch
            trackColor={{false: colors.gray, true: colors.gray}}
            thumbColor={colors.secondary}
          />
        </View>
        <View style={{paddingHorizontal: 20}}>
          <AppButton
            title="Xong"
            style={{backgroundColor: colors.primary, borderRadius: 20}}
            onPress={mainNav.goBack}
          />
        </View>
      </View>
      <SimpleModal
        toast="Đồng ý kết bạn thành công"
        title="Thông báo"
        textLeftButton="không"
        textRightButton="có"
        description="Bạn vừa kết bạn với"
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

export default OptionalFriendScreen;

const styles = StyleSheet.create({
  appBar: {
    backgroundColor: colors.secondary,
  },
  switchContainer: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  infoContainer: {
    maxHeight: 80,
    backgroundColor: colors.white,
    display: 'flex',
    gap: 20,
    paddingHorizontal: 10,
  },
});
