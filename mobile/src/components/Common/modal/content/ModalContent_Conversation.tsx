import { Image, ImageSourcePropType, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from '~/styles/Ui/colors'
import { Assets } from '~/styles/Ui/assets'
import { textStyle } from '~/styles/Ui/text'
import { isColor } from 'react-native-reanimated'

interface Item{
    id: number,
    icon: ImageSourcePropType,
    title: string
}
const ModalContent_Conversation = () => {
    const items: Item[] = [
        {id: 1, icon: Assets.icons.ghost_gray, title: 'Đánh dấu đã đọc' },
        {id: 2, icon: Assets.icons.ghost_gray, title: 'Đánh dấu đã đọc' },
        {id: 3, icon: Assets.icons.ghost_gray, title: 'Đánh dấu đã đọc' },
        {id: 4, icon: Assets.icons.ghost_gray, title: 'Đánh dấu đã đọc' },
        {id: 5, icon: Assets.icons.ghost_gray, title: 'Đánh dấu đã đọc' },
        {id: 6, icon: Assets.icons.ghost_gray, title: 'Đánh dấu đã đọc' },
        {id: 7, icon: Assets.icons.ghost_gray, title: 'Đánh dấu đã đọc' }
    ]
  return (
    <View style={{gap: 10, backgroundColor: colors.transparent}}>
    <View style={styles.itemContainer}>
        <Image source={Assets.images.demo} style= {{height: 50, width: 50, borderRadius: 40}}/>
        <View style={{flex: 1, }}>
            <Text style={[textStyle.body_lg,{}]}>nhan</Text>
            <Text style={[textStyle.body_lg,{color: colors.gray}]}>nhan</Text>
        </View>
    </View>
    <View style={styles.muneContainer}>
        {items.map((item)=>
        <View style={{flexDirection: 'row', gap: 10, alignItems: 'center', justifyContent: 'space-between'}}>
            <Image source={item.icon} style={{width: 30, height: 30}}/>
            <Text>{item.title}</Text>
        </View>)}
    </View>
    </View>
  )
}

export default ModalContent_Conversation

const styles = StyleSheet.create({
    itemContainer:{
        flexDirection: 'row',
        backgroundColor: colors.white,
        borderRadius: 10,
        padding: 5,
        gap: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    muneContainer:{
        width: 200,
        backgroundColor: colors.white,
        borderRadius: 10,
        padding: 10,
        gap: 20,
        justifyContent: 'space-between',
        alignItems: 'center',
    
    }
})