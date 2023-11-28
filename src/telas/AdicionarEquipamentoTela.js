import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInputMask } from 'react-native-masked-text';
import { Card, IconButton } from 'react-native-paper';


function AdicionarEquipamentoTela({ navigation, route }) {
  const [nome, setNome] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [preco, setPreco] = useState('');

  useEffect(() => {
    // Verifica se há informações de equipamento para edição
    if (route.params) {
      const { nome, quantidade, preco } = route.params;
      setNome(nome || '');
      setQuantidade(quantidade ? quantidade.toString() : '');
      setPreco(preco ? preco.toString() : '');
    }
  }, [route.params]);

  const adicionarEquipamento = async () => {
    try {
      if (!nome) {
        alert('O campo Nome é obrigatório');
        return;
      }
  
      const novoEquipamento = {
        nome,
        quantidade: quantidade ? parseInt(quantidade) : 0,
        preco: preco ? parseFloat(preco.replace('R$', '').replace(',', '.')) : 0,
      };
  
      const equipamentosInfoJSON = await AsyncStorage.getItem('equipamentosInfo');
      let equipamentosInfo = equipamentosInfoJSON ? JSON.parse(equipamentosInfoJSON) : [];
  
      if (route.params && route.params.equipamentoIndex !== undefined) {
        // Editar o item existente
        const index = route.params.equipamentoIndex;
        equipamentosInfo[index] = novoEquipamento;
      } else {
        // Adicionar um novo item
        equipamentosInfo.push(novoEquipamento);
      }
  
      await AsyncStorage.setItem('equipamentosInfo', JSON.stringify(equipamentosInfo));
  
      setNome('');
      setQuantidade('');
      setPreco('');
  
      navigation.navigate('EquipamentosTela');
    } catch (error) {
      console.error('Erro ao adicionar equipamento:', error);
    }
  };


return (
  <View style={{ flex: 1, backgroundColor: '#8F9779', padding: 20, justifyContent: 'center', marginTop: 50 }}>
    <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#FFF', marginBottom: 20 }}>Adicionar Equipamento</Text>
    <Card style={{ padding: 16, borderRadius: 8, backgroundColor: '#D2B48C' }}>
      <Text style={{ color: 'white' }}>Nome do Equipamento:</Text>
      <TextInput
        style={{ backgroundColor: 'white', padding: 10, marginBottom: 10, borderRadius: 5 }}
        placeholder="Nome do Equipamento"
        value={nome}
        onChangeText={(text) => setNome(text)}
      />

      <Text style={{ color: 'white' }}>Quantidade:</Text>
      <TextInput
        style={{ backgroundColor: 'white', padding: 10, marginBottom: 10, borderRadius: 5 }}
        placeholder="Quantidade"
        value={quantidade}
        onChangeText={(text) => setQuantidade(text.replace(/[^0-9]/g, ''))}
        keyboardType="numeric"
      />

      <Text style={{ color: 'white' }}>Preço:</Text>
      <TextInputMask
        style={{ backgroundColor: 'white', padding: 10, marginBottom: 10, borderRadius: 5 }}
        placeholder="Preço"
        type={'money'}
        options={{
          precision: 2,
          separator: ',',
          delimiter: '.',
          unit: 'R$ ',
          suffixUnit: ''
        }}
        value={preco}
        onChangeText={(text) => setPreco(text)}
      />

      <IconButton
        icon="content-save"
        color="white"
        size={30}
        style={{ backgroundColor: '#FF6347', alignSelf: 'flex-end', borderRadius: 5, marginTop: 20 }}
        onPress={adicionarEquipamento}
      />
    </Card>
  </View>
);
}

export default AdicionarEquipamentoTela;
