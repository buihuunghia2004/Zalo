import React, { useState } from 'react';
import { View, Text, Pressable, Image, TextInput, TouchableOpacity, ViewStyle, ImageSourcePropType } from 'react-native';
import { viewStyle } from '../../styles/Ui/views';
import { colors } from '../../styles/Ui/colors';
import { Assets } from '../../styles/Ui/assets';
import { textStyle } from '../../styles/Ui/text';
import { Fonts } from '../../styles/Ui/fonts';
import { iconSize } from '../../styles/Ui/icons';

export type Actions =
  | 'find'
  | 'search'
  | 'back'
  | 'qr'
  | 'create'
  | 'add_friend'
  | 'add_post'
  | 'bell'
  | 'setting'
  | 'menu'
  | 'call'
  | 'video_call';

type AppBarProps = {
  title?: string;
  description?: string;
  iconButtonLeft?: Actions[];
  iconButtonRight?: Actions[];
  inputSearch?: boolean;
  onPress?: (action: Actions) => void;
  onPressInput?: () => void;
  onChangeInputText?: (text: string) => void;
  style?: ViewStyle;
};

const mapActionToIcon = (action: Actions): ImageSourcePropType => {
  switch (action) {
    case 'find': return Assets.icons.search_white;
    case 'search': return Assets.icons.search_white;
    case 'back': return Assets.icons.back_white;
    case 'qr': return Assets.icons.add_white;
    case 'create': return Assets.icons.add_white;
    case 'add_friend': return Assets.icons.add_user_white;
    case 'add_post': return Assets.icons.image_white;
    case 'bell': return Assets.icons.bell_white;
    case 'setting': return Assets.icons.setting_white;
    case 'menu': return Assets.icons.menu_white;
    case 'call': return Assets.icons.call_white;
    case 'video_call': return Assets.icons.video_white;
    default: return Assets.icons.add_user_white;
  }
};

const AppBar: React.FC<AppBarProps> = ({
  title,
  description,
  iconButtonLeft,
  iconButtonRight,
  inputSearch = null,
  onPress,
  onPressInput,
  onChangeInputText,
  style,
}) => {
  const [isEditing, setIsEditing] = useState(inputSearch);

  const renderIcons = (icons?: Actions[], position?: 'left' | 'right') => {
    if (!icons) return null;

    return icons.map((icon, index) => (
      <Pressable
        key={`${position}-${index}`}
        onPress={() => onPress && onPress(icon)}
        style={({ pressed }) => ({
          borderRadius: 50,
          backgroundColor: pressed ? 'rgba(255, 255, 255, 0.3)' : 'transparent',
          width: 45,
          height: 45,
          justifyContent: 'center',
          alignItems: 'center',
        })}
      >
        <Image style={iconSize.medium} source={mapActionToIcon(icon)} />
      </Pressable>
    ));
  };

  return (
    <View
      style={[
        viewStyle.container_row_between,
        {
          ...style,
          height: 55,
          paddingHorizontal: 10,
       
        },
      ]}
    >
      {/* Left Icons */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {renderIcons(iconButtonLeft, 'left')}
      </View>

      {/*Input */}
      {inputSearch!=null ? (
        <TouchableOpacity
          style={{ flex: 1, marginHorizontal: 10 }}
          onPress={onPressInput}
        >
          {isEditing ? (
            <TextInput
              style={{
                backgroundColor: 'white',
                borderRadius: 5,
                color: 'black',
                paddingHorizontal: 10,
                height: 34,
              }}
              placeholder="Tìm kiếm"
              onChangeText={(text) => onChangeInputText && onChangeInputText(text)}
            />
          ) : (
            <Text style={[textStyle.titleText, { opacity: 0.5 }]}>Tìm kiếm</Text>
          )}
        </TouchableOpacity>
      ) : (
        <View style={[viewStyle.container, {alignItems: 'flex-start', marginLeft: 10}]}>
          <Text style={[textStyle.titleText,{fontSize : description ? 12 :  15}]}>{title}</Text>
          {description && <Text style={{ opacity: 0.8, fontFamily: Fonts.roboto.regular, color: 'white', fontSize: 10 }}>{description}</Text>
        }
        </View>
      )}

      {/* Right Icons */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {renderIcons(iconButtonRight, 'right')}
      </View>
    </View>
  );
};

export default AppBar;
