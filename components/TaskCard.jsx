// components/TaskCard.jsx
import { View, StyleSheet, ImageBackground } from 'react-native';
import { api } from '../services/api';
import { useState } from 'react';
import colors from '../app/constants/colors';
import { TaskCardContent } from './TaskCardContent';
import { useLocalSearchParams } from 'expo-router';

const DEFAULT_CONFIG = {
  color: '#FFFFFF',
  label: null,
  cardBg: '#2C2C3E',
  iconBg: 'rgba(255,255,255,0.1)',
};

const PRIORITY_CONFIG = {
  high: { color: '#FFFFFF', label: 'Alta', cardBg: '#C0544A', iconBg: 'rgba(0,0,0,0.15)' },
  medium: { color: '#FFFFFF', label: 'Media', cardBg: '#4A7FA5', iconBg: 'rgba(0,0,0,0.15)' },
  low: { color: '#FFFFFF', label: 'Baja', cardBg: '#4A9E6E', iconBg: 'rgba(0,0,0,0.15)' },
};

export function TaskCard({ task, onUpdate }) {
  const [completed, setCompleted] = useState(task.completed);

  const { id } = useLocalSearchParams();
  const config = PRIORITY_CONFIG[task.priority] || DEFAULT_CONFIG;

  const toggleComplete = async () => {
    try {
      await api.patch(`groups/${id}/tasks/${task._id}`, { completed: !completed });
      setCompleted(!completed);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {task.coverImage ? (
        <ImageBackground
          source={{ uri: task.coverImage }}
          style={[styles.cardWrapper, completed && styles.cardCompleted]}
          imageStyle={styles.backgroundImage}
        >
          <View style={styles.overlayImage} />
          <TaskCardContent
            task={task}
            completed={completed}
            toggleComplete={toggleComplete}
            config={config}
            onUpdate={onUpdate}
          />
        </ImageBackground>
      ) : (
        <View
          style={[
            styles.cardWrapper,
            { backgroundColor: config.cardBg },
            completed && styles.cardCompleted,
          ]}
        >
          <TaskCardContent
            task={task}
            completed={completed}
            toggleComplete={toggleComplete}
            config={config}
            onUpdate={onUpdate}
          />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    borderRadius: 20,
    marginBottom: 14,
    padding: 10,
    elevation: 6,
    maxHeight: 120,
  },
  cardCompleted: {
    opacity: 0.55,
  },
  backgroundImage: {
    borderRadius: 20,
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  overlayImage: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 20,
  },

  menu: {
    position: 'absolute',
    backgroundColor: colors.surfaceHigh,
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
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  menuItemText: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
  },
  menuDivider: {
    height: 1,
    backgroundColor: colors.border,
  },
});
