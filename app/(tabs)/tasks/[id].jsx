// app/tasks/[id].jsx
import { useState, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import TaskForm from '../../../components/TaskForm';
import { api } from '../../../services/api';
import colors from '../../constants/colors';

export default function EditTask() {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    api
      .get(`tasks/${id}`)
      .then((data) => setInitialValues(data))
      .catch(() => router.back())
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async (values) => {
    setSaving(true);
    try {
      await api.patch(`tasks/${id}`, values);
      router.back();
    } catch {
      Alert.alert('Error', 'No se pudo guardar');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} color={colors.primary} />;

  return (
    <TaskForm
      initialValues={initialValues}
      onSave={handleSave}
      saving={saving}
      headerTitle="Editar tarea"
    />
  );
}
