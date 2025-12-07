import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listService } from '@/infra/services';
import { List, ListItem } from '@/types';
import { Ionicons } from '@expo/vector-icons';

export default function ListScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState('1');
  const [newItemValue, setNewItemValue] = useState('');

  const { data: list, isLoading, isError } = useQuery<List>({
    queryKey: ['list', id],
    queryFn: () => listService.getById(id!),
  });

  const addItemMutation = useMutation({
    mutationFn: (newItem: Omit<ListItem, 'id' | 'createdAt' | 'updatedAt' | 'listId'>) =>
      listService.addItem(id!, newItem.name, newItem.quantity, newItem.value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['list', id] });
      setNewItemName('');
      setNewItemQty('1');
      setNewItemValue('');
    },
    onError: () => Alert.alert('Erro', 'Não foi possível adicionar o item.'),
  });

  const deleteItemMutation = useMutation({
    mutationFn: (itemId: string) => listService.deleteItem(id!, itemId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['list', id] }),
    onError: () => Alert.alert('Erro', 'Não foi possível remover o item.'),
  });

  const handleAddItem = () => {
    const value = parseFloat(newItemValue.replace(/[^\d,]/g, '').replace(',', '.'));
    if (!newItemName || isNaN(value) || value <= 0) {
      Alert.alert('Dados Inválidos', 'Preencha o nome e o valor do item.');
      return;
    }
    addItemMutation.mutate({ name: newItemName, quantity: parseInt(newItemQty, 10), value });
  };

  const totalSpent = list?.items.reduce((acc, item) => acc + item.value * item.quantity, 0) ?? 0;

  if (isLoading) {
    return <ActivityIndicator className="flex-1" size="large" color="#FF6347" />;
  }

  if (isError || !list) {
    return <Text className="flex-1 text-center self-center text-lg text-red-500">Erro ao carregar a lista.</Text>;
  }

  return (
    <View className="flex-1 bg-[#FFF0E5] p-2">
      <Stack.Screen options={{ title: 'Lista de Compras', headerBackTitle: 'Voltar' }} />
      <View className="flex-row items-center mb-2 gap-1">
        <TextInput className="bg-white p-2 rounded border border-gray-300 flex-1" value={newItemQty} onChangeText={setNewItemQty} keyboardType="numeric" />
        <TextInput className="bg-white p-2 rounded border border-gray-300 flex-4" placeholder="Nome do item" value={newItemName} onChangeText={setNewItemName} />
        <TextInput className="bg-white p-2 rounded border border-gray-300 flex-2" placeholder="Valor" value={newItemValue} onChangeText={setNewItemValue} keyboardType="numeric" />
        <TouchableOpacity onPress={handleAddItem} disabled={addItemMutation.isPending}>
          <Ionicons name="add-circle" size={32} color="#FF6347" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={list.items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="flex-row justify-between items-center p-4 bg-white rounded-md mb-2">
            <Text>{item.quantity}x</Text>
            <Text className="flex-1 ml-2">{item.name}</Text>
            <Text>{(item.value * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text>
            <TouchableOpacity onPress={() => deleteItemMutation.mutate(item.id)} className="ml-2">
              <Ionicons name="trash-bin-outline" size={24} color="#FF6347" />
            </TouchableOpacity>
          </View>
        )}
        className="w-full"
      />

      <View className="flex-row justify-between items-center p-4 border-t border-gray-300 bg-[#FFF0E5]">
        <Text className="text-lg font-bold">{totalSpent.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} / {list.budget.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text>
        <TouchableOpacity className="bg-red-500 py-2 px-4 rounded-md" onPress={() => router.push(`/report/${id}`)}>
          <Text className="text-white font-bold">Finalizar lista</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
