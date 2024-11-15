import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Modal, TextInput, Button, Alert, SafeAreaView ,Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';
import Icon from 'react-native-vector-icons/FontAwesome'; // Importando o FontAwesome para ícones
import { Divider } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import CircularProgress from './CircularProgress';

function HomeScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedButton, setSelectedButton] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [comment, setComment] = useState('');
  const [initialBalance, setInitialBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [clients, setClients] = useState([]);

  const [selectedClient, setSelectedClient] = useState(null);
  const clientItems = clients.map(client => ({
    label: client.name, // Exibe o nome do cliente
    value: client.name, // Usamos o ID como o valor único para o cliente
  }));

  const now = new Date();
  const currentMonth = now.getMonth(); // Mês atual (0 = Janeiro, 11 = Dezembro)
  const currentYear = now.getFullYear(); // Ano

  const sumTypeA = transactions
  .filter(item => {
    const itemDate = new Date(item.date);
    return (
      item.type === "A" &&
      itemDate.getMonth() === currentMonth && // Verifica se o mês é o atual
      itemDate.getFullYear() === currentYear // Verifica se o ano é o atual
    );
  })
  .reduce((sum, item) => sum + item.value, 0);

  const sumTypeB = transactions
  .filter(item => {
    const itemDate = new Date(item.date);
    return (
      item.type === "B" &&
      itemDate.getMonth() === currentMonth && // Verifica se o mês é o atual
      itemDate.getFullYear() === currentYear // Verifica se o ano é o atual
    );
  })
  .reduce((sum, item) => sum + item.value, 0);
  

  const loadClients = async () => {
    try {
      const storedClients = await AsyncStorage.getItem('clients');
      return storedClients ? JSON.parse(storedClients) : [];
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      return [];
    }
  };

  const loadInitialBalance = async () => {
    try {
      const storedBalance = await AsyncStorage.getItem('initialUBalance');
      const storedTransactions = await AsyncStorage.getItem('transactions');
      if (storedBalance !== null) {
        setInitialBalance(parseFloat(storedBalance));
      }
      if (storedTransactions !== null) {
        setTransactions(JSON.parse(storedTransactions));
      }
    } catch (error) {
      console.error("Erro ao carregar dados", error);
    }
  };






  useEffect(() => {
    const intervalId = setInterval(async () => {
      const loadedClients = await loadClients();
      setClients(loadedClients);
    }, 1000); // Atualiza a cada 1000ms (1 segundo)

    // Limpeza do intervalo quando o componente for desmontado
    return () => clearInterval(intervalId);
  }, []);


  useEffect(() => {
    loadInitialBalance();
  }, []);

  const openModal = (button) => {
    setSelectedButton(button);
    setModalVisible(true);
    setInputValue('');
    setComment('');
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const insertValue = async () => {
    if (!inputValue || isNaN(inputValue)) {
      Alert.alert("Erro", "Por favor, insira um valor numérico.");
      return;
    }

    const newValue = parseFloat(inputValue);
    let updatedBalance;
    
    // Obtenha a data e hora atuais
    const now = new Date().toISOString();

    let transaction = { 
      value: newValue, 
      comment, 
      category: comment || "Outros", 
      type: selectedButton,
      date: now ,clientId: selectedClient
    };

    if (selectedButton === 'A') {
      updatedBalance = initialBalance + newValue;
      Alert.alert("Valor Inserido", `R$ ${newValue.toFixed(2)} foi adicionado ao saldo inicial. Comentário: ${comment}`);
    } else if (selectedButton === 'B') {
      if (newValue > initialBalance) {
        Alert.alert("Erro", "Não é possível subtrair um valor maior que o saldo atual.");
        return;
      }
      updatedBalance = initialBalance - newValue;
      Alert.alert("Valor Subtraído", `R$ ${newValue.toFixed(2)} foi subtraído do saldo inicial. Comentário: ${comment}`);
    } else if (selectedButton === 'C') {
      updatedBalance = newValue;
      Alert.alert("Novo Saldo Definido");
    }

    setInitialBalance(updatedBalance);
    const updatedTransactions = [...transactions, transaction];
    setTransactions(updatedTransactions);

    try {
      await AsyncStorage.setItem('initialBalance', updatedBalance.toString());
      await AsyncStorage.setItem('transactions', JSON.stringify(updatedTransactions));
    } catch (error) {
      console.error("Erro ao salvar dados", error);
    }

    closeModal();
  };

  const calculateCategoryPercentages = () => {
    const totalSpent = transactions.reduce((acc, transaction) => {
      return transaction.type === 'B' ? acc + transaction.value : acc;
    }, 0);

    const categoryTotals = {
      Lar: 0,
      Transporte: 0,
      Alimentação: 0,
      Lazer: 0,
      Saude: 0,Estudos: 0,
    };

    transactions.forEach(transaction => {
      if (transaction.type === 'B' && categoryTotals[transaction.category] !== undefined) {
        categoryTotals[transaction.category] += transaction.value;
      }
    });

    const categoryPercentages = {};
    Object.keys(categoryTotals).forEach(category => {
      categoryPercentages[category] = totalSpent > 0 ? (categoryTotals[category] / totalSpent * 100).toFixed(2) : 0;
    });

    return categoryPercentages;
  };

  const categoryPercentages = calculateCategoryPercentages();

  // Definindo cores e ícones para cada categoria
  const categoryStyles = {
    Lar: { color: '#f4edfa', icon: 'home' },
    Transporte: { color: '#f4edfa', icon: 'car' },
    Alimentação: { color: '#f4edfa', icon: 'coffee' }, // Usando 'food' para Alimentação
    Lazer: { color: '#f4edfa', icon: 'gamepad' }, // Usando 'cocktail' para Lazer,
    Saude: { color: '#f4edfa', icon: 'heart' }, // Usando 'cocktail' para Lazer
    Estudos: { color: '#f4edfa', icon: 'pencil' }, // Usando 'cocktail' para Lazer
  };

  return (
    <SafeAreaView style={styles.appContainer}>
      
      <View style={styles.container}>
      <View style={styles.card}>

            <View style={styles.cardContent}>
              <Image
                source={require('./assets/carteira.png')} // Certifique-se de adicionar a imagem em assets
                style={styles.walletIcon}
                />
                <View style={styles.textContainer}>
                <Text style={styles.cardTitle}>Carteira</Text>
                  <Text style={styles.cardValue}>
                  R$ {initialBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Text>
                  <View style={styles.cardContent}>
                    <Text style={styles.cardValueSumA}>
                    Total Receita R$ {sumTypeA.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Text>
                  </View>
                  <View style={styles.cardContent}>
                    <Text style={styles.cardValueSumB}>
                    Total Despesas R$ {sumTypeB.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Text>
                  </View>
                </View>
              </View>
            </View>


            <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.buttonA} onPress={() => openModal('A')}>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
             <Icon style={{ marginRight: 5 }} name={'plus'} size={15} color="#fff" />
             <Text style={styles.buttonText}>Receita</Text>
           </View>

          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonB} onPress={() => openModal('B')}>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
             <Icon style={{ marginRight: 5 }} name={'minus'} size={15} color="#fff" />
             <Text style={styles.buttonText}>Despesa</Text>
            </View>

          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonC} onPress={() => openModal('C')}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon style={{ marginRight: 5 }} name={'refresh'} size={15} color="#fff" />
                <Text style={styles.buttonText}>Redefinir</Text>
              </View>
          </TouchableOpacity>
        </View>





        <View style={styles.gridContainer}>
          {['Lar', 'Transporte', 'Alimentação', 'Lazer','Saude','Estudos'].map((category) => (
            <TouchableOpacity
              key={category}
              style={[styles.gridButton, { backgroundColor: categoryStyles[category].color }]}
              onPress={() => openModal('B') & setComment(category)}
            >
    
              {/* <Text style={styles.gridButtonText}>{categoryPercentages[category]}%</Text> */}
         
              <CircularProgress ico={categoryStyles[category].icon} percent={categoryPercentages[category]} size={80} strokeWidth={7} color="#3b5998" />
             
                   <Text style={styles.gridButtonText}>{category}</Text>
            </TouchableOpacity>
          ))}
        </View>

        
       

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Insira o valor para o botão {selectedButton}</Text>
              <TextInput
                style={styles.input}
                placeholder="R$ 0,00"
                keyboardType="numeric"
                value={inputValue}
                onChangeText={setInputValue}
              />
              <TextInput
                style={styles.input}
                placeholder="Comentário (opcional)"
                value={comment}
                onChangeText={setComment}
              />

<RNPickerSelect
 style={{
  inputIOS: styles.input, // Estilo para iOS
  inputAndroid: styles.input, // Estilo para Android
}}
        onValueChange={(value) => {
          console.log('Cliente selecionado ID:', value);
          setSelectedClient(value); // Atualiza o estado com o cliente selecionado
        }}
        items={clientItems} // Passando os clientes mapeados
      />

              <View style={styles.modalButtonContainer}>
                <Button title="Inserir" onPress={insertValue} />
                <Button title="Fechar" onPress={closeModal} />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>

    
    
  );

  
}



export default HomeScreen;