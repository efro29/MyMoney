import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  appContainer: {
    flex: 6,
    paddingTop: 10,
    backgroundColor: '#b0b0c9',
  },
  container: {
    flex: 1,
    backgroundColor: '#d8d8f1',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 0,
  },
  card: {
    width: '90%',
    padding: 20,
    backgroundColor: '#f4edfa',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
    marginVertical: 10,
  },
  cardContent: {

    flexDirection: 'row', // Coloca a imagem e textos em linha
    alignItems: 'center', // Alinha verticalmente a imagem e o texto
    justifyContent: 'space-between', // Empurra imagem para a esquerda e texto para a direita
    width: '100%', // Garante que a linha ocupe a largura total do card
  },
  walletIcon: {
    width: 15, // Redimensiona a imagem para 15px
    height: 15,
  },
  textContainer: {
    flexDirection: 'column', // Organiza o título e valor em coluna
    alignItems: 'flex-end', // Alinha os textos à extrema direita
  },
  cardTitle: {
    fontSize: 18,
    color: '#6200ee',
    fontWeight: 'bold',
  },
  cardValue: {
    fontSize: 30,
    fontStyle:'normal',
    color: '#333', fontWeight: 'bold', // D
  },

  cardValueSumA: {
    fontSize: 12,
    fontStyle:'normal',
    color: 'green'
  },
  cardValueSumB: {
    fontSize: 12,
    fontStyle:'normal',
    color: 'red'
  },

    buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '93%',
    marginTop: 10,
    margin:10
  },
  buttonA: {
    flex: 1,
    paddingVertical: 15,
    backgroundColor: '#592375',
    borderRadius: 10, // Botões com bordas arredondadas
    marginHorizontal: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 6,
  },
  buttonB: {
    flex: 1,
    paddingVertical: 15,
    backgroundColor: '#8b689e',
    borderRadius: 10,
    marginHorizontal: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 6,
  },
  buttonC: {
    flex: 1,
    paddingVertical: 15,
    backgroundColor: '#33b5e5',
    borderRadius: 10,
    marginHorizontal: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 20,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    padding: 25,
    backgroundColor: '#fff',
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 45,
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#f8f9fa', // Fundo leve no campo de entrada
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },

  // Estilos para o grid e os botões de categorias
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '90%',

  },
  gridButton: {
    width: '48%',
    height: '25%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 11,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  gridButtonText: {
    color: '#493d54',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  walletIcon: {
    width: 100,
    height: 100,
    marginRight: 10, // Mantém o espaço entre a imagem e o texto
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
});
