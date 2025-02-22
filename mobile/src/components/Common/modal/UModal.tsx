import React from "react";
import {
  Modal,
  View,
  StyleSheet,
  Pressable,
} from "react-native";
import { colors } from "~/styles/Ui/colors";
import { WINDOW_HEIGHT, WINDOW_WIDTH } from "~/utils/Ui/dimensions";

interface UModalProps {
  visible: boolean;
  onClose: () => void;
  content: React.ReactNode;
}

const UModal: React.FC<UModalProps> = ({ visible, onClose, content }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose} 
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.modalContainer}>
          <Pressable >
            {content}
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.transparent,
    borderRadius: 10,
  },
});

export default UModal;
