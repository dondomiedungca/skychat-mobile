import { MaterialIcons } from '@expo/vector-icons';
import {
  BottomTabBarProps,
  BottomTabNavigationEventMap
} from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import {
  NavigationHelpers,
  ParamListBase,
  TabNavigationState
} from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { HomeStackTabParamList } from '../screens/navigation';
import Colors from '../types/Colors';

type TabBarProps = {
  navigation: NavigationHelpers<
    ParamListBase | HomeStackTabParamList,
    BottomTabNavigationEventMap
  >;
  state: TabNavigationState<ParamListBase>;
};

export default ({ navigation, state }: BottomTabBarProps) => {
  const handleNavigate = (tab: keyof HomeStackTabParamList) => {
    navigation.navigate(tab);
  };

  return (
    <StyledView style={{ flexDirection: 'row', height: 70 }}>
      <StyledTouchableOpacity onPress={() => handleNavigate('ChatHome')}>
        <StyledMaterialIcons
          active={state.index === 0}
          name="chat-bubble"
          size={25}
          color={Colors.blue}
        />
      </StyledTouchableOpacity>
      <StyledTouchableOpacity onPress={() => handleNavigate('Recent')}>
        <StyledMaterialIcons
          active={state.index === 1}
          name="history"
          size={25}
          color={Colors.blue}
        />
      </StyledTouchableOpacity>
      <StyledTouchableOpacity onPress={() => handleNavigate('Call')}>
        <StyledMaterialIcons
          active={state.index === 2}
          name="call"
          size={25}
          color={Colors.blue}
        />
      </StyledTouchableOpacity>
      <StyledTouchableOpacity onPress={() => handleNavigate('Account')}>
        <StyledMaterialIcons
          active={state.index === 3}
          name="account-circle"
          size={25}
          color={Colors.blue}
        />
      </StyledTouchableOpacity>
    </StyledView>
  );
};

const StyledView = styled.View`
  width: 100%;
  background: ${Colors.white_light_dark};
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const StyledMaterialIcons = styled(MaterialIcons)<{ active?: boolean }>`
  color: ${({ active }) => (active ? Colors.blue : Colors.grey_light)};
`;

const StyledTouchableOpacity = styled.TouchableOpacity`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 5px;
`;
