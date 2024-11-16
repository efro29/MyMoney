// App.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeScreen from './Home';
import HistoricoScreen from './Historico';
import WeeklyExpensesScreen from './WeeklyExpensesScreen';
import ExpensesByCategory from './ExpensesByCategory';
import NivelPage from './nivel';

// Componentes de Tela adicionais
function SearchScreen() {
  return <View style={styles.screen}><Text>Search Screen</Text></View>;
}
function LikesScreen() {
  return <View style={styles.screen}><Text>Likes Screen</Text></View>;
}
function NotificationsScreen() {
  return <View style={styles.screen}><Text>Notifications Screen</Text></View>;
}
function ProfileScreen() {
  return <View style={styles.screen}><Text>Profile Screen</Text></View>;
}

// Configuração do Bottom Tab Navigator
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            // Configura ícones baseados no nome da rota
            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Historic') {
              iconName = focused ? 'time' : 'time-outline';
            } else if (route.name === 'Categorias') {
              iconName = focused ? 'grid' : 'grid-outline';
            } else if (route.name === 'Notifications') {
              iconName = focused ? 'notifications' : 'notifications-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            }

            return <Icon name={iconName} size={24} color={color} />;
          },
          tabBarActiveTintColor: '#6200ee',
          tabBarInactiveTintColor: '#222',
          tabBarShowLabel: true,
          tabBarShowLabel: false,
          tabBarStyle: styles.tabBar,

          headerStyle: {
            backgroundColor: '#1e153b', height:75// Altere essa cor para customizar o fundo do header
          },
          headerTintColor: '#ffffff', // Cor do texto do header
          headerTitleAlign: 'center', // Centraliza o título do header
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Historic" component={HistoricoScreen} options={{ title: 'Histórico' }} />
        <Tab.Screen name="Categorias" component={ExpensesByCategory} />
        <Tab.Screen name="Profile" component={WeeklyExpensesScreen} />
        <Tab.Screen name="Notifications" component={NivelPage} />
        
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// Estilos
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  tabBar: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ffffff',
    elevation: 10, // sombra mais suave
    shadowColor: '#000', // sombra para iOS
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 8,
    paddingBottom: 5, // ajustes para garantir que os ícones não fiquem cortados
    borderWidth: 1,  // borda fina para um visual mais clean
    borderColor: '#ddd', // borda suave
  },
});