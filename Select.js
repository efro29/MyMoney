import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const Select = ({ options, onSelect }) => {
  const [selectedOption, setSelectedOption] = useState(options[0]); // Define a primeira opção como padrão

  const handleSelect = (value) => {
    setSelectedOption(value);
    onSelect(value); // Passa a opção selecionada para o componente pai
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecione uma opção:</Text>
      <Picker
        selectedValue={selectedOption}
        style={styles.picker}
        onValueChange={handleSelect}
      >
        {options.map((option, index) => (
          <Picker.Item key={index} label={option} value={option} />
        ))}
      </Picker>
      {selectedOption && <Text style={styles.selectedText}>Você escolheu: {selectedOption}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
  },
  picker: {
    width: 200,
    height: 40,
    marginBottom: 10,
  },
  selectedText: {
    fontSize: 16,
    marginTop: 10,
    color: '#3498db',
  },
});

export default Select;
