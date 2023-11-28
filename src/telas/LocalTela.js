import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FAB, Card, Title, Paragraph } from 'react-native-paper';

function LocalTela({ navigation }) {
  const [localInfo, setLocalInfo] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      carregarDados();
    }, [])
  );

  async function carregarDados() {
    try {
      const localInfoJSON = await AsyncStorage.getItem('localInfo');
      const localInfo = localInfoJSON ? JSON.parse(localInfoJSON) : [];
      setLocalInfo(localInfo);
    } catch (error) {
      console.error('Erro ao recuperar informações de locais:', error);
    }
  }

  const excluirLocal = async (index) => {
    Alert.alert(
      'Confirmação',
      'Tem certeza de que deseja excluir este local?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Confirmar',
          onPress: async () => {
            try {
              const updatedLocalInfo = [...localInfo];
              updatedLocalInfo.splice(index, 1);
              await AsyncStorage.setItem('localInfo', JSON.stringify(updatedLocalInfo));
              setLocalInfo(updatedLocalInfo);
            } catch (error) {
              console.error('Erro ao excluir local:', error);
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
        <Text style={styles.headerText}>Locais</Text>
      </View>

      <ScrollView>
        {localInfo.length > 0 ? (
          localInfo.map((local, index) => (
            <Card key={index} style={{ marginBottom: 16, backgroundColor: '#D2B48C', elevation: 3 }}>
              <Card.Content>
                <Title style={styles.cardTitle}>Nome do Local: {local.nome || ''}</Title>
                <Paragraph style={styles.cardText}>Endereço: {local.endereco || ''}</Paragraph>
                <Paragraph style={styles.cardText}>Custo da Estadia: R${local.custoEstadia || ''}</Paragraph>
                <Paragraph style={styles.cardText}>Vagas para Alunos: {local.vagas || ''}</Paragraph>
              </Card.Content>
              <Card.Actions>
                <FAB
                  style={styles.fab}
                  icon="pencil"
                  onPress={async () => {
                    const editedLocal = await navigation.navigate('LocalLogin', {
                      nome: local.nome || '',
                      endereco: local.endereco || '',
                      custoEstadia: local.custoEstadia || '',
                      vagas: local.vagas || '',
                      localIndex: index,
                    });

                    if (editedLocal) {
                      const updatedLocalInfo = [...localInfo];
                      updatedLocalInfo[index] = editedLocal;
                      await AsyncStorage.setItem('localInfo', JSON.stringify(updatedLocalInfo));
                      setLocalInfo(updatedLocalInfo);
                    }
                  }}
                />
                <FAB
                  style={styles.fab}
                  icon="delete"
                  onPress={() => excluirLocal(index)}
                />
              </Card.Actions>
            </Card>
          ))
        ) : (
          <Text style={styles.noLocaisText}>Nenhum local cadastrado.</Text>
        )}
      </ScrollView>

      <FAB
        style={styles.fabAdd}
        icon="plus"
        onPress={() => navigation.navigate('LocalLogin')}
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
  noLocaisText: {
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

export default LocalTela;
