import { View, Text, Image, StyleSheet, FlatList, ScrollView } from 'react-native';
import React from 'react';
import { Assets } from '../../../styles/Ui/assets';
import { colors } from '../../../styles/Ui/colors';
import { viewStyle } from '../../../styles/Ui/views';
import { textStyle } from '../../../styles/Ui/text';
import { iconSize } from '../../../styles/Ui/icons';

const FriendTab = () => {
  const items = [
    { icon: Assets.icons.friend_white, label: 'Lời mời kết bạn' },
    { icon: Assets.icons.contract_list_white, label: 'Danh bạ máy' },
    { icon: Assets.icons.birth_white, label: 'Lịch sinh nhật' },
  ];
  const friends = [
    { id: '1', name: 'Friend 1', avatar: Assets.images.demo },
    { id: '2', name: 'Friend 2', avatar: Assets.images.demo },
    { id: '3', name: 'Friend 3', avatar: Assets.images.demo },
    { id: '4', name: 'Friend 4', avatar: Assets.images.demo },
    { id: '5', name: 'Friend 5', avatar: Assets.images.demo },
    { id: '6', name: 'Friend 6', avatar: Assets.images.demo },
    { id: '7', name: 'Friend 7', avatar: Assets.images.demo },
    { id: '8', name: 'Friend 8', avatar: Assets.images.demo },
    { id: '9', name: 'Friend 9', avatar: Assets.images.demo },
    { id: '10', name: 'Friend 10', avatar: Assets.images.demo },
    { id: '11', name: 'Friend 11', avatar: Assets.images.demo },
    { id: '12', name: 'Friend 12', avatar: Assets.images.demo },
    { id: '13', name: 'Friend 13', avatar: Assets.images.demo },
    { id: '14', name: 'Friend 14', avatar: Assets.images.demo },
    { id: '15', name: 'Friend 15', avatar: Assets.images.demo },
  ];

    const renderFriend = ({ item }: any) => (
      <View style={styles.itemRow}>
        <View style={[styles.iconContainer, {padding:1}]}>
          <Image source={item.avatar} style={iconSize.medium} />
        </View>
        <Text style={styles.text}>{item.name}</Text>
      </View>
    );
  

  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <View key={index} style={styles.itemRow}>
          <View style={styles.iconContainer}>
            <Image source={item.icon} style={styles.icon} />
          </View>
          <Text style={styles.text}>{item.label}</Text>
        </View>
      ))}
      
      <View style={{flex: 1, maxHeight: 4, backgroundColor: colors.gray_light}}></View>
      
      <View style={{ backgroundColor: 'white',margin: 10}}>
        <View style={[viewStyle.container_row, {gap: 10}]}>
          <Text style={[styles.chip, {backgroundColor: colors.gray_light, fontWeight: 'bold'}]}>Tất cả 10</Text>
          <Text style={styles.chip}>Mới truy cập 2</Text>
        </View>
      </View>

      <FlatList
        scrollEnabled={false}
        style={{marginTop: 30 }}
        data={friends}
        renderItem={renderFriend} 
        keyExtractor={(item) => item.id} 
      />
    </View>
  );
};

export default FriendTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    backgroundColor: 'white'
  },
  itemRow: {
    flexDirection: 'row', 
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 10
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.secondary_light, 
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15, 
  },
  icon: {
    ...iconSize.medium,
    resizeMode: 'contain',
  },
  text: {
    fontSize: 16,
    color: '#000', 
    textAlign: 'left',
  },

  chip: {
    ... textStyle.description_seen,
    color: colors.gray_weight,
    padding: 4,
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    height: 26,
  }
});
