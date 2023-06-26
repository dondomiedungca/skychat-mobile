import React from 'react';
import styled from 'styled-components/native';
import { Dimensions, Image, TouchableOpacity } from 'react-native';
import moment from 'moment';

import LeftIcon from './../../assets/icons/left_icon.png';
import ConferenceIcon from './../../assets/icons/video_conference_icon.png';
import MoreIcon from './../../assets/icons/more_icon.png';
import Avatar from './Avatar';
import { User } from '../types/User';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootParamList } from '../screens/navigation';
import Colors from '../types/Colors';
import { Typography } from './Typography';

const FULL_WIDTH = Dimensions.get('screen').width;

const RoomHeader = ({
  user,
  navigation
}: {
  user: User;
  navigation: StackNavigationProp<RootParamList>;
}) => {
  const handleFormat = (date: Date | undefined) => {
    return date && moment(date).fromNow();
  };
  return (
    <Container>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image style={{ width: 35, height: 35 }} source={LeftIcon} />
      </TouchableOpacity>
      <Avatar
        size={40}
        source={user.user_meta?.profile_photo}
        showActive={user?.user_meta?.activity?.showActivity}
        active={user?.user_meta?.activity?.isActive}
      />
      <NameAndActivity>
        <Typography
          title={`${user?.firstName} ${user?.lastName}`}
          size={15}
          color={Colors.grey}
          fontFamily="Roboto-Medium"
        ></Typography>
        {user?.user_meta?.activity?.showActivity && (
          <Typography
            title={
              user?.user_meta?.activity?.isActive
                ? 'online'
                : handleFormat(user?.user_meta?.activity?.lastActive) ||
                  'OFFLINE'
            }
            size={10}
            color={Colors.grey_light}
            fontFamily="Roboto-Medium"
          ></Typography>
        )}
      </NameAndActivity>
      <StyledTouchableOpacity>
        <Image style={{ width: 25, height: 25 }} source={ConferenceIcon} />
      </StyledTouchableOpacity>
      <StyledTouchableOpacity>
        <Image style={{ width: 20, height: 20 }} source={MoreIcon} />
      </StyledTouchableOpacity>
    </Container>
  );
};

const Container = styled.View`
  width: ${FULL_WIDTH}px;
  height: 60px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 10px;
  padding-right: 10px;
  gap: 10px;
`;

const NameAndActivity = styled.View`
  height: 38px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const StyledTouchableOpacity = styled.TouchableOpacity`
  margin-left: 8px;
  padding: 5px;
`;

export default RoomHeader;
