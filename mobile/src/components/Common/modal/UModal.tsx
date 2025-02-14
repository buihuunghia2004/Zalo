import React from "react";
import {
  Modal,
  View,
  StyleSheet,
  Pressable,
} from "react-native";
import { colors } from "~/styles/Ui/colors";

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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Nền tối mờ
  },
  modalContainer: {
    width: 300,
    backgroundColor: colors.transparent,
    padding: 20,
    borderRadius: 10,
  },
  content: {
    width: "100%", 
  },
});

export default UModal;
