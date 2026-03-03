// components/DraggableTaskList.jsx
import { useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import {} from 'react-native-worklets';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';

const ITEM_HEIGHT = 80; // ajusta al alto real de tu TaskCard

const DraggableItem = ({ children, index, totalItems, onMove, onDrop }) => {
  const translateY = useSharedValue(0);
  const isActive = useSharedValue(false);
  const startY = useSharedValue(0);

  const gesture = Gesture.Pan()
    .onStart(() => {
      isActive.value = true;
      startY.value = translateY.value;
    })
    .onUpdate((e) => {
      translateY.value = startY.value + e.translationY;

      // Calcula hacia qué índice se está moviendo
      const newIndex = Math.max(
        0,
        Math.min(totalItems - 1, index + Math.round(translateY.value / ITEM_HEIGHT)),
      );
      runOnJS(onMove)(index, newIndex);
    })
    .onEnd(() => {
      const newIndex = Math.max(
        0,
        Math.min(totalItems - 1, index + Math.round(translateY.value / ITEM_HEIGHT)),
      );
      translateY.value = withSpring(0);
      isActive.value = false;
      runOnJS(onDrop)(index, newIndex);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    zIndex: isActive.value ? 999 : 1,
    shadowOpacity: withSpring(isActive.value ? 0.2 : 0),
    elevation: isActive.value ? 8 : 0,
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.item, animatedStyle]}>{children}</Animated.View>
    </GestureDetector>
  );
};

const DraggableTaskList = ({ tasks, renderTask, onReorder }) => {
  const [localTasks, setLocalTasks] = useState(tasks);
  const pendingOrder = useRef([...tasks]);

  // Actualiza el orden visualmente mientras arrastra
  const handleMove = (fromIndex, toIndex) => {
    if (fromIndex === toIndex) return;
    const reordered = [...pendingOrder.current];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);
    pendingOrder.current = reordered;
    setLocalTasks([...reordered]);
  };

  // Confirma el orden al soltar
  const handleDrop = (fromIndex, toIndex) => {
    if (fromIndex === toIndex) return;
    onReorder?.(pendingOrder.current);
  };

  return (
    <View style={styles.container}>
      {localTasks.map((task, index) => (
        <DraggableItem
          key={task._id}
          index={index}
          totalItems={localTasks.length}
          onMove={handleMove}
          onDrop={handleDrop}
        >
          {renderTask(task, index)}
        </DraggableItem>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  item: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
  },
});

export default DraggableTaskList;
