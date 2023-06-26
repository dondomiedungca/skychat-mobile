import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import _ from 'lodash';

// components
import MainContainer from '../../../components/MainContainer';
import { Typography } from '../../../components/Typography';
import { HomeHeader } from '../partials/HomeHeader';

// types and constants
import Colors from '../../../types/Colors';
import { navigate, navigationPush } from '../../../libs/rootNavigation';

// hooks
import { useGetPaginatedUsers } from '../../../libs/useUser';
import { User } from '../../../types/User';
import { useFetchEffect } from '../../../libs/useFetchEffect';
import {
  ListRenderItemInfo,
  View,
  Text,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import Avatar from '../../../components/Avatar';

const HEIGHT = Dimensions.get('screen').height;
const WIDTH = Dimensions.get('screen').width;
const CONNECTS_HEIGHT = HEIGHT * 0.3;

const Card = ({ user }: { user: User }) => {
  return (
    <TouchableOpacity
      onPress={() => navigate('ChatRoom', { screen: 'Room', params: { user } })}
    >
      <StyledCard>
        <CardMainInfo>
          <Avatar
            size={40}
            source={user.user_meta?.profile_photo}
            showActive={user?.user_meta?.activity?.showActivity}
            active={user?.user_meta?.activity?.isActive}
          />
          <Typography
            style={{ width: WIDTH / 2 - 80 }}
            title={`${user.firstName} ${user.lastName}`}
            size={16}
            fontFamily="Roboto-Medium"
            color={Colors.grey}
            numberOfLines={2}
          />
        </CardMainInfo>
        <Typography
          title={'Hey come join us. Please see the time now!!'}
          size={13}
          fontFamily="Roboto-Medium"
          color={Colors.grey_light}
          numberOfLines={1}
        />
      </StyledCard>
    </TouchableOpacity>
  );
};

const Item = ({ item }: ListRenderItemInfo<any>) => {
  return (
    <RowContainer>
      {item.length &&
        item?.map((user: User) => <Card key={user.id} user={user} />)}
    </RowContainer>
  );
};

const ListPeople = () => {
  const [users, setUsers] = useState<User[][]>([]);

  const { makeRequest: fetchUsers, ...handleFetchUsers } =
    useGetPaginatedUsers();

  useEffect(() => {
    fetchUsers({ page: 1 });
  }, []);

  useFetchEffect(handleFetchUsers, {
    onData: (data: User[]) => {
      if (!!data && !handleFetchUsers.isLoading) {
        const chunked = _.chunk(data, 2);
        setUsers((prev) => [...prev, ...chunked]);
      }
    },
    dependencies: []
  });

  return (
    <Connects>
      <StyledFlatList
        horizontal
        keyExtractor={(item, index) => item + index.toString()}
        data={users}
        renderItem={Item}
      />
    </Connects>
  );
};

export const ChatHome = () => {
  return (
    <MainContainer header={<HomeHeader />}>
      <Container>
        <ConnectSection>
          <Typography
            title="Connects"
            size={15}
            color={Colors.grey_light}
            fontFamily="Roboto-Medium"
          />
          <ListPeople />
        </ConnectSection>
      </Container>
    </MainContainer>
  );
};

const Container = styled.View`
  height: 100%;
  width: 100%;
  background: ${Colors.white};
  padding: 0 10px 0 10px;
`;

const ConnectSection = styled.View`
  width: 100%;
  margin-top: 60px;
`;

const StyledFlatList = styled.FlatList`
  padding-bottom: 10px;
`;

const Connects = styled.View`
  padding-top: 10px;
`;

const StyledCard = styled.View`
  padding: 15px;
  border-radius: 10px;
  background: ${Colors.white_light_dark};
  height: ${CONNECTS_HEIGHT / 2.3}px;
  width: ${WIDTH / 2 - 10}px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const RowContainer = styled.View`
  display: flex;
  flex-direction: column;
  margin-right: 10px;
  gap: 10px;
`;

const CardMainInfo = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
`;
