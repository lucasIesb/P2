import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FAB, Card, Title, Paragraph } from 'react-native-paper';

function HomeTela({ navigation }) {
  const [savedTreinos, setSavedTreinos] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      carregarDados();
    }, [])
  );

  async function carregarDados() {
    try {
      const savedTreinosJSON = await AsyncStorage.getItem('savedMuscles');
      const savedTreinos = savedTreinosJSON ? JSON.parse(savedTreinosJSON) : [];
      setSavedTreinos(savedTreinos);
    } catch (error) {
      console.error('Erro ao recuperar treinos salvos:', error);
    }
  }

  const excluirTreino = async (index) => {
    // Use o componente Alert para mostrar uma caixa de diálogo de confirmação
    Alert.alert(
      'Confirmação',
      'Tem certeza de que deseja excluir este perfil?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Confirmar',
          onPress: async () => {
            try {
              const updatedTreinos = [...savedTreinos];
              updatedTreinos.splice(index, 1);
              await AsyncStorage.setItem('savedMuscles', JSON.stringify(updatedTreinos));
              setSavedTreinos(updatedTreinos);
            } catch (error) {
              console.error('Erro ao excluir treino:', error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Login do Aluno</Text>
      </View>

      <ScrollView>
        {savedTreinos.length > 0 ? (
          savedTreinos.map((treino, index) => (
            <Card key={index} style={{ marginBottom: 16, backgroundColor: '#D2B48C', elevation: 3 }}>
              <Card.Content>
                <Title style={styles.cardTitle}>Nome do Aluno: {treino.nomeAluno || ''}</Title>
                <Paragraph style={styles.cardText}>Idade do Aluno: {treino.idadeAluno || ''}</Paragraph>
                <Paragraph style={styles.cardText}>Senha do Aluno: {treino.senhaAluno || ''}</Paragraph>
                <Paragraph style={styles.cardText}>Cpf do Aluno: {treino.cpfAluno || ''}</Paragraph>
                <Paragraph style={styles.cardText}>Email do Aluno: {treino.emailAluno || ''}</Paragraph>
              </Card.Content>
              <Card.Actions>
                <FAB
                  style={styles.fab}
                  icon="pencil"
                  onPress={async () => {
                    const editedTreino = await navigation.navigate('Login', {
                      nomeAluno: treino.nomeAluno || '',
                      idadeAluno: treino.idadeAluno || '',
                      senhaAluno: treino.senhaAluno || '',
                      cpfAluno: treino.cpfAluno || '',
                      emailAluno: treino.emailAluno || '',
                      treinoIndex: index,
                    });

                    if (editedTreino) {
                      const updatedTreinos = [...savedTreinos];
                      updatedTreinos[index] = editedTreino;
                      await AsyncStorage.setItem('savedMuscles', JSON.stringify(updatedTreinos));
                      setSavedTreinos(updatedTreinos);
                    }
                  }}
                />
                <FAB
                  style={styles.fab}
                  icon="delete"
                  onPress={() => excluirTreino(index)}
                />
              </Card.Actions>
            </Card>
          ))
        ) : (
          <Text style={styles.noTreinosText}>Nenhum treino salvo.</Text>
        )}
      </ScrollView>

      <FAB
        style={styles.fabAdd}
        icon="plus"
        onPress={() => navigation.navigate('Login')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 40, // Add margin top to create space
    backgroundColor: '#8F9779', // Olive Green
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  noTreinosText: {
    fontSize: 16,
    color: '#FFF',
  },
  fab: {
    margin: 8,
  },
  fabAdd: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#FF6347', // Tomato Red
  },
});

export default HomeTela;
