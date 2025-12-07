import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { listService } from '@/infra/services';
import { List } from '@/types';
import { useRouter } from 'expo-router';

export default function HistoryScreen() {
  const router = useRouter();
  const { data: lists, isLoading, isError } = useQuery<List[]>({
    queryKey: ['lists'],
    queryFn: () => listService.getAll(),
  });

  if (isLoading) {
    return <ActivityIndicator className="flex-1" size="large" color="#FF6347" />;
  }

  if (isError) {
    return <Text className="flex-1 text-center self-center text-lg text-red-500">Erro ao carregar o histórico.</Text>;
  }

  const renderItem = ({ item }: { item: List }) => {
    const totalSpent = item.items.reduce((acc, curr) => acc + curr.value * curr.quantity, 0);
    return (
      <TouchableOpacity className="flex-row justify-between items-center p-4 bg-white rounded-md mb-2" onPress={() => router.push(`/report/${item.id}`)}>
        <Text className=" font-medium">{item.name || new Date(item.createdAt).toLocaleDateString('pt-BR')}</Text>
        <Text>{totalSpent.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-[#FFF0E5] p-5">
      <Text className="text-3xl font-bold mb-5 text-gray-800 text-center">Histórico de Listas</Text>
      <FlatList
        data={lists}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        className="w-full"
        ListEmptyComponent={<Text className="text-center mt-12  text-gray-500">Nenhuma lista encontrada.</Text>}
      />
    </View>
  );
}
