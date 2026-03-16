// components/StatsBar.jsx
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useRef, useEffect } from 'react';

const BRAND = {
  primary: '#FF6B35',
  accent: '#06D6A0',
  border: '#FFD9C0',
  surface: '#FFF8F0',
  muted: '#9B8EA8',
};

export function StatsBar({ tasks = [] }) {
  const total = tasks.length;
  const done = tasks.filter((t) => t.completed).length;
  const pending = total - done;
  const progress = total ? done / total : 0;

  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: progress,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  return (
    <View style={s.wrap}>
      <View style={s.row}>
        <View style={s.chip}>
          <Text style={s.num}>{total}</Text>
          <Text style={s.label}>Total</Text>
        </View>
        <View style={[s.chip, { backgroundColor: '#FFF0EB', borderColor: '#FFD9C0' }]}>
          <Text style={[s.num, { color: BRAND.primary }]}>{pending}</Text>
          <Text style={s.label}>Pendientes</Text>
        </View>
        <View style={[s.chip, { backgroundColor: '#EDFDF8', borderColor: '#B8F2E3' }]}>
          <Text style={[s.num, { color: BRAND.accent }]}>{done}</Text>
          <Text style={s.label}>Completadas</Text>
        </View>
      </View>

      {total > 0 && (
        <View style={s.track}>
          <Animated.View
            style={[
              s.fill,
              {
                width: widthAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { gap: 12, marginBottom: 16 },
  row: { flexDirection: 'row', gap: 10 },
  chip: {
    flex: 1,
    backgroundColor: BRAND.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BRAND.border,
    paddingVertical: 10,
    alignItems: 'center',
    gap: 2,
  },
  num: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    color: '#1A1A2E',
    letterSpacing: -0.5,
  },
  label: {
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
    color: BRAND.muted,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  track: {
    height: 4,
    backgroundColor: BRAND.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: BRAND.accent,
    shadowColor: BRAND.accent,
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
});
