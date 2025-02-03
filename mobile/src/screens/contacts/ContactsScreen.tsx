import {useRef} from 'react';
import {
  View,
  StyleSheet,
  Animated,
} from 'react-native';
import {MainNavProp} from '~/routers/types';
import {useNavigation} from '@react-navigation/native';
import {colors} from '../../styles/Ui/colors';
import AppBar from '../../components/Common/AppBar';
import {Fonts} from '~/styles/Ui/fonts';
import ContactsTabNavigation from './tab/ContactTabNavigation';

const ContactsScreen = () => {
  
  const mainNav = useNavigation<MainNavProp>();
  const tabsPosition = useRef(new Animated.Value(0)).current;

  return (
    <View style={{flex: 1}}>
      <AppBar
        iconButtonLeft={['search']}
        iconButtonRight={['add_friend']}
        inputSearch={false}
        onPressInput={() => mainNav.navigate('SearchScreen')}
        onPress={action => {
          switch (action) {
            case 'add_friend':
              mainNav.navigate('AddFriendScreen');
              break;
            case 'back':
              mainNav.goBack;
              break;
            case 'setting':
              break;
          }
        }}
      />

      <View>
        {/* Tabs */}
        <Animated.View
          style={[
            styles.tabContainer,
            {transform: [{translateY: tabsPosition}]},
          ]}>
        </Animated.View>
      </View>
      <ContactsTabNavigation />
    </View>
  );
};

export default ContactsScreen;

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: colors.gray_light,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  activeText: {
    fontWeight: 'bold',
    fontFamily: Fonts.roboto.regular,
    color: colors.secondary_dark,
  },
  underline: {
    position: 'absolute',
    bottom: -1,
    height: 2,
    backgroundColor: colors.primary_icon,
  },
});
