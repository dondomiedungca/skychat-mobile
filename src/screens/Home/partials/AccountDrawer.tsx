import React, { useContext } from 'react';
import {
  Image,
  TouchableOpacity,
  TouchableNativeFeedback,
  Alert
} from 'react-native';
import styled from 'styled-components/native';
import { Avatar as ModuleAvatar } from 'react-native-paper';

import Colors from '../../../types/Colors';
import { UserContext } from '../../Auth/context/UserContext';
import { navigate, replace } from './../../../libs/rootNavigation';
import { useLogout } from '../../../libs/useUser';

import ActiveIcon from './../../../../assets/icons/online_icon.png';
import CogIcon from './../../../../assets/icons/cog_icon.png';
import SignoutIcon from './../../../../assets/icons/signout_icon.png';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

import { Typography } from '../../../components/Typography';
import { useFetchEffect } from '../../../libs/useFetchEffect';

const AccountDrawer = () => {
  const { user, setUser } = useContext(UserContext);
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
      replace('Auth', { screen: 'GetStarted' });
      setUser(undefined);
    }
  });

  return (
    <Container>
      {!!user && (
        <>
          <TopSection>
            <ModuleAvatar.Image
              size={60}
              source={{ uri: user?.user_meta?.profile_photo! }}
            />
            <Name>
              <Typography
                style={{ textTransform: 'uppercase' }}
                title={`${user?.firstName} ${user?.lastName}`}
                size={15}
                color={Colors.grey}
                fontFamily="Roboto-Bold"
              />
            </Name>
            <Status>
              <Image style={{ width: 15, height: 15 }} source={ActiveIcon} />
              <Typography
                style={{ textTransform: 'uppercase' }}
                title={`Active`}
                size={10}
                color={Colors.grey}
                fontFamily="Roboto-Bold"
              />
            </Status>
            <CogContainer>
              <TouchableOpacity>
                <Image style={{ width: 30, height: 30 }} source={CogIcon} />
              </TouchableOpacity>
            </CogContainer>
          </TopSection>
          <Navigation>
            <NavContainer>
              <Nav
                background={TouchableNativeFeedback.Ripple(
                  Colors.primary_light,
                  true
                )}
              >
                <NavContent>
                  <FontAwesome5
                    name="archive"
                    size={20}
                    color={Colors.primary}
                  />
                  <Typography
                    style={{ textTransform: 'uppercase' }}
                    title={`ARCHIVES`}
                    size={12}
                    color={Colors.grey}
                    fontFamily="Roboto-Medium"
                  />
                </NavContent>
              </Nav>
            </NavContainer>
            <NavContainer>
              <Nav
                background={TouchableNativeFeedback.Ripple(
                  Colors.primary_light,
                  true
                )}
              >
                <NavContent>
                  <MaterialCommunityIcons
                    name="message-badge"
                    size={20}
                    color={Colors.primary}
                  />
                  <Typography
                    style={{ textTransform: 'uppercase' }}
                    title={`MESSAGE REQUESTS`}
                    size={12}
                    color={Colors.grey}
                    fontFamily="Roboto-Medium"
                  />
                </NavContent>
              </Nav>
            </NavContainer>
            <NavContainer>
              <Nav
                background={TouchableNativeFeedback.Ripple(
                  Colors.primary_light,
                  true
                )}
              >
                <NavContent>
                  <MaterialCommunityIcons
                    name="file-multiple"
                    size={20}
                    color={Colors.primary}
                  />
                  <Typography
                    style={{ textTransform: 'uppercase' }}
                    title={`FILES`}
                    size={12}
                    color={Colors.grey}
                    fontFamily="Roboto-Medium"
                  />
                </NavContent>
              </Nav>
            </NavContainer>
          </Navigation>
          <SignOut style={{ borderRadius: 10, marginBottom: 10 }}>
            <Nav
              background={TouchableNativeFeedback.Ripple('#ffe3e4', true)}
              onPress={askForLogout}
            >
              <NavContent>
                <Image style={{ width: 20, height: 20 }} source={SignoutIcon} />
                <Typography
                  title={`Sign out`}
                  size={12}
                  color={Colors.grey}
                  fontFamily="Roboto-Medium"
                />
              </NavContent>
            </Nav>
          </SignOut>
        </>
      )}
    </Container>
  );
};

const Container = styled.View`
  position: relative;
  height: 100%;
  width: 100%;
  background: ${Colors.white};
`;

const TopSection = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 200px;
  background: ${Colors.secondary};
  border-bottom-right-radius: 20px;
  border-top-left-radius: 20px;
  padding: 10px;
`;

const Name = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 15px;
  gap: 5px;
`;

const Status = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 15px;
  gap: 10px;
`;

const CogContainer = styled.View`
  position: absolute;
  bottom: 10px;
  right: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
`;

const Navigation = styled.View`
  position: absolute;
  top: 200px;
  width: 100%;
  height: 200px;
  padding: 20px 10px;
`;

const Nav = styled.TouchableNativeFeedback``;

const NavContent = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 15px;
  padding: 5px;
`;

const NavContainer = styled.View`
  border-radius: 10px;
  margin-bottom: 10px;
`;

const SignOut = styled.View`
  width: 100%;
  position: absolute;
  bottom: 0;
  border-radius: 10px;
  padding-left: 10px;
  padding-right: 10px;
`;

export default AccountDrawer;
