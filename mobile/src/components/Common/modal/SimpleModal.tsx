import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';
import { colors } from '~/styles/Ui/colors';

interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string; 
  description?: string;
  textRightButton?: string;
  textLeftButton?: string;
  onConfirm?: () => void;
  toast?: string; 
}

const SimpleModal: React.FC<CustomModalProps> = ({
  visible,
  onClose,
  title = 'Default Title',
  description = 'Default Description',
  textRightButton,
  textLeftButton,
  onConfirm,
  toast,  
}) => {
  const [isToastVisible, setToastVisible] = useState<boolean>(false);

  useEffect(() => {
    if (visible && toast) {
      setToastVisible(true);
      setTimeout(() => {
        setToastVisible(false);  
      }, 3000);
    }
  }, [visible, toast]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose} 
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>{title}</Text>
          <View style={{width: '100%', height: 0.5, backgroundColor: colors.gray,}}></View>
         
          <View style={{ paddingHorizontal: 10, marginTop: 10}}>
          <Text style={styles.description}>{description}</Text>
          <View style={styles.buttonContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.button,
                styles.cancelButton,
                pressed && styles.pressedEffectCancel, 
              ]}
              onPress={() => {
                onClose();
              }}
            >
              <Text style={styles.buttonText}>{textLeftButton ? textLeftButton : 'Cancel'}</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.button,
                styles.confirmButton,
                pressed && styles.pressedEffect, 
              ]}
              onPress={() => {
                if (onConfirm) onConfirm();
                onClose();
              }}
            >
              <Text style={styles.buttonText}>{textRightButton ? textRightButton : 'Confirm'}</Text>
            </Pressable>
          </View>
          </View>
        </View>
        
        {/* Toast Message */}
        {isToastVisible && (
          <Text style={styles.toastText}>{toast}</Text>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    gap: 10,
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 30,
    color: '#555',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: colors.secondary_light,
  },
  confirmButton: {
    backgroundColor: colors.primary,
  },
  pressedEffect: {
    backgroundColor: colors.primary_light,
  },
  pressedEffectCancel: {
    backgroundColor: colors.secondary_transparent,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },

  toastText: {
    position: 'absolute',
    borderRadius: 10,
    backgroundColor: colors.secondary,
    padding: 10,
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default SimpleModal;
