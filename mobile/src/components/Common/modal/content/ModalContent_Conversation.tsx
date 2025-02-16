import { Image, ImageSourcePropType, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from '~/styles/Ui/colors'
import { Assets } from '~/styles/Ui/assets'
import { textStyle } from '~/styles/Ui/text'
import { WINDOW_HEIGHT } from '~/utils/Ui/dimensions';

interface Item{
    id: number,
    icon: ImageSourcePropType,
    title: string
}
type PositionType = {pageY: number};

const ModalContent_Conversation:React.FC<PositionType> = ({pageY}) => {
    const items: Item[] = [
        {id: 1, icon: Assets.icons.ghost_gray, title: 'Đánh dấu đã đọc' },
        {id: 2, icon: Assets.icons.ghost_gray, title: 'Ghim' },
        {id: 3, icon: Assets.icons.ghost_gray, title: 'Tắt thông báo' },
        {id: 4, icon: Assets.icons.ghost_gray, title: 'Ẩn' },
        {id: 5, icon: Assets.icons.ghost_gray, title: 'Xóa' },
        {id: 6, icon: Assets.icons.ghost_gray, title: 'Bật bong bóng chat' },
        {id: 7, icon: Assets.icons.ghost_gray, title: 'Chọn nhiều' }
    ]
    const menuHeight = 370;
    const itemConvertationHeight = 60
    const gap = 20
    const menuPosition = pageY + itemConvertationHeight + menuHeight > WINDOW_HEIGHT
     ? pageY - menuHeight + gap
     : pageY + itemConvertationHeight+ gap;

  return (
    <View style={styles.container}>

        <View style={[styles.itemContainer, {top: pageY}]}>
            <Image source={Assets.images.demo} style= {{height: 50, width: 50, borderRadius: 40}}/>
            <View style={{flex: 1, }}>
                <Text style={[textStyle.body_lg,{}]}>nhan</Text>
                <Text style={[textStyle.body_sm,{color: colors.gray_weight}]}>[HÌnh ảnh]</Text>
            </View>
            <Text style={[textStyle.body_sm, {alignSelf: 'flex-start'}]}>4 giờ</Text>
        </View>

        <View style={[styles.menuContainer, { top: menuPosition }]}>
        {items.map((item)=>
            <View key={item.id} style={{flexDirection: 'row', gap: 16, alignItems: 'center', justifyContent: 'space-between'}}>
                <Image source={item.icon} style={{width: 30, height: 30}}/>
                <Text style={{flex: 1}}>{item.title}</Text>
            </View>)}
        </View>

    </View>
  )
}

export default ModalContent_Conversation

const styles = StyleSheet.create({
    container:{
        marginHorizontal: 15,
        backgroundColor: colors.transparent,
        flex: 1
    },
    itemContainer:{
        position: 'absolute',
        flexDirection: 'row',
        backgroundColor: colors.white,
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 10,
        gap: 15,
        justifyContent: 'center',
    },
    menuContainer:{
        width: 220,
        height: 370,
        backgroundColor: colors.white,
        borderRadius: 10,
        padding: 10,
        gap: 20,
        justifyContent: 'space-between',
        alignItems: 'center',
    
    }
})