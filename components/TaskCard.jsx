import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../services/api';
import { useRef, useState } from 'react';
import { router } from 'expo-router';
import colors from '../app/constants/colors';

export function TaskCard({ task, onPress, onUpdate }) {
  const [completed, setCompleted] = useState(task.completed);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const menuButtonRef = useRef(null);

  const openMenu = () => {
    menuButtonRef.current.measure((x, y, width, height, pageX, pageY) => {
      setMenuPosition({
        top: pageY + height, // justo debajo del botón
        right: 16, // pegado a la derecha
      });
      setMenuVisible(true);
    });
  };

  const toggleComplete = async () => {
    try {
      await api.patch(`tasks/${task._id}`, { completed: !completed });
      setCompleted(!completed);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      setMenuVisible(false);
      await api.delete(`tasks/${task._id}`);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = () => {
    setMenuVisible(false);
    router.push(`tasks/${task._id}`);
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      {/* Radio button */}
      <TouchableOpacity onPress={toggleComplete} style={styles.radio}>
        {completed ? (
          <View style={styles.radioCompleted}>
            <Ionicons name="checkmark" size={14} color="#fff" />
          </View>
        ) : (
          <View style={styles.radioEmpty} />
        )}
      </TouchableOpacity>

      {/* Contenido */}
      <View style={styles.content}>
        <Text style={[styles.titulo, completed && styles.tituloCompleted]}>{task.title}</Text>
        {task.description && (
          <Text style={[styles.descripcion, completed && styles.descripcionCompleted]}>
            {task.description}
          </Text>
        )}
      </View>

      {/* Tres puntitos */}
      <TouchableOpacity ref={menuButtonRef} onPress={openMenu} style={styles.menuButton}>
        <Ionicons name="ellipsis-vertical" size={18} color="#9CA3AF" />
      </TouchableOpacity>

      {/* Menu desplegable */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setMenuVisible(false)}
          activeOpacity={1}
        >
          <View style={[styles.menu, { top: menuPosition.top, right: menuPosition.right }]}>
            <TouchableOpacity onPress={handleEdit} style={styles.menuItem}>
              <Ionicons name="pencil-outline" size={18} color="#1C1C1E" />
              <Text style={styles.menuItemText}>Editar tarea</Text>
            </TouchableOpacity>
            <View style={styles.menuDivider} />
            <TouchableOpacity onPress={handleDelete} style={styles.menuItem}>
              <Ionicons name="trash-outline" size={18} color="#EF4444" />
              <Text style={[styles.menuItemText, { color: '#EF4444' }]}>Eliminar tarea</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    padding: 10,
    borderRadius: 12,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  radio: {
    width: 24,
    height: 24,
  },
  radioEmpty: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.borderStrong,
  },
  radioCompleted: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  titulo: {
    fontSize: 15,
    fontFamily: 'Mulish_600SemiBold',
    color: colors.textPrimary,
  },
  tituloCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  descripcion: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
    fontFamily: 'Mulish_400Regular',
  },
  descripcionCompleted: {
    color: colors.textMuted,
  },
  menuButton: {
    padding: 4,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  menu: {
    position: 'absolute',
    backgroundColor: colors.surfaceHigh,
    borderRadius: 14,
    width: 230,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  menuItemText: {
    fontSize: 15,
    fontFamily: 'Mulish_500Medium',
    color: colors.textPrimary,
  },
  menuDivider: {
    height: 1,
    backgroundColor: colors.border,
  },
});
