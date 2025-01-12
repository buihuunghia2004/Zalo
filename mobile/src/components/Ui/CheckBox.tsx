// import {
//     Image,
//     StyleProp,
//     StyleSheet,
//     Text,
//     TouchableOpacity,
//     ViewStyle,
//   } from 'react-native';
//   import React, { useState } from 'react';
//   import {iconStyles} from '~/styles/ui/iconStyle';
//   import {textStyles} from '~/styles/ui/textStyle'

//   import {assets} from '~/styles/assets';
// import { colors } from '~/utils/ui/colors';
  
//   interface CheckBoxProps {
//     title?: string;
//     sub?: string;
//     onPress?: () => void;
//     onChange?: (checked: boolean) => void;
//     disabled?: boolean;
//     checked?: boolean;
//     positionStyle?: StyleProp<ViewStyle>;
//   }
//   const CheckBox: React.FC<CheckBoxProps> = ({
//     title,
//     sub,
//     onPress,
//     onChange,
//     disabled = false,
//     checked = false,
//     positionStyle,
//   }) => {
//     const [isChecked,setIsChecked] = useState<boolean>(checked);
//     const handlePress = () => {
//       if (!disabled) {
//         setIsChecked(!isChecked)
//         onChange?.(!checked);
//       }
//     };
//     return (
//       <TouchableOpacity
//         activeOpacity={1}
//         style={[CheckBoxStyle.container, positionStyle]}
//         onPress={handlePress}
//         disabled={disabled}>
//         <Image
//           source={isChecked ? assets.icon.checkBook : assets.icon.unCheckBook}
//           style={iconStyles.icon24}
//         />
//         {title && <Text style={CheckBoxStyle.text}>{title}</Text>}
//         {sub && <Text style={CheckBoxStyle.subText}>({sub})</Text>}
//       </TouchableOpacity>
//     );
//   };
//   export default CheckBox;

  
// export const CheckBoxStyle = StyleSheet.create({
//   container:{
//       flexDirection:'row',
//       alignItems:'center',
//       height:24,
//   },
//   text:{
//       ...textStyles.body_lg,
//       marginLeft:16,
//       color:'black',
//   },
//   subText:{
//       ...textStyles.body_sm,
//       color: colors.gray
//   }
  
// })
  