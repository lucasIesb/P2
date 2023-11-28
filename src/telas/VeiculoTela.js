import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FAB, Card, Title, Paragraph } from 'react-native-paper';

function VeiculoTela({ navigation }) {
  const [veiculoInfo, setVeiculoInfo] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      carregarDados();
    }, [])
  );

  async function carregarDados() {
    try {
      const veiculoInfoJSON = await AsyncStorage.getItem('veiculoInfo');
      const veiculoInfo = veiculoInfoJSON ? JSON.parse(veiculoInfoJSON) : [];
      setVeiculoInfo(veiculoInfo);
    } catch (error) {
      console.error('Erro ao recuperar informações de veículos:', error);
    }
  }

  const excluirVeiculo = async (index) => {
    Alert.alert(
      'Confirmação',
      'Tem certeza de que deseja excluir este veículo?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Confirmar',
          onPress: async () => {
            try {
              const updatedVeiculoInfo = [...veiculoInfo];
              updatedVeiculoInfo.splice(index, 1);
              await AsyncStorage.setItem('veiculoInfo', JSON.stringify(updatedVeiculoInfo));
              setVeiculoInfo(updatedVeiculoInfo);
            } catch (error) {
              console.error('Erro ao excluir veículo:', error);
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
        <Text style={styles.headerText}>Veículos</Text>
      </View>

      <ScrollView>
        {veiculoInfo.length > 0 ? (
          veiculoInfo.map((veiculo, index) => (
            <Card key={index} style={{ marginBottom: 16, backgroundColor: '#D2B48C', elevation: 3 }}>
              <Card.Content>
                <Title style={styles.cardTitle}>Nome do Veículo: {veiculo.nome || ''}</Title>
                <Paragraph style={styles.cardText}>Tipo: {veiculo.tipo || ''}</Paragraph>
                <Paragraph style={styles.cardText}>Autonomia: {veiculo.autonomia || ''} km</Paragraph>
              </Card.Content>
              <Card.Actions>
                <FAB
                  style={styles.fab}
                  icon="pencil"
                  onPress={async () => {
                    const editedVeiculo = await navigation.navigate('VeiculoLogin', {
                      nome: veiculo.nome || '',
                      tipo: veiculo.tipo || '',
                      autonomia: veiculo.autonomia || '',
                      veiculoIndex: index,
                    });

                    if (editedVeiculo) {
                      const updatedVeiculoInfo = [...veiculoInfo];
                      updatedVeiculoInfo[index] = editedVeiculo;
                      await AsyncStorage.setItem('veiculoInfo', JSON.stringify(updatedVeiculoInfo));
                      setVeiculoInfo(updatedVeiculoInfo);
                    }
                  }}
                />
                <FAB
                  style={styles.fab}
                  icon="delete"
                  onPress={() => excluirVeiculo(index)}
                />
              </Card.Actions>
            </Card>
          ))
        ) : (
          <Text style={styles.noVeiculosText}>Nenhum veículo cadastrado.</Text>
        )}
      </ScrollView>

      <FAB
        style={styles.fabAdd}
        icon="plus"
        onPress={() => navigation.navigate('VeiculoLogin')}
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
  noVeiculosText: {
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
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardText: {
    fontSize: 14,
  },
});

export default VeiculoTela;