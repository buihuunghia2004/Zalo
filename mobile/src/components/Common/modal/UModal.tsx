
import { Modal, View, StyleSheet } from 'react-native';
import React from 'react';
import { colors } from '~/styles/Ui/colors';

interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
  content: React.ReactNode;
}

const UModal: React.FC<CustomModalProps> = ({
  visible,
  onClose,
  content
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      {/* Overlay background mờ */}
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {content}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    borderRadius: 10,
    color: colors.transparent
  },
});

export default UModal;
