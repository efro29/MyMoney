import React, { useState, useCallback } from 'react';
import { Text, View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

function HistoricoScreen() {
  const [transactions, setTransactions] = useState([]);

const loadTransactions = async () => {
  try {
    const storedTransactions = await AsyncStorage.getItem('transactions');
    if (storedTransactions !== null) {
      const parsedTransactions = JSON.parse(storedTransactions);
      console.log("Transações carregadas:", parsedTransactions);

      // Ordenando as transações por data do mais recente para o mais antigo
      const sortedTransactionsDesc = parsedTransactions.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      // Limitando o número de registros a 100
      const limitedTransactions = sortedTransactionsDesc.slice(0, 100);

      setTransactions(limitedTransactions);
    } else {
      // Dados de exemplo se não houver transações armazenadas
      const exampleTransactions = [
        { value: 50, comment: "Transação de Teste 1", type: 'A', category: 'Receita', date: new Date().toISOString() },
        { value: 20, comment: "Transação de Teste 2", type: 'B', category: 'Lar', date: new Date().toISOString() },
      ];

      // Ordenando os exemplos e limitando a 100 (caso sejam mais do que isso)
      const sortedExampleTransactions = exampleTransactions.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      ).slice(0, 100);

      setTransactions(sortedExampleTransactions);
      await AsyncStorage.setItem('transactions', JSON.stringify(sortedExampleTransactions));
    }
  } catch (error) {
    console.error("Erro ao carregar histórico", error);
  }
};

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [])
  );

  const removeTransaction = async (index) => {
    const updatedTransactions = transactions.filter((_, i) => i !== index);
    setTransactions(updatedTransactions);
    await AsyncStorage.setItem('transactions', JSON.stringify(updatedTransactions));
  };

  const renderTransaction = ({ item, index }) => {
    // Formatar a data
    const date = new Date(item.date);
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

    return (
      <View style={[
        styles.transactionItem,
        item.type === 'A' ? styles.incomeItem : styles.expenseItem
      ]}>
        <View>
          <Text style={styles.transactionText}>
            {item.category}: R$ {item.value.toFixed(2)}
          </Text>
          {item.comment ? (
            <Text style={styles.commentText}>Comentário: {item.comment}</Text>
          ) : null}
          <Text style={styles.dateText}>Data: {formattedDate}</Text> 
          <Text style={styles.dateText}>Client: {item.clientId}</Text> 
        </View>
        <TouchableOpacity onPress={() => removeTransaction(index)}>
          <Text style={styles.removeButton}>Remover</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{height:645,padding:11}}>
    
      {transactions.length === 0 ? (
        <Text style={styles.emptyMessage}>Nenhuma transação registrada.</Text>
      ) : (
        <FlatList 
          data={transactions}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderTransaction}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  transactionItem: {
    padding: 10,
    marginVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 5,
  },
  incomeItem: {
    backgroundColor: '#d4edda', // Verde claro para receitas
  },
  expenseItem: {
    backgroundColor: '#f8d7da', // Vermelho claro para despesas
  },
  transactionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  commentText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  emptyMessage: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: '#888',
  },
  removeButton: {
    color: 'red',
    fontWeight: 'bold',
  },
});

export default HistoricoScreen;
