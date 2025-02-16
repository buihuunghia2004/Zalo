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
      onRequestClose={onClose} // Đóng modal khi nhấn Back trên Android
    >
      {/* Bắt sự kiện nhấn vào nền để đóng modal */}
      <Pressable style={styles.overlay} onPress={onClose}>
        {/* Chặn sự kiện nhấn vào nội dung bị lan ra ngoài */}
        <View style={styles.modalContainer}>
          <Pressable onPress={() => {}} style={styles.content}>
            {content}
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    zIndex: 10,
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.transparent,
    borderRadius: 10,
  },
  content: {
    flex: 1,
  },
});

export default UModal;
