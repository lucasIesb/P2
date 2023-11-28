import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInputMask } from 'react-native-masked-text';
import { Card, IconButton } from 'react-native-paper';



function AdicionarLocalTela({ route, navigation }) {
  const { nome, endereco, custoEstadia, vagas, localIndex } = route.params || {};

  const [nomeLocal, setNomeLocal] = useState(nome || '');
  const [enderecoLocal, setEnderecoLocal] = useState(endereco || '');
  const [custoEstadiaLocal, setCustoEstadiaLocal] = useState(custoEstadia || '');
  const [vagasLocal, setVagasLocal] = useState(vagas || '');

  useEffect(() => {
    if (localIndex !== undefined) {
      setNomeLocal(nome || '');
      setEnderecoLocal(endereco || '');
      setCustoEstadiaLocal(custoEstadia || '');
      setVagasLocal(vagas || '');
    }
  }, [nome, endereco, custoEstadia, vagas, localIndex]);

  const adicionarLocal = async () => {
    try {
      if (!nomeLocal || !enderecoLocal || !custoEstadiaLocal || !vagasLocal) {
        alert('Todos os campos são obrigatórios');
        return;
      }

      // Custo da Estadia validation (simple numeric check)
      const custoEstadiaNumeric = parseFloat(custoEstadiaLocal.replace('R$', '').replace(',', '.'));
      if (isNaN(custoEstadiaNumeric) || custoEstadiaNumeric <= 0) {
        alert('Custo da estadia inválido');
        return;
      }

      // Vagas validation (simple numeric check)
      const vagasNumeric = parseInt(vagasLocal);
      if (isNaN(vagasNumeric) || vagasNumeric <= 0) {
        alert('Número de vagas inválido');
        return;
      }

      const localInfoJSON = await AsyncStorage.getItem('localInfo');
      const localInfo = localInfoJSON ? JSON.parse(localInfoJSON) : [];

      const novoLocal = {
        nome: nomeLocal,
        endereco: enderecoLocal,
        custoEstadia: custoEstadiaLocal,
        vagas: vagasLocal,
      };

      if (localIndex !== undefined) {
        localInfo[localIndex] = novoLocal;
      } else {
        localInfo.push(novoLocal);
      }

      await AsyncStorage.setItem('localInfo', JSON.stringify(localInfo));

      setNomeLocal('');
      setEnderecoLocal('');
      setCustoEstadiaLocal('');
      setVagasLocal('');

      navigation.navigate('Local');
    } catch (error) {
      console.error('Erro ao adicionar local:', error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#8F9779', padding: 20, justifyContent: 'center', marginTop: 50 }}>
      <Text>Cadastro do Local</Text>
      <Card style={{ padding: 16, borderRadius: 8, backgroundColor: '#D2B48C' }}>
        <Text style={{ color: 'white' }}>Nome do Local:</Text>
        <TextInput
          style={{ backgroundColor: 'white', padding: 10, marginBottom: 10, borderRadius: 5 }}
          placeholder="Nome do Local"
          value={nomeLocal}
          onChangeText={(text) => setNomeLocal(text)}
        />

        <Text style={{ color: 'white' }}>Endereço do Local:</Text>
        <TextInput
          style={{ backgroundColor: 'white', padding: 10, marginBottom: 10, borderRadius: 5 }}
          placeholder="Endereço do Local"
          value={enderecoLocal}
          onChangeText={(text) => setEnderecoLocal(text)}
        />

        <Text style={{ color: 'white' }}>Custo da Estadia:</Text>
        <TextInputMask
          style={{ backgroundColor: 'white', padding: 10, marginBottom: 10, borderRadius: 5 }}
          placeholder="Custo da Estadia"
          type={'money'}
          options={{
            precision: 2,
            separator: ',',
            delimiter: '.',
            unit: 'R$',
            suffixUnit: ''
          }}
          value={custoEstadiaLocal}
          onChangeText={(text) => setCustoEstadiaLocal(text)}
        />

        <Text style={{ color: 'white' }}>Vagas para Alunos:</Text>
        <TextInput
          style={{ backgroundColor: 'white', padding: 10, marginBottom: 10, borderRadius: 5 }}
          placeholder="Vagas para Alunos"
          value={vagasLocal}
          onChangeText={(text) => setVagasLocal(text)}
          keyboardType="numeric"
        />

        <IconButton
          icon="content-save"
          color="white"
          size={30}
          style={{ backgroundColor: '#FF6347', alignSelf: 'flex-end', borderRadius: 5 }}
          onPress={adicionarLocal}
        />
      </Card>
    </View>
  );
}

export default AdicionarLocalTela;

