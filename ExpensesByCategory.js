import React, { useState, useCallback } from 'react';
import { Text, View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

function ExpensesByCategory() {
  const [transactions, setTransactions] = useState([]);
  const [groupedTransactions, setGroupedTransactions] = useState({});

  const loadTransactions = async () => {
    try {
      const storedTransactions = await AsyncStorage.getItem('transactions');
      if (storedTransactions !== null) {
        const parsedTransactions = JSON.parse(storedTransactions);
        // console.log("Transações carregadas:", parsedTransactions);

        // Ordenando as transações por data do mais recente para o mais antigo
        const sortedTransactionsDesc = parsedTransactions.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        // Limitando o número de registros a 100
        const limitedTransactions = sortedTransactionsDesc.slice(0, 100);
        
        // Agrupando as transações por categoria
        const grouped = limitedTransactions.reduce((acc, transaction) => {
          const { category, value, type } = transaction;
        
          if (!acc[category]) {
            acc[category] = { transactions: [], total: 0 };
          }
        
          // Soma o valor de acordo com o tipo (receita ou despesa)
          acc[category].transactions.push(transaction);
          acc[category].total += type === 'A' ? value : -value; // Receita (A) soma, despesa (B) subtrai
        
          return acc;
        }, {});

        setTransactions(limitedTransactions);
        setGroupedTransactions(grouped);
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

        // Agrupando as transações por categoria
        const grouped = sortedExampleTransactions.reduce((acc, transaction) => {
          const { category } = transaction;
          if (!acc[category]) acc[category] = [];
          acc[category].push(transaction);
          return acc;
        }, {});

        setTransactions(sortedExampleTransactions);
        setGroupedTransactions(grouped);
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

  const removeTransaction = async (category, index) => {
    const updatedTransactions = [...transactions];
    updatedTransactions.splice(index, 1);

    // Atualizando o estado de transações agrupadas
    const updatedGroupedTransactions = { ...groupedTransactions };
    updatedGroupedTransactions[category].splice(index, 1);

    if (updatedGroupedTransactions[category].length === 0) {
      delete updatedGroupedTransactions[category];
    }

    setTransactions(updatedTransactions);
    setGroupedTransactions(updatedGroupedTransactions);
    await AsyncStorage.setItem('transactions', JSON.stringify(updatedTransactions));
  };




  

  const renderTransaction = ({ item, index, category }) => {
    // Formatar a data
    const date = new Date(item.date);
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

    return (
      <View style={[styles.transactionItemCategory, item.type === 'A' ? styles.incomeItem : styles.expenseItem]}>
           <Text style={styles.dateText}>{formattedDate}</Text>

          
          <Text style={styles.dateText}>{item.clientId}</Text>
     
        <TouchableOpacity onPress={() => removeTransaction(category, index)}>
          <Text  style={[ item.type === 'A' ? styles.receita : styles.despesa]}>   {item.type === 'A' ? "+" : "-"} R$ {item.value.toFixed(2)}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderCategory = ({ item: [category, { transactions, total }] }) => (
    <View style={styles.categoryContainer}>
      <View style={styles.categoryHeader}>
        <Text style={styles.categoryTitle}>{category}  <Text style={{color:'black',fontSize:16}}>R$ {total.toFixed(2)}</Text></Text>
       
      </View>
      <FlatList
        data={transactions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={(transactionItem) => renderTransaction({ ...transactionItem, category })}
      />
    </View>
  );
  

  return (
    <View style={styles.container}>
      {Object.keys(groupedTransactions).length === 0 ? (
        <Text style={styles.emptyMessage}>Nenhuma transação registrada.</Text>
      ) : (
        <FlatList
          data={Object.entries(groupedTransactions)}
          keyExtractor={(item) => item[0]} // Nome da categoria como chave
          renderItem={renderCategory}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
   
    padding: 10,
    backgroundColor: '#f0f0f0',
    height:645,padding:11
  },
  categoryContainer: {
    marginVertical: 4,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#28626A',
    marginBottom: 10,
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
  transactionItemCategory: {
    padding: 5,
    marginVertical: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 5,
  },
  incomeItem: {
    backgroundColor: '#ccfff4', // Verde claro para receitas
  },
  expenseItem: {
    backgroundColor: '#fff', // Vermelho claro para despesas
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
    color: 'black',
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
  despesa: {
    color: 'red',
    fontWeight: 'bold',
  },
  receita: {
    color: 'green',
    fontWeight: 'bold',
  },
});

export default ExpensesByCategory;
