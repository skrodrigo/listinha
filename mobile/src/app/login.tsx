import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { toast } from 'sonner-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/infra/services';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signIn } = useAuth();

  const handleLogin = async () => {
    setLoading(true);
    try {
      await authService.login(email, password);
      await signIn();
      router.replace('/(tabs)/newList');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'E-mail ou senha inválidos.';
      toast.error('Falha no Login', { description: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF0E5', paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View
          style={{
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 20,
          }}
        >
          <Image source={require('../../assets/logo.png')} style={{ width: 100, height: 100, marginBottom: 40, borderRadius: 10 }} />
          <Text style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 40, color: '#1F2937' }}>Login</Text>

          <TextInput
            style={{ width: '100%', backgroundColor: '#E5E7EB', borderRadius: 8, padding: 16, marginBottom: 16, fontSize: 16 }}
            placeholder="rodrigoa0987@gmail.com"
            placeholderTextColor="#A9A9A9"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={{ width: '100%', backgroundColor: '#E5E7EB', borderRadius: 8, padding: 16, marginBottom: 24, fontSize: 16 }}
            placeholder="************"
            placeholderTextColor="#A9A9A9"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={{ width: '100%', backgroundColor: '#1F2937', borderRadius: 8, padding: 16, alignItems: 'center', marginBottom: 16 }}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }}>Entrar</Text>}
          </TouchableOpacity>

          <View style={{ flexDirection: 'row' }}>
            <Text style={{ color: '#1F2937', fontSize: 14 }}>Não tem conta? </Text>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text style={{ fontWeight: 'bold', color: '#1F2937' }}>Criar conta</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
