import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

import TutorTela from '../telas/TutorCadastroTela';
import TutorLoginTela from '../telas/TutorLoginTela';
import HomeTela from '../telas/HomeTela';
import TelaDeLogin from '../telas/LoginTela';
import EquipamentosTela from '../telas/EquipamentosTela';
import AdicionarEquipamentoTela from '../telas/AdicionarEquipamentoTela';
import LocalTela from '../telas/LocalTela';
import AdicionarLocalTela from '../telas/LocalLoginTela';
import VeiculoTela from '../telas/VeiculoTela';
import VeiculoLoginTela from '../telas/VeiculoLoginTela';


const Tab = createBottomTabNavigator();

function CentralDeNavegacao() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeTela}
          options={{ headerShown: false }}

        />



        <Tab.Screen name="TutorTela" component={TutorTela}
          options={{ headerShown: false }}

        />

        <Tab.Screen name="EquipamentosTela" component={EquipamentosTela}
          options={{ headerShown: false }}

        />

        <Tab.Screen name="Local" component={LocalTela}
          options={{ headerShown: false }}

        />
        <Tab.Screen name="Veiculo" component={VeiculoTela}
          options={{ headerShown: false }}

        />
  











        <Tab.Screen name="VeiculoLogin" component={VeiculoLoginTela}
          options={{ tabBarButton: () => null }}

        />

        <Tab.Screen name="TutorLogin" component={TutorLoginTela}
          options={{ tabBarButton: () => null }}

        />
        <Tab.Screen name="AdicionarEquipamento" component={AdicionarEquipamentoTela}
          options={{ tabBarButton: () => null }}

        />
        <Tab.Screen name="LocalLogin" component={AdicionarLocalTela}
          options={{ tabBarButton: () => null }}

        />


        <Tab.Screen name="Login" component={TelaDeLogin}
          options={{ tabBarButton: () => null }}

        />


      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default CentralDeNavegacao;
