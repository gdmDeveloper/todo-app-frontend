// components/TaskCard.jsx
import { View, StyleSheet, ImageBackground } from 'react-native';
import { api } from '../services/api';
import { useState } from 'react';
import colors from '../app/constants/colors';
import { TaskCardContent } from './TaskCardContent';

import { LinearGradient } from 'expo-linear-gradient';

const PRIORITY_CONFIG = {
  high: {
    colors: ['#8B4A42', '#6B3530'],
    overlay: ['rgba(255,180,150,0.08)', 'rgba(0,0,0,0.2)'],
    iconBg: 'rgba(0,0,0,0.2)',
  },
  medium: {
    colors: ['#3A5A72', '#2A4558'],
    overlay: ['rgba(150,200,255,0.08)', 'rgba(0,0,0,0.2)'],
    iconBg: 'rgba(0,0,0,0.2)',
  },
  low: {
    colors: ['#3A6B50', '#2A5040'],
    overlay: ['rgba(150,255,180,0.08)', 'rgba(0,0,0,0.2)'],
    iconBg: 'rgba(0,0,0,0.2)',
  },
};

const DEFAULT_CONFIG = {
  colors: ['#3A3A4A', '#2A2A38'],
  overlay: ['rgba(200,200,255,0.05)', 'rgba(0,0,0,0.2)'],
  iconBg: 'rgba(255,255,255,0.1)',
};

export function TaskCard({ task, onUpdate, groupId }) {
  const [completed, setCompleted] = useState(task.completed);
  const config = PRIORITY_CONFIG[task.priority] || DEFAULT_CONFIG;

  const toggleComplete = async () => {
    try {
      if (groupId) {
        await api.patch(`groups/${groupId}/tasks/${task._id}`, { completed: !completed });
      } else {
        await api.patch(`tasks/${task._id}`, { completed: !completed });
      }
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
        <LinearGradient
          colors={config.colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.cardWrapper, !!completed && styles.cardCompleted]}
        >
          {/* Gradiente overlay diagonal */}
          <LinearGradient
            colors={config.overlay}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />
          {/* Brillo esquina superior */}
          <View style={styles.shine} />

          <TaskCardContent
            task={task}
            completed={completed}
            toggleComplete={toggleComplete}
            config={config}
            onUpdate={onUpdate}
            groupId={groupId}
          />
        </LinearGradient>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    borderRadius: 10,
    marginBottom: 14,
    padding: 10,
    elevation: 8,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  cardCompleted: {
    opacity: 0.55,
  },
  backgroundImage: {
    borderRadius: 10,
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  overlayImage: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 20,
  },

  glowOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '60%',
    height: '70%',
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.07)',
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
