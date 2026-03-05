// components/GroupCard.jsx
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import { useState, useRef } from 'react';
import { router } from 'expo-router';
import { TaskMenu } from './TaskMenu';
import colors from '../app/constants/colors';

const DEFAULT_BG = '#2C2C3E'; // color por defecto si no hay imagen

export function GroupCard({ group, onUpdate, onPress }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const menuButtonRef = useRef(null);

  const openMenu = () => {
    menuButtonRef.current.measure((x, y, width, height, pageX, pageY) => {
      setMenuPosition({ top: pageY + height, right: 16 });
      setMenuVisible(true);
    });
  };

  const handleEdit = () => {
    setMenuVisible(false);
    router.push(`/groups/edit/${group._id}`);
  };

  const handleDelete = async () => {
    setMenuVisible(false);
    try {
      await api.delete(`groups/${group._id}`);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.log(error);
    }
  };

  const cardContent = (
    <View>
      <Text style={styles.title} numberOfLines={2}>
        {group.name}
      </Text>
    </View>
  );

  return (
    <>
      {/* Menú contextual */}
      <TaskMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        position={menuPosition}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Card */}
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {group.coverImage ? (
          <ImageBackground
            source={{ uri: group.coverImage }}
            style={styles.cardWrapper}
            imageStyle={styles.backgroundImage}
            resizeMode="cover"
          >
            <View style={styles.overlay} />
            {cardContent}
            <TouchableOpacity ref={menuButtonRef} onPress={openMenu} style={styles.menuButton}>
              <Text style={styles.menuButtonText}>•••</Text>
            </TouchableOpacity>
          </ImageBackground>
        ) : (
          <View style={[styles.cardWrapper, { backgroundColor: DEFAULT_BG }]}>
            {cardContent}
            <TouchableOpacity ref={menuButtonRef} onPress={openMenu} style={styles.menuButton}>
              <Text style={styles.menuButtonText}>•••</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    elevation: 6,
    position: 'relative',
    minHeight: 180,
  },
  backgroundImage: {
    borderRadius: 20,
    width: '100%',
    height: '100%',
    opacity: 0.9,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: 20,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Inter_500Medium',
    color: '#fff',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginBottom: 6,
    textAlign: 'center',
  },

  menuButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 6,
  },
  menuButtonText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
