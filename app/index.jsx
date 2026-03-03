import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../context/AuthContext';

const MIN_DURATION = 5000;
const DOT_COUNT = 4;

const Index = () => {
  const { token, isLoading } = useAuth();
  const [status, setStatus] = useState('Iniciando...');
  const startTime = useRef(Date.now());
  const redirected = useRef(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const dotAnims = useRef(Array.from({ length: DOT_COUNT }, () => new Animated.Value(0))).current;

  // Animación de entrada
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 900,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();
  }, []);

  // Spinner
  useEffect(() => {
    const animations = dotAnims.map((anim, i) =>
      Animated.sequence([
        Animated.delay(i * 180),
        Animated.timing(anim, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
          easing: Easing.in(Easing.cubic),
        }),
      ]),
    );
    Animated.loop(Animated.parallel(animations)).start();
  }, []);

  // ! LOGS

  // Redirige cuando AuthContext termina de cargar + mínimo 10s
  useEffect(() => {
    if (isLoading || redirected.current) return;

    redirected.current = true;
    setStatus(token ? '¡Bienvenido de vuelta!' : 'Listo');

    const elapsed = Date.now() - startTime.current;
    const remaining = Math.max(0, MIN_DURATION - elapsed);

    setTimeout(() => {
      router.replace(token ? '/(tabs)/tasks' : '/login');
    }, remaining);
  }, [isLoading]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.heroContainer,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <View style={styles.iconWrapper}>
          <Text style={styles.iconText}>✓</Text>
        </View>
        <Text style={styles.title}></Text>
        <Text style={styles.subtitle}>Organiza tu día, sin excusas.</Text>
      </Animated.View>

      <Animated.View style={[styles.spinnerContainer, { opacity: fadeAnim }]}>
        {dotAnims.map((anim, i) => (
          <Animated.View
            key={i}
            style={[
              styles.dot,
              {
                transform: [
                  {
                    translateY: anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -10],
                    }),
                  },
                ],
                opacity: anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.3, 1],
                }),
              },
            ]}
          />
        ))}
      </Animated.View>

      <Animated.Text style={[styles.statusText, { opacity: fadeAnim }]}>{status}</Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
  },
  heroContainer: {
    alignItems: 'center',
    gap: 12,
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  iconText: {
    fontSize: 40,
    color: '#fff',
  },
  title: {
    fontSize: 48,
    fontFamily: 'Mulish_800ExtraBold',
    color: '#fff',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Mulish_400Regular',
    color: 'rgba(255,255,255,0.75)',
    letterSpacing: 0.3,
  },
  spinnerContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  statusText: {
    fontSize: 13,
    fontFamily: 'Mulish_500Medium',
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 0.5,
  },
});

export default Index;
