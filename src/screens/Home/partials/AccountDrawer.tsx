import React, { useContext } from 'react';
import {
  Image,
  TouchableOpacity,
  TouchableNativeFeedback,
  Alert,
} from 'react-native';
import styled from 'styled-components/native';
import { Avatar as ModuleAvatar } from 'react-native-paper';

import Colors from '../../../types/Colors';
import { UserContext } from '../../Auth/context/UserContext';
import { navigate } from './../../../libs/rootNavigation';

import UserIcon from './../../../../assets/icons/user_icon.png';
import ActiveIcon from './../../../../assets/icons/active_icon.png';
import CogIcon from './../../../../assets/icons/cog_icon.png';
import ArchiveIcon from './../../../../assets/icons/archive_icon.png';
import MessageRequestsIcon from './../../../../assets/icons/message_requests_icon.png';
import FilesIcon from './../../../../assets/icons/files_icon.png';
import SignoutIcon from './../../../../assets/icons/signout_icon.png';

import { Typography } from '../../../components/Typography';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AccountDrawer = () => {
  const { user, setUser } = useContext(UserContext);

  const askForLogout = () =>
    Alert.alert(
      'Are you sure?',
      'Do you really want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            await AsyncStorage.removeItem('ACCESS_TOKEN');
            await AsyncStorage.removeItem('REFRESH_TOKEN');
            setUser(undefined);
            navigate('Auth', { screen: 'GetStarted' });
          },
        },
      ],
      {
        cancelable: true,
      },
    );

  return (
    <Container>
      {!!user && (
        <>
          <TopSection>
            <ModuleAvatar.Image size={80} source={{ uri: user?.picture! }} />
            <Name>
              <Image style={{ width: 23, height: 23 }} source={UserIcon} />
              <Typography
                style={{ textTransform: 'uppercase' }}
                title={`${user?.firstName} ${user?.lastName}`}
                size={15}
                color={Colors.secondary}
                fontFamily="Roboto-Bold"
              />
            </Name>
            <Status>
              <Image style={{ width: 15, height: 15 }} source={ActiveIcon} />
              <Typography
                style={{ textTransform: 'uppercase' }}
                title={`Active`}
                size={10}
                color={Colors.secondary}
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
              <Nav background={TouchableNativeFeedback.Ripple('#d6e6ff', true)}>
                <NavContent>
                  <Image
                    style={{ width: 35, height: 35 }}
                    source={ArchiveIcon}
                  />
                  <Typography
                    style={{ textTransform: 'uppercase' }}
                    title={`ARCHIVES`}
                    size={15}
                    color={Colors.secondary}
                    fontFamily="Roboto"
                  />
                </NavContent>
              </Nav>
            </NavContainer>
            <NavContainer>
              <Nav background={TouchableNativeFeedback.Ripple('#d6e6ff', true)}>
                <NavContent>
                  <Image
                    style={{ width: 35, height: 35 }}
                    source={MessageRequestsIcon}
                  />
                  <Typography
                    style={{ textTransform: 'uppercase' }}
                    title={`MESSAGE REQUESTS`}
                    size={15}
                    color={Colors.secondary}
                    fontFamily="Roboto"
                  />
                </NavContent>
              </Nav>
            </NavContainer>
            <NavContainer>
              <Nav background={TouchableNativeFeedback.Ripple('#d6e6ff', true)}>
                <NavContent>
                  <Image style={{ width: 35, height: 35 }} source={FilesIcon} />
                  <Typography
                    style={{ textTransform: 'uppercase' }}
                    title={`FILES`}
                    size={15}
                    color={Colors.secondary}
                    fontFamily="Roboto"
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
                <Image style={{ width: 35, height: 35 }} source={SignoutIcon} />
                <Typography
                  title={`Sign out`}
                  size={15}
                  color={Colors.secondary}
                  fontFamily="Roboto"
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
  background: rgba(0, 107, 251, 0.2);
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
  padding-left: 4px;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 15px;
  gap: 10px;
`;

const CogContainer = styled.View`
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
