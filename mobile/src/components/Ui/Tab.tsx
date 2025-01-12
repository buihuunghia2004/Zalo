// import {
//     Image,
//     StyleProp,
//     StyleSheet,
//     Text,
//     TouchableOpacity,
//     View,
//     ViewStyle,
//   } from 'react-native';
//   import React, {useEffect, useState} from 'react';
//   import {colors} from '~/utils/ui/colors';
//   import {assets} from '~/styles/assets';
// import { containerStyles } from '~/styles/globalStyles';
// import { textStyles } from '~/styles/ui/textStyle';
// import { iconStyles } from '~/styles/ui/iconStyle';

  
//   interface TabProps {
//     type: 'Navbar' | 'ModalTitle' | 'Register';
//     data: string[];
//     onItemPress?: (key: string) => void;
//     positionStyle?: StyleProp<ViewStyle>;
//   }
//   const Tab: React.FC<TabProps> = ({type, data,onItemPress}) => {
//     const [currentItem, setCurrentItem] = useState<string | null>(null);
//     const handleOnPress=(item:string)=>{
//       setCurrentItem(item)
//       if(onItemPress){
//         onItemPress(item)
//       }
//     }
//     useEffect(() => {
//       setCurrentItem(data[0]);
//     }, [type]);
//     return (
//       <View
//         style={
//           type == 'ModalTitle'
//             ? TabStyle.containerModal
//             : type == 'Register'
//             ? TabStyle.containerRegister
//             : TabStyle.containerNavbar
//         }>
//         {data.map((item, index) => (
//           <TouchableOpacity
//             key={index}
//             style={TabStyle.itemContainer}
//             onPress={() => handleOnPress(item)}>
//             <Text
//               style={[
//                 type == 'ModalTitle'
//                   ? TabStyle.textModalTitle
//                   : type == 'Register'
//                   ? TabStyle.textRegister
//                   : TabStyle.textNavbar,
//                 currentItem === item && {color: colors.primary},
//               ]}>
//               {item}
//             </Text>
//             <View
//               style={[
//                 TabStyle.line,
//                 currentItem === item && {backgroundColor: colors.primary},
//               ]}></View>
//           </TouchableOpacity>
//         ))}
//         {type == 'ModalTitle' && (
//           <View style={TabStyle.buttonClose}>
//             <Image
//               style={TabStyle.iconClose}
//               source={assets.icon.close_circle_inactive}
//             />
//             <View style={TabStyle.line}></View>
//           </View>
//         )}
//       </View>
//     );
//   };
//   export default Tab;

// const TabStyle = StyleSheet.create({  
//     containerModal: {  
//       ...containerStyles.containerRow,
//       maxHeight: 40,
//     },  
//     containerRegister: {  
//       ...containerStyles.containerRow,
//     },  
//     containerNavbar: {  
//       ...containerStyles.containerRow,
//       maxHeight: 20,  
//     },  
//     itemContainer: {  
//       flex: 1,  
//       alignItems: 'center',  
//       justifyContent: 'center',
//     },  
//     line: {  
//       height: 1,
//       backgroundColor: colors.gray,
//       width: '100%',
//       position:'absolute',
//       bottom:1
//     },  
//     textNavbar: {  
//       ...textStyles.body_sm,  
//     },  
//     textRegister: {  
//       ...textStyles.button_lg,  
//     },  
//     textModalTitle: {  
//       ...textStyles.button_lg,  
//     },
//     buttonClose:{
//       flex:2,
//       alignItems:'flex-end'
//     },
//     iconClose:{
//       ...iconStyles.icon24,
//       marginBottom:5,
//       marginHorizontal:10
//     }
//   });
  