import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import type { RootStackParamList } from './src/types/navigation';
import ListaPontos from './src/screens/ListaPontos';
import DetalhePonto from './src/screens/DetalhePonto';
import CadastroDoacao from './src/screens/CadastroDoacao';
import HistoricoDoacoes from './src/screens/HistoricoDoacoes';
import DetalheDoacao from './src/screens/DetalheDoacao';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator
          initialRouteName="ListaPontos"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="ListaPontos" component={ListaPontos} />
          <Stack.Screen name="DetalhePonto" component={DetalhePonto} />
          <Stack.Screen name="CadastroDoacao" component={CadastroDoacao} />
          <Stack.Screen name="HistoricoDoacoes" component={HistoricoDoacoes} />
          <Stack.Screen name="DetalheDoacao" component={DetalheDoacao} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
