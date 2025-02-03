import {StyleSheet, Text, View, Image, ScrollView} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {MainNavProp, StackNames} from '~/routers/types';
import AppBar from '~/components/Common/AppBar';
import {useTypedRoute} from '~/hooks/userMainRoute';
import {colors} from '~/styles/Ui/colors';
import {Assets} from '~/styles/Ui/assets';
import {imagesStyle} from '~/styles/Ui/image';
import {WINDOW_WIDTH} from '~/utils/Ui/dimensions';
import {
  BaseProfilePagram,
  ProfileOptions,
} from '~/routers/main/mainPagramTypes';
import {viewStyle} from '~/styles/Ui/views';
import AppButton from '~/components/Ui/Button';
import {textStyle} from '~/styles/Ui/text';

const ProfilePersonalScreen = () => {
  const mainNav = useNavigation<MainNavProp>();
  const route = useTypedRoute<typeof StackNames.ProfilePersonalScreen>();
  const profileData = route.params.profile;

  const option = profileData.options;

  const getIconsForOption = (option: ProfileOptions) => {
    switch (option) {
      case ProfileOptions.Friend:
        return ['message', 'call', 'unfriend'];
      case ProfileOptions.NotFriend:
        return ['addFriend', 'message'];
      case ProfileOptions.Self:
        return ['edit', 'settings'];
      default:
        return [];
    }
  };
  const handleSensReq = () => {
    mainNav.navigate(StackNames.SenAddFriendScreen, {
      baseProfile: profileData.user as BaseProfilePagram,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image
          source={Assets.images.demo}
          style={{width: '100%', height: 300, position: 'absolute'}}
        />

        <View style={styles.profileDetails}>
          <View style={{flex: 1, backgroundColor: colors.gray_light}}>
            <View style={styles.profileContainer}>
              <Image
                source={Assets.images.demo}
                style={imagesStyle.avatar_big}
              />
              <Text style={styles.username}>Nhân</Text>
            </View>

            <View
              style={{
                width: '100%',
                height: 200,
                marginTop: 100,
                paddingHorizontal: 25,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={textStyle.body_md}>
                Bạn chưa thể xem nhật kí của Nhân khi chưa là bạn bè
              </Text>
              <View
                style={[
                  viewStyle.container_row_between,
                  {paddingHorizontal: 35, gap: 10},
                ]}>
                <AppButton
                  style={{
                    backgroundColor: colors.secondary_light,
                    borderRadius: 20,
                  }}
                  leftIcon={Assets.icons.search_white}
                  title="Nhắn tin"
                  onPress={() => console.log('a')}
                />
                <AppButton
                  style={{
                    width: 60,
                    borderRadius: 20,
                    backgroundColor: colors.secondary,
                  }}
                  centerIcon={Assets.icons.add_white}
                  onPress={handleSensReq}
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <AppBar
        iconButtonLeft={['back']}
        // iconButtonRight={getIconsForOption(option) as Actions[]}
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
        style={styles.appBar}
      />
    </View>
  );
};

export default ProfilePersonalScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  appBar: {
    width: '100%',
    backgroundColor: colors.transparent,
    position: 'absolute',
    top: 0,
  },
  scrollContainer: {
    height: 1000,
    flexGrow: 1,
    paddingTop: 300,
  },
  profileContainer: {
    position: 'absolute',
    top: -60,
    alignItems: 'center',
    left: WINDOW_WIDTH / 2 - 60,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileDetails: {
    height: 700,
  },
  username: {
    marginBottom: 5,
    color: colors.black,
    fontSize: 24,
    fontWeight: 'bold',
  },
});
