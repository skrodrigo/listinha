import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { listService } from '@/infra/services';
import { List } from '@/types';

export default function ReportScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: list, isLoading, isError } = useQuery<List>({
    queryKey: ['list', id],
    queryFn: () => listService.getById(id!),
  });

  if (isLoading) {
    return <ActivityIndicator className="flex-1" size="large" color="#FF6347" />;
  }

  if (isError || !list) {
    return <Text className="flex-1 text-center self-center text-lg text-red-500">Erro ao carregar o relatório.</Text>;
  }

  const totalSpent = list.items.reduce((acc, item) => acc + item.value * item.quantity, 0);
  const totalItems = list.items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <View className="flex-1 bg-[#FFF0E5] p-5">
      <Stack.Screen options={{ title: 'Relatório da Lista' }} />
      <View className="bg-gray-200 rounded-lg p-5 mb-4">
        <Text className=" text-gray-600">Total Gastos</Text>
        <Text className="text-3xl font-bold text-red-500 mt-1">{totalSpent.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text>
      </View>
      <View className="bg-gray-200 rounded-lg p-5 mb-4">
        <Text className=" text-gray-600">Total de Itens</Text>
        <Text className="text-3xl font-bold text-red-500 mt-1">{totalItems} Itens</Text>
      </View>

      <Text className="text-xl font-bold text-gray-800 mt-5 mb-2">Resumo dos Itens</Text>
      <FlatList
        data={list.items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="flex-row justify-between py-2 border-b border-gray-300">
            <Text className="">{item.quantity}x {item.name}</Text>
            <Text className="">{(item.value * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text>
          </View>
        )}
        className="w-full"
      />

      <TouchableOpacity className="bg-red-500 p-4 rounded-lg items-center mt-5" onPress={() => Alert.alert('Exportar', 'Funcionalidade de exportação a ser implementada.')}>
        <Text className="text-white text-lg font-bold">Exportar</Text>
      </TouchableOpacity>
    </View>
  );
}
