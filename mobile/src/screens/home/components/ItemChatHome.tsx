import {View, Text, Image, ImageSourcePropType, TextStyle, Pressable} from 'react-native';
import React from 'react';
import {viewStyle} from '../../../styles/Ui/views';
import {colors} from '../../../styles/Ui/colors';
import {Assets} from '../../../styles/Ui/assets';
import {imagesStyle} from '../../../styles/Ui/image';
import {textStyle} from '../../../styles/Ui/text';
import { iconSize } from '../../../styles/Ui/icons';
import GroupAvatar from '~/components/Common/GroupAvatar';


type DiscriptionType =
  | 'text'
  | 'image'
  | 'file'
  | 'video'
  | 'voice'
  | 'card'
  | 'location'
  | 'call_send'
  | 'call_receive'
  | 'call_missed'
  | 'video_send'
  | 'video_receive'
  | 'video_missed';

interface DescriptionDetail {
  label: string;
  icon: ImageSourcePropType | null;
  TextStyle?: TextStyle;
}

export type Discription = {
  sender?: String;
  message?: String;
  kind?: DiscriptionType;
};

type Props = {
  id: string,
  roomAvatarUrl?: string;
  roomAvatarUrls: string[];
  name: string;
  description?: Discription;
  time?: string;
  notSeen?: number;
  isLike?: boolean;
  onPress?: () => void;
  onLongPress?: ()=> void
};

const MyComponent: React.FC<Props> = ({
  id,
  roomAvatarUrl,
  roomAvatarUrls,
  name,
  description,
  time,
  notSeen,
  isLike = false,
  onPress,
  onLongPress
}) => {

  const descriptionType: Record<DiscriptionType, DescriptionDetail> = {
    text: {label: '', icon: null},
    image: {label: '[Hình ảnh]', icon: null},
    file: {label: '[File]', icon: null},
    video: {label: '[Video]', icon: null},
    voice: {label: '[Tin nhắn thoại]', icon: null},
    card: {label: '[Danh thiếp]', icon: null},
    location: {label: '[Vị Trí]', icon: null},
    call_send: {label: 'Cuộc gọi thoại đi',TextStyle: textStyle.description_seen, icon: Assets.icons.call_send_gray},
    call_receive: {label: 'Cuộc gọi thoại đến',TextStyle: textStyle.description_seen,  icon: Assets.icons.call_receive_gray},
    call_missed: {
      label: 'Cuộc gọi thoại nhỡ',
      TextStyle:  notSeen && notSeen > 0  ? textStyle.description_missed : textStyle.description_seen,
      icon: notSeen && notSeen > 0 ? Assets.icons.call_x_red : Assets.icons.call_x_gray
    },
    video_send: {label: 'Cuộc gọi video đi',TextStyle: textStyle.description_seen, icon: Assets.icons.video_send_gray},
    video_receive: {label: 'Cuộc gọi video đến',TextStyle: textStyle.description_seen , icon: Assets.icons.video_receive_gray},
    video_missed: {
      label: 'Cuộc gọi video nhỡ',
      TextStyle: notSeen ? textStyle.description_missed : textStyle.description_seen,
      icon: notSeen && notSeen > 0 ? Assets.icons.video_x_red : Assets.icons.video_x_gray
    },
  };

  const currentDescription = descriptionType[description?.kind || 'text'];
  const call_or_video = description?.kind?.split('_')[0];

  return (
    <Pressable
      onLongPress={onLongPress}
      onPress={onPress}
      style={({ pressed }) => ([ viewStyle.container_row_center,{
        height: 76,
        gap: 10,
        paddingLeft: 16,
        alignItems: 'center',
        backgroundColor: pressed ? 'rgba(0, 0, 0, 0.03)' : 'transparent'
      }])}
     >
      {roomAvatarUrl ? 
            <Image style={imagesStyle.avatar_50} source={{ uri: roomAvatarUrl }} />
            :
            <GroupAvatar roomAvatarUrls={roomAvatarUrls}/>
      }


      <View
        style={[
          {
            flex: 1,
            flexDirection: 'row',
            height: '100%',
            borderBottomWidth: 0.4,
            paddingVertical: isLike ? 8 : 18,
            marginLeft: 10,
            borderBottomColor: colors.gray_light,
          },
        ]}>
{/* Title */}
        <View style={{flex: 1}}>
          <Text
            style={
              notSeen && notSeen > 0
                ? textStyle.titleText_black_notSeen
                : textStyle.titleText_black_seen
            }>
            {name}
          </Text>

{/* Description */}
          <View
            style={[viewStyle.container_row, {gap: 5, alignItems: 'flex-end'}]}>
            {description?.kind == 'text'
              ? null
              : currentDescription.icon != null && (
                  <Image
                    source={currentDescription.icon}
                    style={iconSize.small}
                  />
                )}
            <Text
              style={
                currentDescription.TextStyle ? currentDescription.TextStyle : (
                  notSeen && notSeen > 0
                  ? textStyle.description_notSeen
                  : textStyle.description_seen
                )
              }>
              {description?.kind == 'text'
                ? description?.message
                : currentDescription.label}
            </Text>
          </View>
{/* like */}
          {isLike && (
            <View
              style={[
                viewStyle.container_row,
                {gap: 5, alignItems: 'flex-end'},
              ]}>
              <Image
                source={Assets.icons.heart}
                style={[iconSize.small]}
              />
              <Text style={[textStyle.description_seen, {color: colors.gray_icon}]}>{name}</Text>
            </View>
          )}
        </View>

        {currentDescription.icon == null ? (
           <View style={[{height: '100%', maxWidth: 50}, viewStyle.container]}>
            <Text
              style={
                notSeen && notSeen > 0
                  ? {fontSize: 10, color: colors.black}
                  : {fontSize: 10, color: colors.gray}
              }>
              {time}
            </Text>
            {notSeen && notSeen > 0 && (
              <Text style={[textStyle.Notification, {left: 5}]}>{notSeen}</Text>
            )}
         </View>
        ):(
          <Pressable
          style={{
            backgroundColor: colors.primary_light,
            width: 40,
            height: 40,
            borderRadius: 40,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 10,
          }}>
          {call_or_video === 'call' ? (
            <Image source={Assets.icons.call_blue} style={iconSize.small} />
          ) : (
            <Image source={Assets.icons.video_blue} style={iconSize.small} />
          )}
        </Pressable>
        
        )
        }
      </View>
    </Pressable>
  );
};

export default MyComponent;
