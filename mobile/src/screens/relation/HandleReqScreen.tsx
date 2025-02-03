
import React, {useEffect, useState, useRef} from 'react';
import {View, Text, StyleSheet, Animated, Pressable} from 'react-native';
import {MainNavProp, StackNames} from '~/routers/types';
import {useNavigation} from '@react-navigation/native';
import {textStyle} from '../../styles/Ui/text';
import {colors} from '../../styles/Ui/colors';
import AppBar from '../../components/Common/AppBar';
import {WINDOW_WIDTH} from '../../utils/Ui/dimensions';
import {RelationAction, RelationStatus} from '~/features/relation/dto/relation.dto.enum';
import {relationApi} from '~/features/relation/relationService';
import {Relation} from '~/features/relation/dto/relation.dto.nested';
import RequestItem from './components/RequestItem'; 
import { viewStyle } from '~/styles/Ui/views';
import { Fonts } from '~/styles/Ui/fonts';

const HandleReqScreen = () => {
  const mainNav = useNavigation<MainNavProp>();

  const [sent, setSent] = useState<Relation[]>([]);
  const [received, setReceived] = useState<Relation[]>([]);

  const [activeTab, setActiveTab] = useState(0);

  const underlinePosition = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await relationApi.getRelations(RelationStatus.PENDING);

        const sentData = result.filter((item: Relation) => item.inviter === 'self');
        const receivedData = result.filter((item: Relation) => item.inviter !== 'self');

        setSent(sentData);
        setReceived(receivedData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const tabs = [
    {id: 0, label: 'Đã nhận', data: received},
    {id: 1, label: 'Đã gửi', data: sent},
  ];

  const handleTabPress = (index: number) => {
    setActiveTab(index);
    Animated.timing(underlinePosition, {
      toValue: index * (WINDOW_WIDTH / tabs.length),
      useNativeDriver: true,
      duration: 200,
    }).start();
  };

 

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <AppBar
        style={styles.appBar}
        title='Lời mới kết bạn'
        iconButtonLeft={['back']}
        iconButtonRight={['setting']}
        onPressInput={() => mainNav.navigate('SearchScreen')}
        onPress={(action) => {
          switch (action) {
            case 'back':              
              mainNav.goBack()
              break;
            case 'setting':
              break;
          }
        }}
      />

      <View style={viewStyle.container}>
        {/* Tabs */}
        <Animated.View style={styles.tabContainer}>
          {tabs.map(tab => (
            <Pressable key={tab.id} style={styles.tab} onPress={() => handleTabPress(tab.id)}>
              <Text style={[activeTab === tab.id && styles.activeText]}>{tab.label}</Text>
            </Pressable>
          ))}
          <Animated.View
            style={[
              styles.underline,
              {transform: [{translateX: underlinePosition}], width: WINDOW_WIDTH / tabs.length},
            ]}
          />
        </Animated.View>

        {/* Render các danh sách trong từng tab */}
        <View style={styles.contentContainer}>
          {tabs[activeTab].data.map((relation, index) => (
            <RequestItem
              key={index}
              relation={relation}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: colors.gray_light,
  },
  appBar: {
    backgroundColor: colors.secondary,
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  activeText: {
    ...textStyle.body_md,
    fontFamily: Fonts.roboto.medium,
    color: colors.secondary_dark,
    
  },
  underline: {
    position: 'absolute',
    bottom: -1,
    height: 1,
    backgroundColor: colors.secondary_dark,
  },
  contentContainer: {
    backgroundColor: colors.secondary_transparent,
  },

});

export default HandleReqScreen;
