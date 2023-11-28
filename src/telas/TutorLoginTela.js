import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInputMask } from 'react-native-masked-text';
import { Card, IconButton } from 'react-native-paper';

function TutorLoginTela({ route, navigation }) {
  const { TutorNome, TutorSenha, TutorTelefone, TutorTurma, tutorIndex } = route.params || {};

  const [TutorNomeAtual, setTutorNomeAtual] = useState(TutorNome || '');
  const [TutorSenhaAtual, setTutorSenhaAtual] = useState(TutorSenha || '');
  const [TutorTelefoneAtual, setTutorTelefoneAtual] = useState(TutorTelefone || '');
  const [TutorTurmaAtual, setTutorTurmaAtual] = useState(TutorTurma || '');

  useEffect(() => {
    if (tutorIndex !== undefined) {
      setTutorNomeAtual(TutorNome || '');
      setTutorSenhaAtual(TutorSenha || '');
      setTutorTelefoneAtual(TutorTelefone || '');
      setTutorTurmaAtual(TutorTurma || '');
    }
  }, [TutorNome, TutorSenha, TutorTelefone, TutorTurma, tutorIndex]);

  const salvarTutor = async () => {
    try {
      if (!TutorNomeAtual || !TutorSenhaAtual || !TutorTelefoneAtual || !TutorTurmaAtual) {
        alert('Todos os campos são obrigatórios');
        return;
      }

      if (TutorNomeAtual.length < 4) {
        alert('Nome do tutor deve ter pelo menos 4 caracteres');
        return;
      }

      if (TutorSenhaAtual.length < 5) {
        alert('Senha do tutor deve ter pelo menos 5 caracteres');
        return;
      }

      if (TutorTelefoneAtual.length !== 14) {
        alert('Telefone do tutor inválido');
        return;
      }

      if (TutorTurmaAtual.length > 2) {
        alert('A turma do tutor deve ter no máximo 2 caracteres');
        return;
      }

      const savedTutorsJSON = await AsyncStorage.getItem('savedTutors');
      const savedTutors = savedTutorsJSON ? JSON.parse(savedTutorsJSON) : [];

      const novoTutor = {
        TutorNome: TutorNomeAtual,
        TutorSenha: TutorSenhaAtual,
        TutorTelefone: TutorTelefoneAtual,
        TutorTurma: TutorTurmaAtual,
      };

      if (tutorIndex !== undefined) {
        savedTutors[tutorIndex] = novoTutor;
      } else {
        savedTutors.push(novoTutor);
      }

      await AsyncStorage.setItem('savedTutors', JSON.stringify(savedTutors));

      setTutorNomeAtual('');
      setTutorSenhaAtual('');
      setTutorTelefoneAtual('');
      setTutorTurmaAtual('');

      navigation.navigate('TutorTela');
    } catch (error) {
      console.error('Erro ao salvar tutor:', error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#8F9779', padding: 20, justifyContent: 'center', marginTop: 50 }}>
      <Text>Cadastro do Tutor</Text>
      <Card style={{ padding: 16, borderRadius: 8, backgroundColor: '#D2B48C' }}>
        <Text style={{ color: 'white' }}>Nome do Tutor:</Text>
        <TextInput
          style={{ backgroundColor: 'white', padding: 10, marginBottom: 10, borderRadius: 5 }}
          placeholder="Nome do Tutor"
          value={TutorNomeAtual}
          onChangeText={(text) => setTutorNomeAtual(text)}
        />

        <Text style={{ color: 'white' }}>Senha do Tutor:</Text>
        <TextInput
          style={{ backgroundColor: 'white', padding: 10, marginBottom: 10, borderRadius: 5 }}
          placeholder="Senha do Tutor"
          value={TutorSenhaAtual}
          onChangeText={(text) => setTutorSenhaAtual(text)}
          secureTextEntry
        />

        <Text style={{ color: 'white' }}>Telefone do Tutor:</Text>
        <TextInputMask
          style={{ backgroundColor: 'white', padding: 10, marginBottom: 10, borderRadius: 5 }}
          placeholder="Telefone do Tutor"
          type={'cel-phone'}
          value={TutorTelefoneAtual}
          onChangeText={(text) => setTutorTelefoneAtual(text)}
        />

        <Text style={{ color: 'white' }}>Turma do Tutor (máx. 2 caracteres):</Text>
        <TextInput
          style={{ backgroundColor: 'white', padding: 10, marginBottom: 10, borderRadius: 5 }}
          placeholder="Turma do Tutor"
          value={TutorTurmaAtual}
          onChangeText={(text) => setTutorTurmaAtual(text)}
          maxLength={2}
        />

        <IconButton
          icon="content-save"
          color="white"
          size={30}
          style={{ backgroundColor: '#FF6347', alignSelf: 'flex-end', borderRadius: 5 }}
          onPress={salvarTutor}
        />
      </Card>
    </View>
  );
}

export default TutorLoginTela;
