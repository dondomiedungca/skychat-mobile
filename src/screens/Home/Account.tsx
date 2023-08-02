import React, { useCallback, useContext } from 'react';
import styled from 'styled-components/native';
import { Alert, Dimensions, TouchableOpacity } from 'react-native';

// components
import MainContainer from '../../components/MainContainer';

// types and constants
import Colors from '../../types/Colors';
import { Typography } from '../../components/Typography';
import {
  AntDesign,
  Feather,
  FontAwesome,
  Ionicons,
  MaterialIcons
} from '@expo/vector-icons';
import Avatar from '../../components/Avatar';
import { UserContext } from '../../context/user.context';
import { useFetchEffect } from '../../libs/useFetchEffect';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigationReplace } from '../../libs/rootNavigation';
import { useLogout } from '../../libs/useUser';
import { OnboardContext } from '../../context/onboarding-context';

const FULL_WIDTH = Dimensions.get('window').width;

export const Account = () => {
  const { user: currentUser, setUser } = useContext(UserContext);
  const { dispatch } = useContext(OnboardContext);
  const { makeRequest: fetchLogout, ...handleLogout } = useLogout();

  const askForLogout = () =>
    Alert.alert(
      'Are you sure?',
      'Do you really want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Yes',
          onPress: async () => {
            const refreshToken = await AsyncStorage.getItem('REFRESH_TOKEN');
            if (refreshToken) {
              fetchLogout({ refreshToken });
            }
          }
        }
      ],
      {
        cancelable: true
      }
    );

  useFetchEffect(handleLogout, {
    onData: async () => {
      await AsyncStorage.removeItem('ACCESS_TOKEN');
      await AsyncStorage.removeItem('REFRESH_TOKEN');
      navigationReplace('Auth', { screen: 'GetStarted' });
      setUser(undefined);
      dispatch({ type: 'RESET', value: null });
    }
  });

  const Header = useCallback(() => {
    return (
      <HeaderContainer>
        <Typography
          title={'Settings'}
          size={20}
          color={Colors.grey}
          fontFamily="Roboto-Medium"
        />
        <StyledTouchableOpacity>
          <Feather name="search" size={24} color={Colors.grey} />
        </StyledTouchableOpacity>
      </HeaderContainer>
    );
  }, []);

  return (
    <MainContainer header={<Header />}>
      <Container>
        <UserContainer>
          <Avatar
            source={currentUser?.user_meta?.profile_photo}
            size={100}
            showActive={false}
          />
          <InfoContainer>
            <Typography
              title={`${currentUser?.first_name} ${currentUser?.last_name}`}
              size={18}
              color={Colors.grey}
              fontFamily="Roboto-Bold"
            />
            <Typography
              title={
                'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur,'
              }
              size={12}
              numberOfLines={3}
              color={Colors.grey_light}
            />
          </InfoContainer>
        </UserContainer>
        <Line />
        <Navigators>
          <NavigatorNoOpacity>
            <Ionicons name="moon" size={24} color={Colors.blue} />
            <Typography
              title={`Dark mode`}
              size={15}
              color={Colors.grey_light}
            />
            <Extra>
              <TouchableOpacity>
                <FontAwesome
                  name="toggle-off"
                  size={30}
                  color={Colors.primary}
                />
              </TouchableOpacity>
            </Extra>
          </NavigatorNoOpacity>
          <Navigator>
            <MaterialIcons name="account-box" size={24} color={Colors.blue} />
            <Typography title={`Account`} size={15} color={Colors.grey_light} />
            <Extra>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={24}
                color={Colors.grey_light}
              />
            </Extra>
          </Navigator>
          <Navigator>
            <MaterialIcons name="notifications" size={24} color={Colors.blue} />
            <Typography
              title={`Notifications`}
              size={15}
              color={Colors.grey_light}
            />
            <Extra>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={24}
                color={Colors.grey_light}
              />
            </Extra>
          </Navigator>
          <Navigator>
            <MaterialIcons name="chat" size={24} color={Colors.blue} />
            <Typography
              title={`Chat settings`}
              size={15}
              color={Colors.grey_light}
            />
            <Extra>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={24}
                color={Colors.grey_light}
              />
            </Extra>
          </Navigator>
          <Navigator>
            <MaterialIcons
              name="perm-data-setting"
              size={24}
              color={Colors.blue}
            />
            <Typography
              title={`Data and storage`}
              size={15}
              color={Colors.grey_light}
            />
            <Extra>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={24}
                color={Colors.grey_light}
              />
            </Extra>
          </Navigator>
          <Navigator>
            <MaterialIcons name="lock" size={24} color={Colors.blue} />
            <Typography
              title={`Privacy and security`}
              size={15}
              color={Colors.grey_light}
            />
            <Extra>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={24}
                color={Colors.grey_light}
              />
            </Extra>
          </Navigator>
          <Navigator>
            <MaterialIcons name="info" size={24} color={Colors.blue} />
            <Typography title={`About`} size={15} color={Colors.grey_light} />
          </Navigator>
          <Navigator onPress={askForLogout}>
            <MaterialIcons name="logout" size={24} color={Colors.error} />
            <Typography title={`Signout`} size={15} color={Colors.error} />
          </Navigator>
        </Navigators>
      </Container>
    </MainContainer>
  );
};

const HeaderContainer = styled.View`
  display: flex;
  height: 50px;
  width: ${FULL_WIDTH}px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background: ${Colors.white};
  padding: 0 10px 0 10px;
`;

const StyledTouchableOpacity = styled.TouchableOpacity`
  height: 100%;
  width: 50px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
`;

const Container = styled.View`
  margin: 10px;
  margin-top: 70px;
  width: ${FULL_WIDTH}px;
  height: 100%;
`;

const UserContainer = styled.View`
  width: 100%;
  height: 100px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const InfoContainer = styled.View`
  width: 50px;
  flex-grow: 1;
  height: 100%;
  padding-left: 15px;
  padding-right: 15px;
`;

const Line = styled.View`
  width: ${FULL_WIDTH}px;
  height: 0.5px;
  background: ${Colors.grey_light};
  margin-left: -10px;
  margin-top: 15px;
`;

const Navigators = styled.View`
  margin-top: 10px;
  height: 100%;
  width: ${FULL_WIDTH - 20}px;
  padding: 10px;
`;

const Navigator = styled.TouchableOpacity`
  height: 50px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
  margin-bottom: 10px;
`;

const NavigatorNoOpacity = styled.View`
  height: 50px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
  margin-bottom: 10px;
`;

const Extra = styled.View`
  width: 5px;
  flex-grow: 1;
  dislay: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;
