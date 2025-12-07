import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
    } catch (error) {
      console.error('Login failed:', error);
      Alert.alert('Login Failed', 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FFF0E5]">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 items-center justify-center p-5"
      >
        <Image source={require('../../assets/logo.png')} className="w-24 h-24 mb-10 rounded-xl" />
        <Text className="text-3xl font-bold mb-10 text-gray-800">login</Text>

        <TextInput
          className="w-full bg-gray-200 rounded-lg p-4 mb-4 "
          placeholder="rodrigoa0987@gmail.com"
          placeholderTextColor="#A9A9A9"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          className="w-full bg-gray-200 rounded-lg p-4 mb-4 "
          placeholder="************"
          placeholderTextColor="#A9A9A9"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity className="w-full bg-red-500 rounded-lg p-4 items-center" onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text className="text-white text-lg font-bold">Entrar</Text>}
        </TouchableOpacity>

        <View className="flex-row mt-5">
          <Text className=" text-gray-800">Não tem conta? </Text>
          <TouchableOpacity onPress={() => router.push('/register')}>
            <Text className=" text-red-500 font-bold">Criar conta</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

