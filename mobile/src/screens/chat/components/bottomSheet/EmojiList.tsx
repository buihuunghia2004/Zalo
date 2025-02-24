import React, { useCallback } from 'react';
import { FlatList, Pressable, Text, StyleSheet } from 'react-native';
import { emojiObjects } from '~/utils/Ui/emojis';

interface EmojiListProps {
  onEmojisTextChange: (emoji: string) => void;
}

const EmojiList: React.FC<EmojiListProps> = React.memo(({ onEmojisTextChange }) => {
  const handleEmojiPress = useCallback((emoji: string) => {
    onEmojisTextChange(emoji);
  }, []);

  return (
    <FlatList
      data={emojiObjects}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <Pressable
          onPress={() => handleEmojiPress(item.image)}
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
      removeClippedSubviews
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
