import { View, Text, FlatList } from 'react-native';
import { TaskCard } from './components/TaskCard';

const tareas = [
  {
    _id: '1,',
    titulo: 'Aprender Expo',
    prioridad: 'alta',
  },
  {
    _id: '2,',
    titulo: 'Aprender React Native',
    prioridad: 'media',
  },
  {
    _id: '3,',
    titulo: 'Conectar la API',
    prioridad: 'baja',
  },
];

const App = () => {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={tareas} // Datos que recibe
        keyExtractor={(i) => i._id}
        renderItem={({ item }) => (
          <TaskCard task={item} onPress={() => console.log('pulsado', item.titulo)} />
        )}
      ></FlatList>
    </View>
  );
};

export default App;
