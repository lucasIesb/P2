import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInputMask } from 'react-native-masked-text';
import { Card, IconButton } from 'react-native-paper';

function VeiculoLoginTela({ route, navigation }) {
  const { nome, tipo, autonomia, veiculoIndex } = route.params || {};

  const [nomeVeiculo, setNomeVeiculo] = useState(nome || '');
  const [tipoVeiculo, setTipoVeiculo] = useState(tipo || '');
  const [autonomiaVeiculo, setAutonomiaVeiculo] = useState(autonomia || '');

  useEffect(() => {
    if (veiculoIndex !== undefined) {
      setNomeVeiculo(nome || '');
      setTipoVeiculo(tipo || '');
      setAutonomiaVeiculo(autonomia || '');
    }
  }, [nome, tipo, autonomia, veiculoIndex]);

  const adicionarVeiculo = async () => {
    try {
      if (!nomeVeiculo || !tipoVeiculo || !autonomiaVeiculo) {
        alert('Todos os campos são obrigatórios');
        return;
      }

      // Autonomia validation (simple numeric check)
      const autonomiaNumeric = parseInt(autonomiaVeiculo);
      if (isNaN(autonomiaNumeric) || autonomiaNumeric <= 0) {
        alert('Autonomia inválida');
        return;
      }

      const veiculoInfoJSON = await AsyncStorage.getItem('veiculoInfo');
      const veiculoInfo = veiculoInfoJSON ? JSON.parse(veiculoInfoJSON) : [];

      const novoVeiculo = {
        nome: nomeVeiculo,
        tipo: tipoVeiculo,
        autonomia: autonomiaVeiculo,
      };

      if (veiculoIndex !== undefined) {
        veiculoInfo[veiculoIndex] = novoVeiculo;
      } else {
        veiculoInfo.push(novoVeiculo);
      }

      await AsyncStorage.setItem('veiculoInfo', JSON.stringify(veiculoInfo));

      setNomeVeiculo('');
      setTipoVeiculo('');
      setAutonomiaVeiculo('');

      navigation.navigate('Veiculo');
    } catch (error) {
      console.error('Erro ao adicionar veículo:', error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#8F9779', padding: 20, justifyContent: 'center', marginTop: 50 }}>
      <Text>Cadastro do Veículo</Text>
      <Card style={{ padding: 16, borderRadius: 8, backgroundColor: '#D2B48C' }}>
        <Text style={{ color: 'white' }}>Nome do Veículo:</Text>
        <TextInput
          style={{ backgroundColor: 'white', padding: 10, marginBottom: 10, borderRadius: 5 }}
          placeholder="Nome do Veículo"
          value={nomeVeiculo}
          onChangeText={(text) => setNomeVeiculo(text)}
        />

        <Text style={{ color: 'white' }}>Tipo do Veículo:</Text>
        <TextInput
          style={{ backgroundColor: 'white', padding: 10, marginBottom: 10, borderRadius: 5 }}
          placeholder="Tipo do Veículo"
          value={tipoVeiculo}
          onChangeText={(text) => setTipoVeiculo(text)}
        />

        <Text style={{ color: 'white' }}>Autonomia (km):</Text>
        <TextInput
          style={{ backgroundColor: 'white', padding: 10, marginBottom: 10, borderRadius: 5 }}
          placeholder="Autonomia"
          value={autonomiaVeiculo}
          onChangeText={(text) => setAutonomiaVeiculo(text)}
          keyboardType="numeric"
        />

        <IconButton
          icon="content-save"
          color="white"
          size={30}
          style={{ backgroundColor: '#FF6347', alignSelf: 'flex-end', borderRadius: 5 }}
          onPress={adicionarVeiculo}
        />
      </Card>
    </View>
  );
}

export default VeiculoLoginTela;

