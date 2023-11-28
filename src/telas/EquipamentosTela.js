import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FAB, Card, Title, Paragraph } from 'react-native-paper';

function EquipamentosTela({ navigation }) {
  const [equipamentosInfo, setEquipamentosInfo] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      carregarDados();
    }, [])
  );

  async function carregarDados() {
    try {
      const equipamentosInfoJSON = await AsyncStorage.getItem('equipamentosInfo');
      const equipamentosInfo = equipamentosInfoJSON ? JSON.parse(equipamentosInfoJSON) : [];
      setEquipamentosInfo(equipamentosInfo);
    } catch (error) {
      console.error('Erro ao recuperar informações de equipamentos:', error);
    }
  }

  const excluirEquipamento = async (index) => {
    Alert.alert(
      'Confirmação',
      'Tem certeza de que deseja excluir este equipamento?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Confirmar',
          onPress: async () => {
            try {
              const updatedEquipamentosInfo = [...equipamentosInfo];
              updatedEquipamentosInfo.splice(index, 1);
              await AsyncStorage.setItem('equipamentosInfo', JSON.stringify(updatedEquipamentosInfo));
              setEquipamentosInfo(updatedEquipamentosInfo);
            } catch (error) {
              console.error('Erro ao excluir equipamento:', error);
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
        <Text style={styles.headerText}>Equipamentos</Text>
      </View>

      <ScrollView>
        {equipamentosInfo.length > 0 ? (
          equipamentosInfo.map((equipamento, index) => (
            <Card key={index} style={{ marginBottom: 16, backgroundColor: '#D2B48C', elevation: 3 }}>
              <Card.Content>
                <Title style={styles.cardTitle}>Nome do Equipamento: {equipamento.nome || ''}</Title>
                <Paragraph style={styles.cardText}>Quantidade: {equipamento.quantidade || ''}</Paragraph>
                <Paragraph style={styles.cardText}>Preço: R${equipamento.preco || ''}</Paragraph>
              </Card.Content>
              <Card.Actions>
                <FAB
                  style={styles.fab}
                  icon="pencil"
                  onPress={async () => {
                    const editedEquipamento = await navigation.navigate('AdicionarEquipamento', {
                      nome: equipamento.nome || '',
                      quantidade: equipamento.quantidade || '',
                      preco: equipamento.preco || '',
                      equipamentoIndex: index,
                    });

                    if (editedEquipamento) {
                      const updatedEquipamentosInfo = [...equipamentosInfo];
                      updatedEquipamentosInfo[index] = editedEquipamento;
                      await AsyncStorage.setItem('equipamentosInfo', JSON.stringify(updatedEquipamentosInfo));
                      setEquipamentosInfo(updatedEquipamentosInfo);
                    }
                  }}
                />
                <FAB
                  style={styles.fab}
                  icon="delete"
                  onPress={() => excluirEquipamento(index)}
                />
              </Card.Actions>
            </Card>
          ))
        ) : (
          <Text style={styles.noEquipamentosText}>Nenhum equipamento cadastrado.</Text>
        )}
      </ScrollView>

      <FAB
        style={styles.fabAdd}
        icon="plus"
        onPress={() => navigation.navigate('AdicionarEquipamento')}
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
  noEquipamentosText: {
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

export default EquipamentosTela;
