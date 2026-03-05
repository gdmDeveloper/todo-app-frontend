import { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TaskFilters = ({ onFilterChange }) => {
  const [completedActive, setCompletedActive] = useState(false);
  const [priorityMenuVisible, setPriorityMenuVisible] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const priorityButtonRef = useRef(null);

  const toggleCompleted = () => {
    const newValue = !completedActive;
    setCompletedActive(newValue);
    onFilterChange({ completed: newValue, priority: selectedPriority });
  };

  const openPriorityMenu = () => {
    priorityButtonRef.current.measure((x, y, width, height, pageX, pageY) => {
      setMenuPosition({ top: pageY + height + 4, right: 16 });
      setPriorityMenuVisible(true);
    });
  };

  const selectPriority = (priority) => {
    const newPriority = selectedPriority === priority ? null : priority;
    setSelectedPriority(newPriority);
    setPriorityMenuVisible(false);
    onFilterChange({ completed: completedActive, priority: newPriority });
  };

  const priorityLabels = {
    high: 'Alta',
    medium: 'Media',
    low: 'Baja',
  };

  return (
    <View style={styles.container}>
      {/* Botón completadas */}
      <TouchableOpacity
        onPress={toggleCompleted}
        style={[styles.filterButton, completedActive && styles.filterButtonActive]}
      >
        <Text style={[styles.filterText, completedActive && styles.filterTextActive]}>
          Completadas
        </Text>
      </TouchableOpacity>

      {/* Botón prioridad */}
      <TouchableOpacity
        ref={priorityButtonRef}
        onPress={openPriorityMenu}
        style={[styles.filterButton, selectedPriority && styles.filterButtonActive]}
      >
        <Text style={[styles.filterText, selectedPriority && styles.filterTextActive]}>
          {selectedPriority ? priorityLabels[selectedPriority] : 'Prioridad'}
        </Text>
        <Ionicons
          name="ellipsis-horizontal"
          size={14}
          color={selectedPriority ? '#fff' : '#6B7280'}
          style={{ marginLeft: 4 }}
        />
      </TouchableOpacity>

      {/* Modal prioridad */}
      <Modal
        visible={priorityMenuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPriorityMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setPriorityMenuVisible(false)}
          activeOpacity={1}
        >
          <View style={[styles.menu, { top: menuPosition.top, right: menuPosition.right }]}>
            {['high', 'medium', 'low'].map((p) => (
              <TouchableOpacity key={p} onPress={() => selectPriority(p)} style={styles.menuItem}>
                <View
                  style={[
                    styles.dot,
                    {
                      backgroundColor:
                        p === 'high' ? '#EF4444' : p === 'medium' ? '#F59E0B' : '#10B981',
                    },
                  ]}
                />
                <Text
                  style={[styles.menuItemText, selectedPriority === p && styles.menuItemTextActive]}
                >
                  {priorityLabels[p]}
                </Text>
                {selectedPriority === p && (
                  <Ionicons
                    name="checkmark"
                    size={16}
                    color="#7C3AED"
                    style={{ marginLeft: 'auto' }}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 8,
    marginBottom: 20,
    marginTop: 25,
    justifyContent: 'space-around',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  filterButtonActive: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  filterText: {
    fontSize: 13,
    fontFamily: 'Inter_300Light',
    color: '#6B7280',
  },
  filterTextActive: {
    color: '#fff',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  menu: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: 14,
    width: 150,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 10,
  },
  menuItemText: {
    fontSize: 14,
    fontFamily: 'Mulish_500Medium',
    color: '#1C1C1E',
  },
  menuItemTextActive: {
    color: '#7C3AED',
    fontFamily: 'Mulish_700Bold',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default TaskFilters;
