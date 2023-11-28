
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInputMask } from 'react-native-masked-text';
import { Card, IconButton } from 'react-native-paper';

function TelaDeLogin({ route, navigation }) {
  const { nomeAluno, idadeAluno, cpfAluno, emailAluno, treinoIndex } = route.params || {};

  const [nomeAlunoAtual, setNomeAlunoAtual] = useState(nomeAluno || '');
  const [idadeAlunoAtual, setIdadeAlunoAtual] = useState(idadeAluno || '');
  const [senhaAlunoAtual, setSenhaAlunoAtual] = useState('');
  const [cpfAlunoAtual, setCpfAlunoAtual] = useState(cpfAluno || '');
  const [emailAlunoAtual, setEmailAlunoAtual] = useState(emailAluno || '');

  useEffect(() => {
    if (treinoIndex !== undefined) {
      setNomeAlunoAtual(nomeAluno || '');
      setIdadeAlunoAtual(idadeAluno || '');
      setCpfAlunoAtual(cpfAluno || '');
      setEmailAlunoAtual(emailAluno || '');
    }
  }, [nomeAluno, idadeAluno, cpfAluno, emailAluno, treinoIndex]);

  const salvarTreino = async () => {
    try {
      if (!nomeAlunoAtual || !idadeAlunoAtual || !senhaAlunoAtual || !cpfAlunoAtual || !emailAlunoAtual) {
        alert('Todos os campos são obrigatórios');
        return;
      }

      if (nomeAlunoAtual.length < 4) {
        alert('Nome do aluno deve ter pelo menos 4 caracteres');
        return;
      }

      if (isNaN(idadeAlunoAtual) || idadeAlunoAtual <= 0) {
        alert('Idade do aluno inválida');
        return;
      }

      if (senhaAlunoAtual.length < 5) {
        alert('Senha do aluno deve ter pelo menos 5 caracteres');
        return;
      }

      // CPF validation (simple length check)
      if (cpfAlunoAtual.length !== 14) {
        alert('CPF inválido');
        return;
      }

      // Basic email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailAlunoAtual)) {
        alert('Email inválido');
        return;
      }

      const savedTreinosJSON = await AsyncStorage.getItem('savedMuscles');
      const savedTreinos = savedTreinosJSON ? JSON.parse(savedTreinosJSON) : [];

      const nomeTreinoAtual = treinoIndex !== undefined ? `Treino ${String.fromCharCode(65 + treinoIndex)}` : nomeAlunoAtual;

      const novoTreino = {
        nomeAluno: nomeAlunoAtual,
        idadeAluno: idadeAlunoAtual,
        senhaAluno: senhaAlunoAtual,
        cpfAluno: cpfAlunoAtual,
        emailAluno: emailAlunoAtual,
      };

      if (treinoIndex !== undefined) {
        savedTreinos[treinoIndex] = novoTreino;
      } else {
        savedTreinos.push(novoTreino);
      }

      await AsyncStorage.setItem('savedMuscles', JSON.stringify(savedTreinos));

      setNomeAlunoAtual('');
      setIdadeAlunoAtual('');
      setSenhaAlunoAtual('');
      setCpfAlunoAtual('');
      setEmailAlunoAtual('');

      navigation.navigate('Home');
    } catch (error) {
      console.error('Erro ao salvar treino:', error);
    }
  };
  return (
    
    <View style={{ flex: 1, backgroundColor: '#8F9779', padding: 20, justifyContent: 'center', marginTop: 50 }}>
     
      <Text>
        Cadastro do Aluno
      </Text>
  
      <Card style={{ padding: 16, borderRadius: 8, backgroundColor: '#D2B48C' }}>
        <Text style={{ color: 'white' }}>Nome do Aluno:</Text>
        <TextInput
          style={{ backgroundColor: 'white', padding: 10, marginBottom: 10, borderRadius: 5 }}
          placeholder="Nome do Aluno"
          value={nomeAlunoAtual}
          onChangeText={(text) => setNomeAlunoAtual(text)}
        />
  
        <Text style={{ color: 'white' }}>Idade do Aluno:</Text>
        <TextInput
          style={{ backgroundColor: 'white', padding: 10, marginBottom: 10, borderRadius: 5 }}
          placeholder="Idade do Aluno"
          value={idadeAlunoAtual}
          onChangeText={(text) => setIdadeAlunoAtual(text)}
          keyboardType="numeric"
        />
  
        <Text style={{ color: 'white' }}>Senha do Aluno:</Text>
        <TextInput
          style={{ backgroundColor: 'white', padding: 10, marginBottom: 10, borderRadius: 5 }}
          placeholder="Senha do Aluno"
          value={senhaAlunoAtual}
          onChangeText={(text) => setSenhaAlunoAtual(text)}
          secureTextEntry
        />
  
        <Text style={{ color: 'white' }}>Cpf do Aluno:</Text>
        <TextInputMask
          style={{ backgroundColor: 'white', padding: 10, marginBottom: 10, borderRadius: 5 }}
          placeholder="Aluno Cpf"
          type={'cpf'}
          value={cpfAlunoAtual}
          onChangeText={(text) => setCpfAlunoAtual(text)}
        />
  
        <Text style={{ color: 'white' }}>Email do Aluno:</Text>
        <TextInput
          style={{ backgroundColor: 'white', padding: 10, marginBottom: 10, borderRadius: 5 }}
          placeholder="Aluno Email"
          value={emailAlunoAtual}
          onChangeText={(text) => setEmailAlunoAtual(text)}
        />
  
        <IconButton
          icon="content-save"
          color="white"
          size={30}
          style={{ backgroundColor: '#FF6347', alignSelf: 'flex-end', borderRadius: 5 }}
          onPress={salvarTreino}
        />
      </Card>
    </View>
  );

  
}


export default TelaDeLogin;