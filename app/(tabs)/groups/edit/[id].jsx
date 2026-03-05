import { useState, useEffect } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { api } from '../../../../services/api';
import { uploadImage } from '../../../../services/uploadImage';
import GroupForm from '../../../../components/GroupForm';

export default function EditGroup() {
  const { id } = useLocalSearchParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState(null);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const group = await api.get(`groups/${id}`);
        setTitle(group.name);
        setDescription(group.description || '');
        setCoverImage(group.coverImage || null);
      } catch {
        Alert.alert('Error', 'No se pudo cargar el grupo');
      } finally {
        setLoading(false);
      }
    };

    fetchGroup();
  }, [id]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.7,
    });

    if (!result.canceled) {
      setUploading(true);
      const url = await uploadImage(result.assets[0]);
      setCoverImage(url);
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) return;

    setSaving(true);
    await api.patch(`groups/edit/${id}`, {
      name: title,
      description,
      coverImage,
    });
    setSaving(false);
    router.back();
  };

  if (loading) return null;

  return (
    <GroupForm
      title={title}
      setTitle={setTitle}
      description={description}
      setDescription={setDescription}
      coverImage={coverImage}
      pickImage={pickImage}
      uploading={uploading}
      saving={saving}
      onSave={handleSave}
      headerTitle="Editar grupo"
      onBack={() => router.back()}
    />
  );
}
