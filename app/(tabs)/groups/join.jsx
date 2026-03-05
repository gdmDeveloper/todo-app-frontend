import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { api } from '../../../services/api';

const JoinGroup = () => {
  const [code, setCode] = useState('');
  const [groupInfo, setGroupInfo] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleSearch = async () => {
    try {
      const data = await api.get(`groups/search?code=${code}`); // Invitation code.
      setGroupInfo(data);
      setModalVisible(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleJoin = async () => {
    try {
      await api.post('groups/join', { groupId: groupInfo.id });
      setModalVisible(false);
      router.back();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={code}
        onChangeText={setCode}
        placeholder="Código de invitación"
        autoCapitalize="characters"
        style={styles.input}
      />
      <TouchableOpacity onPress={handleSearch} style={styles.boton}>
        <Text>Buscar grupo</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitulo}>{groupInfo?.name}</Text>
            <Text>{groupInfo?.description}</Text>
            <Text>{groupInfo?.totalMembers}</Text>
            {groupInfo?.isMember ? (
              <View>
                <Text>Ya eres miembro de este grupo</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Text>Cerrar</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity onPress={handleJoin}>
                <Text>Unirme</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  form: {
    flex: 1,
    justifyContent: 'center', // centra verticalmente el formulario
    alignItems: 'center',
    gap: 20,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
  },

  input: {
    padding: 10,
    border: '1px solid grey',
    borderRadius: 10,
  },
});

export default JoinGroup;
