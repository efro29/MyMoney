import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, TextInput, FlatList, StyleSheet, Alert, TouchableOpacity, Modal, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';

// Função para adicionar barras na data enquanto o usuário digita
const formatDate = (text) => {
  let cleanedText = text.replace(/\D/g, '');
  
  if (cleanedText.length <= 2) {
    cleanedText = cleanedText.replace(/(\d{2})(\d{0,2})/, '$1/$2');
  } else if (cleanedText.length <= 4) {
    cleanedText = cleanedText.replace(/(\d{2})(\d{2})(\d{0,4})/, '$1/$2/$3');
  } else {
    cleanedText = cleanedText.replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3');
  }

  return cleanedText;
};

const getRandomColor = () => {
  // Gerar cores escuras (de 0 a 128 para garantir uma cor mais escura)
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    // Gerar números entre 0-8 (cores mais escuras)
    const value = Math.floor(Math.random() * 8);
    color += letters[value * 2]; // Garantir uma cor mais escura
  }
  return color;
};

const saveClients = async (clients) => {
  try {
    await AsyncStorage.setItem('clients', JSON.stringify(clients));
  } catch (error) {
    console.error('Erro ao salvar clientes:', error);
  }
};

const loadClients = async () => {
  try {
    const storedClients = await AsyncStorage.getItem('clients');
    return storedClients ? JSON.parse(storedClients) : [];
  } catch (error) {
    console.error('Erro ao carregar clientes:', error);
    return [];
  }
};

const WeeklyExpensesScreen = () => {
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [clients, setClients] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingClient, setEditingClient] = useState(null); // Estado para cliente em edição

  useEffect(() => {
    const fetchClients = async () => {
      const loadedClients = await loadClients();
      setClients(loadedClients);
    };
    fetchClients();
  }, []);

  const handleAddClient = async () => {
    if (!name.trim() || !birthdate.trim()) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    const newClient = {
      id: Date.now().toString(),
      name,
      birthdate,
      color: getRandomColor(),
      registrationDate: new Date().toLocaleDateString(), // Data atual formatada
    };

    const updatedClients = [...clients, newClient];
    await saveClients(updatedClients);
    setClients(updatedClients);
    setName('');
    setBirthdate('');
    setModalVisible(false);
  };

  const handleEditClient = async () => {
    if (!name.trim() || !birthdate.trim()) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    const updatedClients = clients.map((client) =>
      client.id === editingClient.id
        ? { ...client, name, birthdate }
        : client
    );
    await saveClients(updatedClients);
    setClients(updatedClients);
    setName('');
    setBirthdate('');
    setEditingClient(null);
    setModalVisible(false);
  };

  const handleDeleteClient = async (id) => {
    Alert.alert(
      'Confirmar exclusão',
      'Você tem certeza que deseja excluir este cliente?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Deletar',
          style: 'destructive',
          onPress: async () => {
            const updatedClients = clients.filter((client) => client.id !== id);
            await saveClients(updatedClients);
            setClients(updatedClients);
          },
        },
      ]
    );
  };

  const renderClientCard = ({ item }) => (
    <View style={styles.cardContainer}>
      {/* Simulando uma textura com gradientes e linhas */}
      <View
        style={[styles.card, { backgroundColor: item.color, borderColor: item.color }]}
      >
        {/* Botões Deletar e Editar */}
        <View style={styles.buttonsContainer}>
          {/* Botão Editar */}
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => {
              setEditingClient(item);
              setName(item.name);
              setBirthdate(item.birthdate);
              setModalVisible(true);
            }}
          >
            <MaterialIcons name="edit" size={24} color="#fff" />
          </TouchableOpacity>

          {/* Botão Deletar */}
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteClient(item.id)}
          >
            <MaterialIcons name="delete" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Nome do Banco e Ícone */}
        <View style={styles.bankContainer}>
          <MaterialIcons name="account-balance" size={16} color="rgba(255, 255, 255, 0.8)" />
          <Text style={styles.bankName}>My Money</Text>
        </View>

        {/* Nome do Cliente (Resumido) */}
        <Text style={styles.cardText}>
          {item.name.length > 15 ? item.name.slice(0, 15) + '...' : item.name}
        </Text>

        {/* Número de "Cartão de Crédito" */}
        <Text style={styles.cardId}>
          {item.id.slice(0, 4)} {item.id.slice(4, 8)} {item.id.slice(8, 12)} {item.id.slice(12)}
        </Text>

        {/* Data de Solicitação do Cartão e Data de Aniversário lado a lado */}
        <View style={styles.dateContainer}>
          <Text style={styles.registrationDate}>Solicitado em: {item.registrationDate}</Text>
          <Text style={styles.birthDate}>Aniversário: {item.birthdate}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>


      {/* Botão para abrir o modal */}
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <MaterialIcons name="add" size={24} color="purple" />
        <Text style={styles.addButtonText}>Adicionar Cliente</Text>
      </TouchableOpacity>

      <FlatList
        data={clients}
        keyExtractor={(item) => item.id}
        renderItem={renderClientCard}
        contentContainerStyle={styles.list}
      />

      {/* Modal para inserir ou editar cliente */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {editingClient ? 'Editar Cliente' : 'Adicionar Cliente'}
            </Text>

            {/* Campo Nome */}
            <TextInput
              placeholder="Digite o nome do cliente"
              value={name}
              onChangeText={setName}
              style={styles.modalInput}
            />

            {/* Campo Data de Aniversário com máscara */}
            <TextInput
              placeholder="Digite a data de aniversário (DD/MM/AAAA)"
              value={birthdate}
              onChangeText={(text) => setBirthdate(formatDate(text))}
              style={styles.modalInput}
              keyboardType="numeric"
            />

            <View style={styles.modalButtons}>
              <Button title="Cancelar" onPress={() => setModalVisible(false)} color="#888" />
              <Button
                title={editingClient ? 'Salvar Alterações' : 'Adicionar'}
                onPress={editingClient ? handleEditClient : handleAddClient}
                color="#33b5e5"
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: 'purple',
    fontSize: 16,
    marginLeft: 10,
  },
  list: {
    flexGrow: 1,
  },
  cardContainer: {
    marginVertical: 10,
  },
  card: {
    padding: 20,
    borderRadius: 15,
    position: 'relative',
    elevation: 5,
  },
  bankContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bankName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 5,
  },
  cardText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 50,
  },
  cardId: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 5,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  registrationDate: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  birthDate: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  buttonsContainer: {
    position: 'absolute',
    top: 10,
    right: 10,gap:2,
    flexDirection: 'row',
  },
  editButton: {
    backgroundColor: '#444',
    borderRadius: 5,
    padding: 8,
    marginLeft: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#444',
    borderRadius: 5,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalInput: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 15,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default WeeklyExpensesScreen;
