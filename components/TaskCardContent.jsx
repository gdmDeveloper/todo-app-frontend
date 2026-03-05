// components/TaskCardContent.jsx
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { TaskMenu } from './TaskMenu';
import { router } from 'expo-router';
import { api } from '../services/api';

export function TaskCardContent({ task, completed, toggleComplete, config, onUpdate }) {
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const [menuVisible, setMenuVisible] = useState(false);

  const menuButtonRef = useRef(null);
  const openMenu = () => {
    menuButtonRef.current.measure((x, y, width, height, pageX, pageY) => {
      setMenuPosition({ top: pageY + height, right: 16 });
      setMenuVisible(true);
    });
  };

  const handleDelete = async () => {
    try {
      setMenuVisible(false);
      console.log('entra');
      await api.delete(`tasks/${task._id}`);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = () => {
    setMenuVisible(false);
    router.push({
      pathname: '/tasks/[id]',
      params: { id: task._id },
    });
  };

  return (
    <>
      <TaskMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        position={menuPosition}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <View style={styles.container}>
        {/* Contenido principal */}
        <View style={styles.content}>
          <View style={styles.topRow}>
            <View style={styles.topInfo}>
              <Text style={[styles.titulo, completed && styles.tituloCompleted]} numberOfLines={2}>
                {task.title}
              </Text>
            </View>

            {/* Botón de menú arriba a la derecha */}
            <TouchableOpacity ref={menuButtonRef} onPress={openMenu} style={styles.menuButton}>
              <Ionicons name="ellipsis-horizontal" size={22} color="rgba(255,255,255,0.7)" />
            </TouchableOpacity>
          </View>

          {!!task.description?.trim() && (
            <Text style={styles.descripcion} numberOfLines={2}>
              {task.description}
            </Text>
          )}
        </View>

        {/* Fila inferior: completar siempre al fondo */}
        <View style={styles.bottomRow}>
          <TouchableOpacity onPress={toggleComplete} style={styles.completeButton}>
            <View style={[styles.radioOuter, { borderColor: 'rgba(255,255,255,0.5)' }]}>
              {completed && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.completeText}>{completed ? 'Completada' : 'Completar'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxHeight: 120, // altura máxima del card
    justifyContent: 'space-between', // fuerza que la fila inferior quede al fondo
    paddingVertical: 8,
  },
  content: {
    flexShrink: 1, // permite que el contenido se reduzca si es necesario
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // fuerza separación título / botón
    marginBottom: 4,
  },
  iconCircle: {
    width: 14,
    height: 14,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topInfo: { flex: 1, gap: 3 },
  titulo: {
    fontSize: 18,
    color: '#fff',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginBottom: 10,
    fontFamily: 'Inter_400Regular',
  },
  menuButton: {
    padding: 4, // aumenta el hit area sin tocar layout
  },
  tituloCompleted: {
    textDecorationLine: 'line-through',
    color: 'rgba(255,255,255,0.45)',
    fontFamily: 'Inter_600SemiBold',
  },
  descripcion: {
    fontSize: 12,
    color: '#f1faee',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginBottom: 0,
    fontFamily: 'Inter_400Regular',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.12)',
  },
  completeButton: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#fff' },
  completeText: {
    fontSize: 11,
    color: '#fff',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    fontFamily: 'Inter_600SemiBold',
  },
});
