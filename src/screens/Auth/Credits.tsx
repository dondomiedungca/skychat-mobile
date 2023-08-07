import { AntDesign } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Dimensions, Linking, Text, View, Image } from 'react-native';
import styled from 'styled-components/native';
import { CustomButton } from '../../components/Buttons';
import { Typography } from '../../components/Typography';

import Colors from '../../types/Colors';
import { AuthStackParamList, RootParamList } from '../navigation';

import EmptyState from './../../../assets/png/empty_state.jpg';
import PersonalInformation from './../../../assets/png/personal_information.jpg';
import PhoneNumberVector from './../../../assets/png/phone_number_vector.jpg';
import Verification from './../../../assets/png/verification.jpg';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

type CreditsScreenProps = {
  navigation: StackNavigationProp<RootParamList>;
  route: RouteProp<AuthStackParamList, 'Credits'>;
};

const Credits = ({ navigation }: CreditsScreenProps) => {
  const BackButton = () =>
    navigation.canGoBack() ? (
      <CustomButton
        style={{ padding: 10, position: 'absolute', top: 0, left: 0 }}
        onPress={() => navigation.goBack()}
        label={<AntDesign name="arrowleft" size={20} color={Colors.white} />}
      />
    ) : null;

  return (
    <Container>
      <BackButton />
      <Content>
        <Typography
          title={'APPLICATION REFERENCE'}
          size={15}
          fontFamily="Roboto-Medium"
          color={Colors.grey}
        />
        <View
          style={{
            marginTop: 15,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          <Typography
            title={'Type: '}
            size={14}
            fontFamily="Roboto-Light"
            color={Colors.grey_light}
          />
          <Typography
            title={'Mobile Application'}
            size={14}
            fontFamily="Roboto-Light"
            color={Colors.grey}
          />
        </View>

        <View
          style={{
            marginTop: 15,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          <Typography
            title={'Developer: '}
            size={14}
            fontFamily="Roboto-Light"
            color={Colors.grey_light}
          />
          <Typography
            title={'Dondomie Esguerra Dungca'}
            size={14}
            fontFamily="Roboto-Light"
            color={Colors.grey}
          />
        </View>
        <View
          style={{
            width: WIDTH - 90,
            marginTop: 15,
            display: 'flex',
            flexDirection: 'row'
          }}
        >
          <Typography
            title={'Purpose: '}
            size={14}
            fontFamily="Roboto-Light"
            color={Colors.grey_light}
          />
          <Typography
            title={
              'A fully functional chat application for PORTFOLIO purposes only.'
            }
            style={{ width: WIDTH - 100 }}
            numberOfLines={2}
            size={14}
            fontFamily="Roboto-Light"
            color={Colors.grey}
          />
        </View>
        <Typography
          style={{ marginTop: 30 }}
          title={'INTRODUCTION'}
          size={15}
          fontFamily="Roboto-Medium"
          color={Colors.grey}
        />
        <View style={{ marginTop: 30, marginRight: 10 }}>
          <Text>
            <Typography
              title={
                "Hi Everyone I am Dondomie Esguerra Dungca, a Full Stack Application Developer from Philippines with 5 years of experience of building both web application and mobile application. First, I would like to thank you for visiting my project and if you haven't visited my web portfolio yet, you can visit it by going to this link "
              }
              size={14}
              color={Colors.grey_light}
              numberOfLines={1000}
            />
            <Text
              style={{ color: Colors.blue }}
              onPress={() => {
                Linking.openURL('https://dondomain.dev');
              }}
            >
              https://dondomain.dev
            </Text>
            .
          </Text>
        </View>
        <View style={{ marginTop: 30, marginRight: 10 }}>
          <Typography
            title={
              "It's not actually as in done yet but its main functionality which is the chat application is already working. This application is made with Expo React Native and I have been working on it for almost 2 months. I also don't get to code often because I have a full time job so I can only continue it in my freetime or after work."
            }
            size={14}
            numberOfLines={1000}
            color={Colors.grey_light}
          />
        </View>
        <View style={{ marginTop: 30, marginRight: 10 }}>
          <Typography
            title={
              'This application uses a variety of libraries, tools, packages and dependencies. Later I will list the ones I used for building this application. Apart from the ones mentioned above, I will also put the sources, designers, APIs that I used to give attribution to the people who made an effort to create their free to used sources such as images, design and others.'
            }
            size={14}
            numberOfLines={1000}
            color={Colors.grey_light}
          />
        </View>
        <Typography
          style={{ marginTop: 30 }}
          title={'CREDITS'}
          size={15}
          fontFamily="Roboto-Medium"
          color={Colors.grey}
        />
        <View style={{ marginTop: 30, marginRight: 10 }}>
          <Typography
            title={
              'I would like to thanks and give attribution for using this sources and give credits to the owner.'
            }
            size={14}
            numberOfLines={1000}
            color={Colors.grey_light}
          />
        </View>
        <View style={{ marginTop: 30, marginLeft: 30, marginRight: 20 }}>
          <Text
            style={{ color: Colors.blue }}
            onPress={() => {
              Linking.openURL('https://www.freepik.com/');
            }}
          >
            Freepik - Freepik: Download Free Videos, Vectors, Photos, and PSD
          </Text>

          <Typography
            style={{ marginTop: 20 }}
            title={'Here are the amazing images that I used:'}
            size={14}
            numberOfLines={1000}
            color={Colors.grey_light}
          />
          <StyledImage style={{ marginTop: 10 }} source={EmptyState} />
          <Text
            style={{ color: Colors.blue, fontSize: 12, marginBottom: 20 }}
            onPress={() => {
              Linking.openURL(
                'https://www.freepik.com/free-vector/empty-concept-illustration_7117863.htm#query=empty&position=33&from_view=search&track=sph'
              );
            }}
          >
            Image by storyset on Freepik
          </Text>
          <StyledImage style={{ marginTop: 10 }} source={PersonalInformation} />
          <Text
            style={{ color: Colors.blue, fontSize: 12, marginBottom: 20 }}
            onPress={() => {
              Linking.openURL(
                'https://www.freepik.com/free-vector/resume-concept-illustration_4957171.htm#query=personal%20information&position=34&from_view=search&track=ais'
              );
            }}
          >
            Image by storyset on Freepik
          </Text>
          <StyledImage style={{ marginTop: 10 }} source={Verification} />
          <Text
            style={{ color: Colors.blue, fontSize: 12, marginBottom: 20 }}
            onPress={() => {
              Linking.openURL(
                'https://www.freepik.com/free-vector/mobile-login-concept-illustration_4957136.htm#page=3&query=phone%20verification&position=49&from_view=search&track=ais'
              );
            }}
          >
            Image by storyset on Freepik
          </Text>
        </View>
        <View style={{ marginTop: 30, marginRight: 10 }}>
          <Typography
            title={'TOOLS, LIBRARIES AND PACKAGES'}
            size={15}
            fontFamily="Roboto-Medium"
            color={Colors.grey}
          />
        </View>
        <View style={{ marginTop: 30, marginRight: 10 }}>
          <Typography
            title={
              'This application was made by the following tools, libraries, packages and etc:'
            }
            size={12}
            numberOfLines={1000}
            color={Colors.grey_light}
          />
        </View>
        <View style={{ marginTop: 20, marginRight: 10 }}>
          <Text>
            <Typography
              title={'Expo - '}
              size={13}
              fontFamily="Roboto-Medium"
              color={Colors.grey}
            />
            <Text
              style={{ color: Colors.blue }}
              onPress={() => {
                Linking.openURL('https://docs.expo.dev/');
              }}
            >
              Expo Documentation
            </Text>
            <Typography
              title={
                " Build One Project That Runs Natively On All Your Users' Devices. The Fastest Way To Build in React Native. Ship Quickly Without XCode or Android Studio. Ship Mobile Apps Fast. One Codebase. All Devices. Expo React Native. Build Any App."
              }
              size={12}
              numberOfLines={1000}
              color={Colors.grey_light}
            />
          </Text>
        </View>
        <View style={{ marginTop: 20, marginRight: 10 }}>
          <Text>
            <Typography
              title={'React Native - '}
              size={13}
              fontFamily="Roboto-Medium"
              color={Colors.grey}
            />
            <Typography
              title={
                'I used react native for building this application. Visit their website for a great documentation '
              }
              size={12}
              numberOfLines={1000}
              color={Colors.grey_light}
            />
            <Text
              style={{ color: Colors.blue }}
              onPress={() => {
                Linking.openURL('https://reactnative.dev/docs/getting-started');
              }}
            >
              React Native · Learn once, write anywhere
            </Text>
            .
          </Text>
        </View>
        <View style={{ marginTop: 20, marginRight: 10 }}>
          <Text>
            <Typography
              title={'Socket IO - '}
              size={13}
              fontFamily="Roboto-Medium"
              color={Colors.grey}
            />
            <Typography
              title={
                'Socket.IO is a library that enables low-latency, bidirectional and event-based communication between a client and a server. Visit their website '
              }
              size={12}
              numberOfLines={1000}
              color={Colors.grey_light}
            />
            <Text
              style={{ color: Colors.blue }}
              onPress={() => {
                Linking.openURL('https://socket.io/docs/v4/');
              }}
            >
              Socket.IO
            </Text>
            <Typography
              title={' for documentation if you are interested'}
              size={12}
              numberOfLines={1000}
              color={Colors.grey_light}
            />
            .
          </Text>
        </View>
        <View style={{ marginTop: 20, marginRight: 10 }}>
          <Text>
            <Typography
              title={'NestJS - '}
              size={13}
              fontFamily="Roboto-Medium"
              color={Colors.grey}
            />
            <Typography
              title={
                'A progressive Node.js framework for building efficient, reliable and scalable server-side applications. Visit this link for more information '
              }
              size={12}
              numberOfLines={1000}
              color={Colors.grey_light}
            />
            <Text
              style={{ color: Colors.blue }}
              onPress={() => {
                Linking.openURL('https://docs.nestjs.com/');
              }}
            >
              NestJS - A progressive Node.js framework
            </Text>
            <Typography
              title={' they have a great documentation'}
              size={12}
              numberOfLines={1000}
              color={Colors.grey_light}
            />
            .
          </Text>
        </View>
        <View style={{ marginTop: 20, marginRight: 10 }}>
          <Text>
            <Typography
              title={'Postgres – '}
              size={13}
              fontFamily="Roboto-Medium"
              color={Colors.grey}
            />
            <Typography
              title={
                'I used the Postgres for my database and here is their site for the documentation '
              }
              size={12}
              numberOfLines={1000}
              color={Colors.grey_light}
            />
            <Text
              style={{ color: Colors.blue }}
              onPress={() => {
                Linking.openURL('https://www.postgresql.org/docs/');
              }}
            >
              PostgreSQL: The world's most advanced open source database
            </Text>
            .
          </Text>
        </View>
        <View style={{ marginTop: 20, marginRight: 10 }}>
          <Text>
            <Typography
              title={'Docker – '}
              size={13}
              fontFamily="Roboto-Medium"
              color={Colors.grey}
            />
            <Typography
              title={
                'I used docker for building my images and managing my containers, '
              }
              size={12}
              numberOfLines={1000}
              color={Colors.grey_light}
            />
            <Text
              style={{ color: Colors.blue }}
              onPress={() => {
                Linking.openURL('https://www.docker.com/get-started/');
              }}
            >
              Docker: Accelerated Container Application Development
            </Text>
            .
          </Text>
        </View>
        <View style={{ marginTop: 20, marginRight: 10 }}>
          <Text>
            <Typography
              title={'Firebase (FCM) - '}
              size={13}
              fontFamily="Roboto-Medium"
              color={Colors.grey}
            />
            <Text
              style={{ color: Colors.blue }}
              onPress={() => {
                Linking.openURL(
                  'https://firebase.google.com/docs/cloud-messaging'
                );
              }}
            >
              a cross-platform messaging solution that lets you reliably send
              messages at no cost. Firebase Cloud Messaging.
            </Text>
            .
          </Text>
        </View>
        <View
          style={{
            marginTop: 40,
            marginBottom: 40,
            width: WIDTH - 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Typography
            title={'THANK YOU VERY MUCH!!'}
            size={14}
            color={Colors.blue}
            fontFamily="Roboto-Light"
          />
        </View>
      </Content>
    </Container>
  );
};

export default Credits;

const Container = styled.View`
  height: ${HEIGHT}px;
  width: ${WIDTH}px;
  background: ${Colors.white};
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: center;
  justify-content: center;
  padding-left: 20px;
  padding-right: 20px;
`;

const Content = styled.ScrollView`
  width: ${WIDTH - 40}px;
  margin-left: 20px;
  margin-right: 20px;
  margin-top: 100px;
`;

const StyledImage = styled(Image)`
  width: 100%;
  height: 200px;
  aspect-ratio: 1.5/1.1;
`;
