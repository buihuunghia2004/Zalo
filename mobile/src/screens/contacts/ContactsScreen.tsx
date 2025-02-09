import {View} from 'react-native';
import {MainNavProp} from '~/routers/types';
import {useNavigation} from '@react-navigation/native';
import AppBar from '../../components/Common/AppBar';
import ContactsTabNavigation from './tab/ContactTabNavigation';


const ContactsScreen: React.FC = () => {

  const mainNav = useNavigation<MainNavProp>();  
  
  return (
    <View style={{flex: 1}}>
      <AppBar
        style={{position: 'absolute', zIndex: 10}}
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
      <ContactsTabNavigation  />
    </View>
  );
};

export default ContactsScreen;

