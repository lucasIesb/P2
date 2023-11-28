import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FAB, Card, Title, Paragraph } from 'react-native-paper';

function TutorTela({ navigation }) {
  const [savedTutors, setSavedTutors] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      carregarDados();
    }, [])
  );

  async function carregarDados() {
    try {
      const savedTutorsJSON = await AsyncStorage.getItem('savedTutors');
      const savedTutors = savedTutorsJSON ? JSON.parse(savedTutorsJSON) : [];
      setSavedTutors(savedTutors);
    } catch (error) {
      console.error('Erro ao recuperar tutores salvos:', error);
    }
  }

  const excluirTutor = async (index) => {
    Alert.alert(
      'Confirmação',
      'Tem certeza de que deseja excluir este tutor?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Confirmar',
          onPress: async () => {
            try {
              const updatedTutors = [...savedTutors];
              updatedTutors.splice(index, 1);
              await AsyncStorage.setItem('savedTutors', JSON.stringify(updatedTutors));
              setSavedTutors(updatedTutors);
            } catch (error) {
              console.error('Erro ao excluir tutor:', error);
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
        <Text style={styles.headerText}>Informações do Tutor</Text>
      </View>

      <ScrollView>
        {savedTutors.length > 0 ? (
          savedTutors.map((tutor, index) => (
            <Card key={index} style={{ marginBottom: 16, backgroundColor: '#D2B48C', elevation: 3 }}>
              <Card.Content>
                <Title style={styles.cardTitle}>Nome do Tutor: {tutor.TutorNome || ''}</Title>
                <Paragraph style={styles.cardText}>Senha do Tutor: {tutor.TutorSenha || ''}</Paragraph>
                <Paragraph style={styles.cardText}>Telefone do Tutor: {tutor.TutorTelefone || ''}</Paragraph>
                <Paragraph style={styles.cardText}>Turma do Tutor: {tutor.TutorTurma || ''}</Paragraph>
              </Card.Content>
              <Card.Actions>
                <FAB
                  style={styles.fab}
                  icon="pencil"
                  onPress={async () => {
                    const editedTutor = await navigation.navigate('TutorLogin', {
                      TutorNome: tutor.TutorNome || '',
                      TutorSenha: tutor.TutorSenha || '',
                      TutorTelefone: tutor.TutorTelefone || '',
                      TutorTurma: tutor.TutorTurma || '',
                      tutorIndex: index,
                    });

                    if (editedTutor) {
                      const updatedTutors = [...savedTutors];
                      updatedTutors[index] = editedTutor;
                      await AsyncStorage.setItem('savedTutors', JSON.stringify(updatedTutors));
                      setSavedTutors(updatedTutors);
                    }
                  }}
                />
                <FAB
                  style={styles.fab}
                  icon="delete"
                  onPress={() => excluirTutor(index)}
                />
              </Card.Actions>
            </Card>
          ))
        ) : (
          <Text style={styles.noTutorsText}>Nenhum tutor salvo.</Text>
        )}
      </ScrollView>

      <FAB
        style={styles.fabAdd}
        icon="plus"
        onPress={() => navigation.navigate('TutorLogin')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 40,
    backgroundColor: '#8F9779',
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
  noTutorsText: {
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
    backgroundColor: '#FF6347',
  },
});

export default TutorTela;

