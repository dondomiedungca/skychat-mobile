import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext } from 'react';
import { Dimensions, View } from 'react-native';
import styled from 'styled-components/native';
import Avatar from '../../../components/Avatar';
import { Typography } from '../../../components/Typography';
import { CallListenerContext } from '../../../context/call-listener.context';
import { navigationRef } from '../../../libs/rootNavigation';
import Colors from '../../../types/Colors';
import { CallStackParamList, RootParamList } from '../../navigation';

type PromptCallScreenProps = {
  navigation: StackNavigationProp<RootParamList>;
  route: RouteProp<CallStackParamList, 'PromptCall'>;
};

const WIDTH = Dimensions.get('window').width;

const PromptCall = ({ route, navigation }: PromptCallScreenProps) => {
  const { socket } = useContext(CallListenerContext);
  const caller = route?.params?.caller;
  const offer = route?.params?.offer;
  const roomId = route?.params?.roomId;

  return (
    <Container>
      <HeadContainer>
        <Avatar
          source={caller?.user_meta?.profile_photo}
          size={WIDTH / 2}
          showActive={false}
          style={{ marginBottom: 30 }}
        />
        <Typography
          title={`${caller.first_name} ${caller.last_name} is calling on you`}
          size={15}
          color={Colors.white}
        />
      </HeadContainer>
      <ButtonContainer>
        <StyledTouchableOpacity style={{ backgroundColor: Colors.green_light }}>
          <Ionicons name="call" size={24} color={Colors.white} />
        </StyledTouchableOpacity>
        <StyledTouchableOpacity
          style={{ backgroundColor: Colors.error_light }}
          onPress={() => {
            socket.emit('call-partnerManualEnd', { roomId });
            if (
              navigationRef?.canGoBack() &&
              navigationRef?.getCurrentRoute()?.name === 'PromptCall'
            ) {
              navigationRef?.goBack();
            }
          }}
        >
          <MaterialIcons name="call-end" size={24} color={Colors.white} />
        </StyledTouchableOpacity>
      </ButtonContainer>
    </Container>
  );
};

export default PromptCall;

const Container = styled.View`
  position: relative;
  width: ${WIDTH}px;
  height: 100%;
  background: ${Colors.grey}
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 30px;
`;

const ButtonContainer = styled.View`
  position: absolute;
  bottom: 50px;
  left: 0;
  width: ${WIDTH}px;
  height: 100px;
  padding-left: 65px;
  padding-right: 65px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const StyledTouchableOpacity = styled.TouchableOpacity`
  background: ${Colors.white};
  height: 80px;
  width: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 60px;
`;

const HeadContainer = styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
