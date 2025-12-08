import { Stack, useRouter } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from '@/hooks/useAuth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner-native';
import '../../global.css';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

const queryClient = new QueryClient();

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {
    });
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Toaster richColors invert />
          <Stack screenOptions={{ headerShown: true }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="register" options={{ headerShown: false }} />
            <Stack.Screen
              name="list/[id]"
              options={{
                title: 'Lista de Compras',
                headerBackButtonMenuEnabled: false,
                headerBackButtonDisplayMode: 'minimal',
                headerTintColor: "#000000",
                headerStyle: { backgroundColor: '#F6F6F6' },
              }}
            />
            <Stack.Screen
              name="report/[id]"
              options={{
                title: 'Relatório da Lista',
                headerBackVisible: false,
                headerStyle: { backgroundColor: '#F6F6F6' },
                headerTintColor: "#000000",
                headerLeft: () => (
                  <TouchableOpacity
                    onPress={() => router.replace('/(tabs)/history')}
                    className='w-10 h-10 justify-center items-center'>
                    <Ionicons name="close" size={22} color="#000000" />
                  </TouchableOpacity>
                ),
              }}
            />
          </Stack>
        </AuthProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}