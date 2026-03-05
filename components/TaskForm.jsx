import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import colors from '../app/constants/colors';
import { uploadImage } from '../services/uploadImage';
import { router } from 'expo-router';

const PRIORITY_OPTIONS = [
  { value: 'high', label: 'Alta', color: colors.high },
  { value: 'medium', label: 'Media', color: colors.medium },
  { value: 'low', label: 'Baja', color: colors.low },
];

export default function TaskForm({ initialValues = {}, onSave, saving, headerTitle }) {
  const [title, setTitle] = useState(initialValues.title || '');
  const [description, setDescription] = useState(initialValues.description || '');
  const [priority, setPriority] = useState(initialValues.priority || 'medium');
  const [icon, setIcon] = useState(initialValues.icon || 'document-text-outline');
  const [coverImage, setCoverImage] = useState(initialValues.coverImage || null);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.7,
    });
    if (!result.canceled) {
      try {
        setUploading(true);
        const url = await uploadImage(result.assets[0]);
        setCoverImage(url);
      } catch {
        Alert.alert('Error', 'No se pudo subir la imagen');
      } finally {
        setUploading(false);
      }
    }
  };

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'El título es obligatorio');
      return;
    }
    onSave({ title, description, priority, icon, coverImage });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={26} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{headerTitle}</Text>
        <TouchableOpacity onPress={handleSave} disabled={saving}>
          {saving ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Text style={styles.saveButton}>Crear</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Imagen de portada */}
        <TouchableOpacity style={styles.coverContainer} onPress={pickImage} disabled={uploading}>
          {coverImage ? (
            <Image source={{ uri: coverImage }} style={styles.coverImage} />
          ) : (
            <View style={styles.coverPlaceholder}>
              <Ionicons name="image-outline" size={32} color={colors.textSecondary} />
              <Text style={styles.coverPlaceholderText}>Añadir imagen de portada</Text>
            </View>
          )}
          {uploading && (
            <View style={styles.uploadingOverlay}>
              <ActivityIndicator color="#fff" />
              <Text style={styles.uploadingText}>Subiendo...</Text>
            </View>
          )}
          {coverImage && !uploading && (
            <View style={styles.coverEditBadge}>
              <Ionicons name="pencil" size={12} color="#fff" />
            </View>
          )}
        </TouchableOpacity>

        {/* Título */}
        <View style={styles.section}>
          <Text style={styles.label}>Título</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Nombre de la tarea"
            placeholderTextColor={colors.textMuted}
          />
        </View>

        {/* Descripción */}
        <View style={styles.section}>
          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.inputMultiline]}
            value={description}
            onChangeText={setDescription}
            placeholder="Añade una descripción..."
            placeholderTextColor={colors.textMuted}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Prioridad */}
        <View style={styles.section}>
          <Text style={styles.label}>Prioridad</Text>
          <View style={styles.priorityRow}>
            {PRIORITY_OPTIONS.map((p) => (
              <TouchableOpacity
                key={p.value}
                style={[
                  styles.priorityOption,
                  priority === p.value && { backgroundColor: p.color, borderColor: p.color },
                ]}
                onPress={() => setPriority(p.value)}
              >
                <View
                  style={[
                    styles.priorityDot,
                    { backgroundColor: priority === p.value ? '#fff' : p.color },
                  ]}
                />
                <Text
                  style={[styles.priorityOptionText, priority === p.value && { color: '#fff' }]}
                >
                  {p.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: colors.background,
  },
  headerTitle: { fontSize: 24, fontFamily: 'Inter_700Bold', color: colors.textPrimary },
  saveButton: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 25,
    border: '1px solid',
    borderRadius: 15,
    backgroundColor: colors.primary,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  coverContainer: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
    height: 180,
  },
  coverImage: { width: '100%', height: '100%' },
  coverPlaceholder: {
    flex: 1,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    borderStyle: 'dashed',
  },
  coverPlaceholderText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: colors.textSecondary,
  },
  uploadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  uploadingText: { color: '#fff', fontFamily: 'Inter_500Medium', fontSize: 14 },
  coverEditBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    padding: 6,
  },
  section: { marginHorizontal: 20, marginBottom: 24, gap: 10 },
  label: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textSecondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputMultiline: { height: 100, paddingTop: 14 },
  priorityRow: { flexDirection: 'row', gap: 10 },
  priorityOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  priorityDot: { width: 8, height: 8, borderRadius: 4 },
  priorityOptionText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textSecondary,
  },
});
