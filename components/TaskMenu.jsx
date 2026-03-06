// components/TaskMenu.jsx
import { Modal, View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../app/constants/colors';

export function TaskMenu({ visible, onClose, position, onEdit, onDelete }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} onPress={onClose} activeOpacity={1}>
        <View style={[styles.menu, { top: position.top, right: position.right }]}>
          <TouchableOpacity onPress={onEdit} style={styles.menuItem}>
            <Ionicons name="pencil-outline" size={18} color={'#000'} />
            <Text style={[styles.menuItemText, { color: '#000' }]}>Editar</Text>
          </TouchableOpacity>
          <View style={styles.menuDivider} />
          <TouchableOpacity onPress={onDelete} style={styles.menuItem}>
            <Ionicons name="trash-outline" size={18} color={colors.high} />
            <Text style={[styles.menuItemText, { color: colors.high }]}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  menu: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: 14,
    width: 200,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
    overflow: 'hidden',
  },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  menuItemText: { fontSize: 15, fontFamily: 'Inter_400Regular' },
  menuDivider: { height: 1, backgroundColor: colors.border },
});
