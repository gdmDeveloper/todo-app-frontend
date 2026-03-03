import { Text, TouchableOpacity } from 'react-native';

// components/GroupCard.jsx
export default function GroupCard({ group, onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text>{group.name}</Text>
      <Text>{group.members.length} miembros</Text>
    </TouchableOpacity>
  );
}
