import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function CategoriaScreen({ navigation }) {
  const [categoryName, setCategoryName] = useState('');
  const [categoryColor, setCategoryColor] = useState('#000000'); // Definindo a cor padrão

  const saveCategory = async () => {
    if (!categoryName) {
      Alert.alert('Erro', 'Por favor, insira o nome da categoria');
      return;
    }

    const newCategory = {
      name: categoryName,
      color: categoryColor,
    };

    try {
      const storedCategories = await AsyncStorage.getItem('categories');
      const categories = storedCategories ? JSON.parse(storedCategories) : [];
      categories.push(newCategory);
      await AsyncStorage.setItem('categories', JSON.stringify(categories));

      Alert.alert('Categoria adicionada', `Categoria ${categoryName} foi salva com sucesso!`);
      navigation.goBack(); // Voltar para a tela anterior
    } catch (error) {
      console.error('Erro ao salvar categoria', error);
      Alert.alert('Erro', 'Houve um problema ao salvar a categoria');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adicionar Nova Categoria</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome da Categoria"
        value={categoryName}
        onChangeText={setCategoryName}
      />

      <TextInput
        style={styles.input}
        placeholder="Cor da Categoria (Exemplo: #FF0000)"
        value={categoryColor}
        onChangeText={setCategoryColor}
      />

      <Button title="Salvar Categoria" onPress={saveCategory} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default CategoriaScreen;
