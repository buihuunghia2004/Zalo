import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import AppButton from '~/components/Ui/Button';
import {Relation} from '~/features/relation/dto/relation.dto.nested';
import {imagesStyle} from '~/styles/Ui/image';
import {textStyle} from '~/styles/Ui/text';
import {colors} from '~/styles/Ui/colors';
import {InviterTypeEnum} from '~/features/user/dto/user.enum';
import {Fonts} from '~/styles/Ui/fonts';
import {calculateElapsedTime} from '~/utils/Convert/timeConvert';
import {relationApi} from '~/features/relation/relationService';
import {useNavigation} from '@react-navigation/native';
import {MainNavProp, StackNames} from '~/routers/types';
import {
  RelationAction,
  RelationStatus,
} from '~/features/relation/dto/relation.dto.enum';
import {Assets} from '~/styles/Ui/assets';

export interface RequestItemProps {
  relation: Relation;
  itemOnPress: (id: string, status: RelationStatus) => void; 
}

const RequestItem = ({ relation, itemOnPress }: RequestItemProps) => {
  const mainNav = useNavigation<MainNavProp>();

  const [_send, _setSend] = useState<boolean>(true);
  const [_received, _setReceived] = useState<any>(null);
  

  useEffect(() => {    
    if (relation) {
      setOptionUi();
    }
  }, [relation]);

  const setOptionUi = () => {
    
    if (relation.inviter === InviterTypeEnum.SELF) {
      //defind
      if (relation.status === RelationStatus.PENDING) {
        _setSend(true);
      }
      //thu hồi
      else if (relation.status === RelationStatus.NOTTHING) {
        _setSend(false);
      }
    }
    //nếu là đã nhận
    else {
      //từ chối
      if (relation.status === RelationStatus.NOTTHING) {
        _setReceived(false);
      }
      //đồng ý
      else if (relation.status === RelationStatus.FRIEND) {
        _setReceived(true);
      }
      //defind
      else if (relation.status === RelationStatus.PENDING) {
        _setReceived(null);
      }
    }
  };
  const handleWithAction = (action: RelationAction) => {
    switch (action) {
      case RelationAction.ACCEPT:
        itemOnPress(relation.id, RelationStatus.FRIEND)
        _setReceived(true);

        mainNav.navigate(StackNames.OptionalFriendScreen, {
          baseProfile: relation.user,
        });
        break;

      case RelationAction.DECLINE:
        itemOnPress(relation.id, RelationStatus.NOTTHING)
        _setReceived(false);
        break;

      case RelationAction.REVOKE:
        itemOnPress(relation.id, RelationStatus.NOTTHING)
        _setSend(false);
        break;

      case RelationAction.SENT:
        itemOnPress(relation.id, RelationStatus.PENDING)
        _setSend(true);

        mainNav.navigate(StackNames.SenAddFriendScreen, {
          baseProfile: relation.user,
        });
        break;
    }
  };

  const handleItemOnpress = (action: RelationAction) => {
    const relationId = relation.id;
    const req = {relationId, action};

    relationApi.handleRequest(req).then(() => {
        handleWithAction(action)
      })
      .catch(error => {
        console.error('Error in handleSenReq:', error);
      });
  };

  const goChatScreen=()=>{
    mainNav.navigate(StackNames.ChatScreen, {userId: relation.user.id});
  }
  const handleMenuPress=()=>{

  }

  return (
    <View style={[styles.item, { backgroundColor: _received===null ?  undefined: colors.white }]}>
      {relation.inviter === InviterTypeEnum.SELF ? (
        <>
          <Image
            style={imagesStyle.avatar_50}
            source={{uri: relation.user.avatarUrl}}
          />
          <View style={styles.infoContainer}>
            <Text style={styles.username}>
              {relation.user?.username || 'No Username'}
            </Text>
            {relation.status === RelationStatus.NOTTHING ? (
              <Text>Đã thu hồi</Text>
            ) : (
              <>
                <Text style={textStyle.body_sm}>Tìm kiếm bằng email</Text>{' '}
                //phướng thức kết bạn thông qua
                <Text style={textStyle.body_sm}>
                  {calculateElapsedTime(relation.createdAt)}
                </Text>
              </>
            )}
          </View>
          <AppButton
            textStyle={[
              textStyle.body_sm,
              {fontFamily: Fonts.roboto.medium},
              relation.status === RelationStatus.NOTTHING
                ? {color: colors.white}
                : {color: colors.black},
            ]}
            title={relation.status === RelationStatus.NOTTHING ? 'kết bạn' : 'thu hồi'}
            style={_send ? styles.button : styles.buttonCalled}
            onPress={() =>
              handleItemOnpress(
                _send ? RelationAction.SENT : RelationAction.REVOKE,
              )
            }
          />
        </>
      ) : (
        <>
          <Image
            style={imagesStyle.avatar_50}
            source={{uri: relation.user.avatarUrl}}
          />
          <View style={styles.infoContainer}>
            {_received === null ? (
              <>
                <Text style={styles.username}>
                  {relation.user?.username || 'No Username'}
                </Text>
                <Text style={textStyle.body_sm}>
                  {calculateElapsedTime(relation.createdAt)} - Tìm kiếm bằng
                  email
                </Text>
              </>
            ) : (
              <View style={styles.infoContainerBack}>
                <View>
                  <Text style={styles.username}>
                    {relation.user?.username || 'No Username'}
                  </Text>
                  <Text>{_received ? 'Đã kết bạn' : 'Đã từ chối'}</Text>
                </View>
                <AppButton
                  textStyle={[textStyle.body_sm, {color: colors.secondary}]}
                  title={_received && 'Nhắn tin'}
                  style={_received ? styles.btnChat: styles.btnMenu}
                  centerIcon={!_received && Assets.icons.menu_row_gray}
                  onPress={_received ? goChatScreen: handleMenuPress }
                />
              </View>
            )}

            {_received == null && (
              <View style={styles.buttonsContainer}>
                <AppButton
                  textStyle={[textStyle.body_sm]}
                  title="Từ chối"
                  style={styles.button}
                  onPress={() => handleItemOnpress(RelationAction.DECLINE)}
                />
                <AppButton
                  textStyle={[textStyle.body_sm, {color: colors.white}]}
                  title="Đồng ý"
                  style={styles.buttonCalled}
                  onPress={() => handleItemOnpress(RelationAction.ACCEPT)}
                />
              </View>
            )}
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: colors.gray_light,
    alignItems: 'center',
    paddingHorizontal: 10
  },
  infoContainer: {
    marginLeft: 15,
    flex: 1,
    backgroundColor: colors.transparent,
    borderRadius: 5,
    padding: 10,
    justifyContent: 'center',
  },
  infoContainerBack: {
    flexDirection: 'row',
    marginVertical: 5,
    justifyContent: 'space-between',
    paddingRight: 5,
  },
  username: {
    ...textStyle.body_lg,
    fontWeight: '700',
  },
  buttonsContainer: {
    gap: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    width: '100%',
  },
  button: {
    flex: 1,
    height: 35,
    borderRadius: 20,
    width: '30%',
    backgroundColor: colors.secondary_transparent,
  },
  buttonCalled: {
    flex: 1,
    height: 35,
    borderRadius: 20,
    width: '30%',
    backgroundColor: colors.secondary,
  },
  btnMenu: {
    backgroundColor: colors.transparent,
    width: 40,
    height: 40,
  },
  btnChat:{
    backgroundColor: colors.secondary_transparent,
    width: 70,
    height: 40,
  }
});

export default RequestItem;
