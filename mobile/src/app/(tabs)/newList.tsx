import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { listService } from '@/infra/services';
import { List } from '@/types';

export default function NewListScreen() {
  const [budget, setBudget] = useState('');
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: createList, isPending } = useMutation({
    mutationFn: (newBudget: number) => {
      return listService.create(newBudget);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['lists'] });
      router.push(`/list/${data.id}`);
    },
    onError: (error) => {
      console.error('Failed to create list:', error);
      Alert.alert('Erro', 'Não foi possível criar a lista.');
    },
  });

  const handleStartList = () => {
    const budgetValue = parseFloat(budget.replace(/[^\d,]/g, '').replace(',', '.'));
    if (isNaN(budgetValue) || budgetValue <= 0) {
      Alert.alert('Orçamento Inválido', 'Por favor, insira um valor de orçamento válido.');
      return;
    }
    createList(budgetValue);
  };

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    if (!numericValue) return '';
    const floatValue = parseFloat(numericValue) / 100;
    return floatValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <View className="flex-1 bg-[#FFF0E5] items-center justify-center p-5">
      <Text className="text-3xl font-bold mb-10 text-gray-800 text-center">Qual o seu orçamento?</Text>

      <TextInput
        className="w-full bg-gray-200 rounded-lg p-5 mb-5 text-2xl text-center font-bold"
        placeholder="R$ 0,00"
        placeholderTextColor="#A9A9A9"
        value={formatCurrency(budget)}
        onChangeText={(text) => setBudget(text.replace(/\D/g, ''))}
        keyboardType="numeric"
      />

      <TouchableOpacity className="w-full bg-red-500 rounded-lg p-4 items-center" onPress={handleStartList} disabled={isPending}>
        {isPending ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-lg font-bold">Iniciar Lista de Compras →</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
