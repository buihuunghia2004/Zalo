import React, {
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  Modal,
  View,
  StyleSheet,
  Pressable,
} from "react-native";
import { colors } from "~/styles/Ui/colors";
import { WINDOW_HEIGHT, WINDOW_WIDTH } from "~/utils/Ui/dimensions";

export interface UModalRef {
  open: (content: React.ReactNode) => void; 
  close: () => void;
}

const UModal = forwardRef<UModalRef>(({},ref) => {  
  const [visible, setVisible] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);

  useImperativeHandle(ref, () => ({
    open: (content) => {
      setModalContent(content);
      setVisible(true);
    },
    close: () => setVisible(false),
  }));

  const handleClose = () => {
    setVisible(false);
  };

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={handleClose}
    >
      <Pressable style={styles.overlay} onPress={handleClose}>
        <View style={styles.modalContainer}>
          <Pressable>{modalContent}</Pressable>
        </View>
      </Pressable>
    </Modal>
  );
});


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
