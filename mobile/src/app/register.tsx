import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { toast } from 'sonner-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/infra/services';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { signIn } = useAuth();

  const handleRegister = async () => {
    try {
      await authService.register(email, password);
      // Loga automaticamente após o registro
      await authService.login(email, password);
      await signIn(); // Atualiza o estado de autenticação global
      router.replace('/(tabs)/newList'); // Redireciona para a tela principal
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Ocorreu um erro inesperado.';
      toast.error('Falha no Cadastro', { description: errorMessage });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FFF0E5]">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 items-center justify-center p-5"
      >
        <Image source={require('../../assets/logo.png')} className="w-24 h-24 mb-10 rounded-xl" />
        <Text className="text-3xl font-bold mb-10 text-gray-800">Criar Conta</Text>

        <TextInput
          className="w-full bg-gray-200 rounded-lg p-4 mb-4 "
          placeholder="Email"
          placeholderTextColor="#A9A9A9"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          className="w-full bg-gray-200 rounded-lg p-4 mb-4 "
          placeholder="Senha"
          placeholderTextColor="#A9A9A9"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity className="w-full bg-red-500 rounded-lg p-4 items-center mt-2" onPress={handleRegister}>
          <Text className="text-white text-lg font-bold">Criar Conta</Text>
        </TouchableOpacity>

        <View className="flex-row mt-5">
          <Text className=" text-gray-800">Já tem conta? </Text>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text className=" text-red-500 font-bold">Entrar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
