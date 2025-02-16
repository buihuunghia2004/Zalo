import React from 'react';
import { FlatList, Pressable, Text, StyleSheet } from 'react-native';
import {emojiObjects} from '~/utils/Ui/emojis';


interface EmojiListProps {
  handleInputChange: (text: string) => void;
}

const EmojiList = React.memo(({ handleInputChange }: EmojiListProps) => {
  
  return (
    <FlatList
      data={emojiObjects}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <Pressable
          onPress={() => handleInputChange(item.image)}
          style={({ pressed }) => [
            styles.pressable,
            { backgroundColor: pressed ? 'rgba(24, 157, 252, 0.1)' : 'transparent' },
          ]}
        >
          <Text style={styles.emojiText}>{item.image}</Text>
        </Pressable>
      )}
      numColumns={7}
      initialNumToRender={7}
      maxToRenderPerBatch={7}
      windowSize={5}
      removeClippedSubviews={true}
    />
  );
});

const styles = StyleSheet.create({
  pressable: {
    width: 48,
    height: 48,
    alignItems: 'center',
    borderRadius: 50,
    justifyContent: 'center',
  },
  emojiText: {
    fontSize: 24,
  },
});

export default EmojiList;
