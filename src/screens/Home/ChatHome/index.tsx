import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';
import styled from 'styled-components/native';
import _ from 'lodash';
import moment from 'moment';

// components
import MainContainer from '../../../components/MainContainer';
import { Typography } from '../../../components/Typography';
import { HomeHeader } from '../partials/HomeHeader';
import Avatar from '../../../components/Avatar';
import {
  BottomSheetRefProps,
  BottomSheetView
} from '../../../components/BottomSheet';
import ConnectsLoader from './SkeletonLoaders/ConnectsLoader';

// types and constants
import Colors from '../../../types/Colors';
import { navigate, navigationPush } from '../../../libs/rootNavigation';

// hooks
import { useGetPaginatedUsers } from '../../../libs/useUser';
import { useFetchRecentConversations } from '../../../libs/useConversation';
import { User } from '../../../types/User';
import { useFetchEffect } from '../../../libs/useFetchEffect';
import {
  ListRenderItemInfo,
  Dimensions,
  TouchableOpacity,
  RefreshControl,
  View
} from 'react-native';
import { UserContext } from '../../../context/user.context';
import EmptyState from './../../../../assets/png/empty_state.jpg';
import { RecentConversationsContext } from '../../../context/recent-conversation.context';
import { RecentConversation } from '../../../types/RecentConversation';
import { ReelsUsersContext } from '../../../context/reels-of-users.context';
import RecentLoader from './SkeletonLoaders/RecentLoader';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;
const CONNECTS_HEIGHT = HEIGHT * 0.3;

enum Filters {
  ALL_CHATS = 'all chats',
  PERSONAL = 'personal',
  WORK = 'work',
  GROUPS = 'groups'
}

const Card = ({ user }: { user: User }) => {
  return (
    <TouchableOpacity
      delayPressIn={50}
      onPress={() => navigationPush('Room', { user })}
    >
      <StyledCard>
        <CardMainInfo>
          <Avatar
            size={30}
            source={user.user_meta?.profile_photo}
            showActive={user?.user_meta?.activity?.show_activity}
            active={user?.user_meta?.activity?.is_active}
          />
          <Typography
            style={{ width: WIDTH / 2 - 80 }}
            title={`${user.first_name} ${user.last_name}`}
            size={14}
            fontFamily="Roboto-Medium"
            color={Colors.grey}
            numberOfLines={2}
          />
        </CardMainInfo>
        {/* <Typography
          style={{ position: 'absolute', bottom: 8, left: 15 }}
          title={`Active last `}
          size={11}
          color={Colors.grey_light}
        /> */}
      </StyledCard>
    </TouchableOpacity>
  );
};

const ConnectSectionComponent = memo(
  ({ users, isLoading }: { users: any; isLoading: boolean }) => {
    return (
      <ConnectSection>
        <Typography
          title="Connects"
          size={15}
          color={Colors.grey}
          fontFamily="Roboto-Medium"
        />
        <Connects>
          {!isLoading ? (
            <StyledFlatList
              horizontal
              keyExtractor={(item, index) => item + index.toString()}
              data={users}
              renderItem={({ item }: ListRenderItemInfo<any>) => {
                return (
                  <RowContainer>
                    {item.length &&
                      item?.map((user: User) => (
                        <Card key={user.id} user={user} />
                      ))}
                  </RowContainer>
                );
              }}
            />
          ) : (
            <ConnectsLoader />
          )}
        </Connects>
      </ConnectSection>
    );
  }
);

export const ChatHome = () => {
  const { user: currentUser } = useContext(UserContext);
  const {
    users: reelsUsers,
    setUsers: setUsersReels,
    initialLoading,
    setInitialLoading
  } = useContext(ReelsUsersContext);
  const {
    recent_conversations,
    setRecentConversations,
    initialLoading: initialLoading2,
    setInitialLoading: setInitialLoading2
  } = useContext(RecentConversationsContext);
  const [refreshing, setRefreshing] = useState(false);
  const [activefilter, setActiveFilter] = useState<Filters>(Filters.ALL_CHATS);

  const { makeRequest: fetchUsers, ...handleFetchUsers } =
    useGetPaginatedUsers();
  const { makeRequest: fetchRecentConversation, ...handleRecentConversations } =
    useFetchRecentConversations();

  useEffect(() => {
    fetchUsers({ page: 1 });
    fetchRecentConversation({ page: 1 });
  }, []);

  useFetchEffect(handleFetchUsers, {
    onData: (data: User[]) => {
      if (!!data && !handleFetchUsers.isLoading) {
        const chunked = _.chunk(data, 2);
        setUsersReels(chunked);
        setRefreshing(false);
        setInitialLoading(false);
      }
    },
    dependencies: [refreshing]
  });

  useFetchEffect(handleRecentConversations, {
    onData: async (data: RecentConversation[]) => {
      const sorted = data.sort(function (a, b) {
        return (
          new Date(b.lastDateTime).getTime() -
          new Date(a.lastDateTime).getTime()
        );
      });
      setInitialLoading2(false);
      setRecentConversations(sorted);
    }
  });

  const ref = useRef<BottomSheetRefProps>(null);

  const onPressSearch = useCallback(() => {
    const is_active = ref?.current?.is_active();
    if (is_active) {
      ref?.current?.scrollTo(0);
    } else {
      ref?.current?.scrollTo(-HEIGHT);
    }
  }, []);

  const goToRoom = useCallback(
    (item: any) => {
      let user: any;
      if (item.hasOwnProperty('users_conversations_conversation_id')) {
        user = JSON.parse(
          JSON.stringify({
            id: item.user_id,
            first_name: item.user_first_name,
            last_name: item.user_last_name,
            email: item.user_email,
            created_at: new Date(item.user_created_at),
            updated_at: new Date(item.user_updated_at),
            verified_at: new Date(item.user_verified_at),
            is_deleted: item.user_is_deleted,
            deleted_at: item.user_deleted_at && new Date(item.user_deleted_at),
            initial_chats: item.initial_chats,
            user_meta: {
              activity: {
                is_active: item.user_user_meta.activity.is_active,
                last_active: new Date(item.user_user_meta.activity.last_active),
                show_activity: item.user_user_meta.activity.show_activity
              },
              google_id: item?.user_user_meta?.google_id,
              profile_photo: item?.user_user_meta?.profile_photo
            },
            users_conversations: [
              {
                conversation: {
                  id: item.conversation_id,

                  type: item.conversation_type,

                  conversation_meta:
                    item?.conversation_conversation_meta || null,

                  created_at: new Date(item.conversation_created_at),

                  updated_at: new Date(item.conversation_updated_at)
                },
                id: item.users_conversations_id,
                display_name: item.users_conversations_display_name,
                user: {} as User,
                related_to: {} as User,
                deleted_at: new Date()
              }
            ]
          })
        );
      } else {
        user = {
          ...item.user_partner,
          users_conversations: item.users_conversations
        };
      }

      navigationPush('Room', { user });
    },
    [reelsUsers]
  );

  const FiltersComponent = memo(
    ({ activefilter }: { activefilter: Filters }) => {
      return (
        <GroupFilters>
          <TouchableOpacity onPress={() => setActiveFilter(Filters.ALL_CHATS)}>
            <Filter
              background={
                activefilter == Filters.ALL_CHATS
                  ? Colors.blue
                  : Colors.white_light_dark
              }
            >
              <Typography
                title={'All chats'}
                size={10}
                color={
                  activefilter == Filters.ALL_CHATS
                    ? Colors.white
                    : Colors.grey_light
                }
                fontFamily="Roboto-Medium"
              />
            </Filter>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveFilter(Filters.PERSONAL)}>
            <Filter
              background={
                activefilter == Filters.PERSONAL
                  ? Colors.blue
                  : Colors.white_light_dark
              }
            >
              <Typography
                title={'Personal'}
                size={10}
                color={
                  activefilter == Filters.PERSONAL
                    ? Colors.white
                    : Colors.grey_light
                }
                fontFamily="Roboto-Medium"
              />
            </Filter>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveFilter(Filters.WORK)}>
            <Filter
              background={
                activefilter == Filters.WORK
                  ? Colors.blue
                  : Colors.white_light_dark
              }
            >
              <Typography
                title={'Work'}
                size={10}
                color={
                  activefilter == Filters.WORK
                    ? Colors.white
                    : Colors.grey_light
                }
                fontFamily="Roboto-Medium"
              />
            </Filter>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveFilter(Filters.GROUPS)}>
            <Filter
              background={
                activefilter == Filters.GROUPS
                  ? Colors.blue
                  : Colors.white_light_dark
              }
            >
              <Typography
                title={'Groups'}
                size={10}
                color={
                  activefilter == Filters.GROUPS
                    ? Colors.white
                    : Colors.grey_light
                }
                fontFamily="Roboto-Medium"
              />
            </Filter>
          </TouchableOpacity>
        </GroupFilters>
      );
    }
  );

  return (
    <MainContainer header={<HomeHeader onPressSearch={onPressSearch} />}>
      <View>
        <Container
          refreshControl={
            <RefreshControl
              progressViewOffset={50}
              progressBackgroundColor={Colors.white}
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchUsers({ page: 1 });
                fetchRecentConversation({ page: 1 });
              }}
            />
          }
        >
          <ConnectSectionComponent
            users={reelsUsers}
            isLoading={handleFetchUsers.isLoading || initialLoading}
          />
        </Container>
      </View>
      {!handleRecentConversations.isLoading && !initialLoading2 ? (
        <RecentContainer>
          <Typography
            title="Recent Chats"
            size={15}
            color={Colors.grey}
            fontFamily="Roboto-Medium"
          />
          <FiltersComponent activefilter={activefilter} />
          {recent_conversations?.length ? (
            <RecentList
              showsVerticalScrollIndicator={false}
              extraData={recent_conversations}
              data={recent_conversations}
              keyExtractor={(item: any, index) => item.conversation_id}
              renderItem={({ item }: ListRenderItemInfo<any>) => {
                return (
                  <TouchableOpacity
                    onPress={() => goToRoom(item)}
                    delayPressIn={50}
                  >
                    <MessageContainer>
                      <Avatar
                        source={item.user_user_meta.profile_photo}
                        size={40}
                        active={item.user_user_meta.activity.is_active}
                        showActive={item.user_user_meta.activity.show_activity}
                      />
                      <MessageTextContainer>
                        <Typography
                          title={`${item.user_first_name} ${item.user_last_name}`}
                          size={15}
                          color={Colors.grey}
                          fontFamily="Roboto-Bold"
                          numberOfLines={1}
                        />
                        <Typography
                          numberOfLines={1}
                          title={`${
                            item.lastUser.replaceAll('"', '') ===
                            currentUser?.id
                              ? 'Me: '
                              : ''
                          }${item.lastMessage}`}
                          fontFamily="Roboto-Medium"
                          size={12}
                          color={
                            parseInt(item.unread)
                              ? Colors.grey
                              : Colors.grey_light
                          }
                        />
                      </MessageTextContainer>
                      <DetailsContainer>
                        <Typography
                          title={moment(item.lastDateTime).format('h:mm A')}
                          size={10}
                          color={Colors.grey_light}
                        />
                        {parseInt(item.unread) > 0 && (
                          <Badge>
                            <Typography
                              title={item.unread}
                              size={10}
                              color={Colors.white}
                            />
                          </Badge>
                        )}
                      </DetailsContainer>
                    </MessageContainer>
                  </TouchableOpacity>
                );
              }}
            />
          ) : (
            <EmptyRecentList>
              <StyledEmptyImage source={EmptyState} />
              <Typography
                title={'No messages'}
                size={15}
                color={Colors.grey_light}
              />
            </EmptyRecentList>
          )}
        </RecentContainer>
      ) : (
        <RecentAsLoaderContainer>
          <Typography
            title="Recent Chats"
            size={15}
            color={Colors.grey}
            fontFamily="Roboto-Medium"
          />
          <FiltersComponent activefilter={activefilter} />
          <RecentLoader />
        </RecentAsLoaderContainer>
      )}
      <BottomSheetView ref={ref}></BottomSheetView>
    </MainContainer>
  );
};

const Container = styled.ScrollView`
  width: 100%;
  background: ${Colors.white};
  padding: 0 10px 0 10px;
`;

const ConnectSection = styled.View`
  width: 100%;
  margin-top: 60px;
`;

const RecentContainer = styled.View`
  background: ${Colors.white};
  width: 100%;
  padding: 15px 10px 0 10px;
  flex: 1;
`;

const RecentAsLoaderContainer = styled.View`
  background: ${Colors.white};
  width: 100%;
  padding: 15px 10px 0 10px;
`;

const StyledFlatList = styled.FlatList`
  padding-bottom: 10px;
`;

const Connects = styled.View`
  padding-top: 10px;
`;

const StyledCard = styled.View`
  position: relative;
  padding: 15px;
  border-radius: 10px;
  background: ${Colors.white_light_dark};
  height: ${CONNECTS_HEIGHT / 3}px;
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

const RecentList = styled.FlatList`
  width: 100%;
  margin-top: 10px;
`;

const MessageContainer = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background: ${Colors.white};
  padding: 7px 7px 7px 0;
  gap: 10px;
  height: 70px;
`;

const MessageTextContainer = styled.View`
  min-height: 60px;
  width: 100px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  flex-grow: 1;
`;

const DetailsContainer = styled.View`
  display: flex;
  flex-direction: column;
  min-width: 50px;
  align-items: flex-end;
  justify-content: center;
  gap: 5px;
`;

const Badge = styled.View`
  height: 20px;
  width: 20px;
  border-radius: 10px;
  background: ${Colors.blue};
  didplay: flex;
  align-items: center;
  justify-content: center;
`;

const GroupFilters = styled.View`
  width: 100%;
  height: 20px;
  background: ${Colors.white};
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin-top: 15px;
  gap: 10px;
`;

const Filter = styled.View<{ background: string }>`
  border-radius: 5px;
  background: ${({ background }) => background || Colors.blue};
  min-width: 50px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 7px;
  padding-right: 7px;
`;

const EmptyRecentList = styled.View`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: ${Colors.white};
`;

const StyledEmptyImage = styled.Image`
  width: 50%;
  height: 50%;
`;
