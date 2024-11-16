import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';

const nivelTabela = [
  { nivel: "Ferro: Gastador", minPontos: 0, cor: "gray" },
  { nivel: "Bronze: Senhor do Cartão de Crédito", minPontos: 100, cor: "#CD7F32" },
  { nivel: "Prata: Aficionado por Descontos", minPontos: 200, cor: "silver" },
  { nivel: "Ouro: Saqueador de Lojas", minPontos: 300, cor: "gold" },
  { nivel: "Muquirana: Milionário de Cartão de Crédito", minPontos: 400, cor: "blue" },
  { nivel: "Conde Claus", minPontos: 500, cor: "green" },
  { nivel: "Mão de Vaca: Mestre da Poupança", minPontos: 600, cor: "purple" }
];

const LevelCard = ({ nivel, cor, pontos }) => (
  <View style={[styles.card, { backgroundColor: cor }]}>
    <Text style={styles.nivelText}>{nivel}</Text>
    <Text style={styles.pontosText}>Pontuação mínima: {pontos} pontos</Text>
  </View>
);

const NivelPage = () => (
  <ScrollView contentContainerStyle={styles.container}>
    {nivelTabela.map((item, index) => (
      <LevelCard 
        key={index} 
        nivel={item.nivel} 
        cor={item.cor} 
        pontos={item.minPontos} 
      />
    ))}
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#f2f2f2',
  },
  card: {
    width: Dimensions.get('window').width - 40,  // Tamanho fixo do card
    height: 150,  // Definindo altura do card, similar a um cartão de crédito
    borderRadius: 12,  // Arredondando as bordas
    marginBottom: 20,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  nivelText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  pontosText: {
    fontSize: 14,
    color: '#fff',
  }
});

export default NivelPage;
