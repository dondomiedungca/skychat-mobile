import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { AntDesign } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { Dimensions, Image } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';

// components
import MainContainer from '../../components/MainContainer';
import { CustomButton, CustomButtonV2 } from '../../components/Buttons';
import { Typography } from '../../components/Typography';

// assets
import Logo from './../../../assets/png/logo-no-background.png';
import Phone from './../../../assets/icons/phone.png';
import Google from './../../../assets/icons/google.png';
import Colors from '../../types/Colors';
import { RootParamList } from '../navigation';
import TextInput from '../../components/TextInput';
import useMethodWrapper from '../../libs/useWrapper';

// hooks and context
import { useGoogleAuth } from './../../libs/useGoogle';
import {
  TypeVerification,
  usCheckEmailIfExists,
  usCustomLogin
} from './../../libs/useUser';
import { UserContext } from '../../context/user.context';
import { OnboardContext } from '../../context/onboarding-context';
import { useFetchEffect } from '../../libs/useFetchEffect';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';

type StartAccountScreenProps = {
  navigation: StackNavigationProp<RootParamList>;
};

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

export const StartAccount: React.FC<StartAccountScreenProps> = ({
  navigation
}) => {
  const [showPass, setShowPass] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();
  const { user, setUser } = useContext(UserContext);
  const { onboardingData, dispatch } = useContext(OnboardContext);
  const { promptAsync, ...handleGoogleAuth } = useGoogleAuth();
  const { makeRequest, ...handleEmailChecking } = usCheckEmailIfExists();
  const { makeRequest: authenticate, ...handleAuthenticate } = usCustomLogin();

  const Header = () =>
    navigation.canGoBack() ? (
      <CustomButton
        style={{ padding: 10 }}
        onPress={() => navigation.goBack()}
        label={<AntDesign name="arrowleft" size={20} color={Colors.white} />}
      />
    ) : null;

  useEffect(() => {
    if (!!user && user?.id) {
      navigation.replace('Main', { screen: 'Home' });
    }
  }, [user]);

  useFetchEffect(handleEmailChecking, {
    onData: async (data: any) => {
      if (!data?.is_exists) {
        setShowPass(false);
        setError(undefined);
        navigation.push('Verify', { type: TypeVerification.EMAIL });
      } else {
        setShowPass(true);
      }
    }
  });

  useFetchEffect(handleAuthenticate, {
    onData: async (data: any) => {
      if (data?.accessToken && data?.refreshToken) {
        setError(undefined);
        if (data?.accessToken && data?.refreshToken) {
          const accessToken = data?.accessToken;
          const refreshToken = data?.refreshToken;
          await AsyncStorage.setItem('ACCESS_TOKEN', accessToken);
          await AsyncStorage.setItem('REFRESH_TOKEN', refreshToken);

          const decoded: any = await jwtDecode(accessToken);
          setUser({
            id: decoded.sub,
            first_name: decoded.first_name,
            last_name: decoded.last_name,
            email: decoded.email,
            roles: decoded.roles,
            user_meta: decoded?.user_meta,
            created_at: decoded?.createdAt
          });
        }
      }
    },
    onError: (err) => {
      if (err) {
        setError('Incorrect email and password. Please try again.');
      }
    }
  });

  const OnboardingSchema = Yup.object().shape({
    email: Yup.string().email('Please enter a valid email').required('Required')
  });

  return (
    <MainContainer header={<Header />} isLoading={handleGoogleAuth.isLoading}>
      <Container>
        <LogoImage source={Logo} />
        <Typography
          style={{ marginTop: 35 }}
          title="Get started with your account"
          color={Colors.grey}
          fontFamily="Roboto-Medium"
          size={18}
        />
        <SocialContainer style={{ marginTop: 20 }}>
          <CustomButtonV2
            width="100%"
            icon={() => (
              <Image
                style={{ height: 25, resizeMode: 'contain' }}
                source={Google}
              />
            )}
            textColor={Colors.grey}
            style={{ borderRadius: 5 }}
            backgroundColor={Colors.white_light_dark}
            mode="elevated"
            onPress={() => useMethodWrapper(promptAsync())}
          >
            Continue with Google
          </CustomButtonV2>
          <CustomButtonV2
            width="100%"
            icon={() => (
              <Image
                style={{ height: 25, resizeMode: 'contain' }}
                source={Phone}
              />
            )}
            textColor={Colors.grey}
            style={{ borderRadius: 5, marginTop: 20 }}
            backgroundColor={Colors.white_light_dark}
            mode="elevated"
            onPress={() => useMethodWrapper(navigation.push('Phone'))}
          >
            Continue with Phone
          </CustomButtonV2>
        </SocialContainer>
        <CustomAccountContainer>
          <Typography
            style={{ marginTop: 10 }}
            title="Or"
            color={Colors.grey}
            fontFamily="Roboto-Medium"
            size={15}
          />
          <Formik
            initialValues={{
              email: onboardingData?.user_data?.email,
              ...(showPass && { password: onboardingData?.user_data?.password })
            }}
            validationSchema={OnboardingSchema}
            onSubmit={(values, test) => {
              !showPass
                ? makeRequest({ email: values.email })
                : authenticate({
                    email: values.email,
                    password: values.password!
                  });
            }}
            validateOnChange={false}
            validateOnBlur
          >
            {({
              values,
              setTouched,
              setFieldValue,
              touched,
              errors,
              submitForm
            }) => (
              <>
                <Field>
                  <TextInput
                    color={
                      errors?.email && touched?.email
                        ? Colors.error_light
                        : Colors.primary
                    }
                    style={{ marginTop: 5 }}
                    width="100%"
                    height="45px"
                    label="Email"
                    value={values.email}
                    onChange={(val) => {
                      dispatch({
                        type: 'BY_KEY',
                        property: 'email',
                        value: val
                      });
                      setTouched({ ...touched, email: true });
                      setFieldValue('email', val);
                      if (!val.length) {
                        setShowPass(false);
                      }
                    }}
                    editable={true}
                  />
                  {errors?.email && touched?.email && (
                    <StyledTypography
                      title={errors?.email}
                      size={10}
                      color={Colors.error}
                    />
                  )}
                </Field>
                {showPass && (
                  <Field>
                    <TextInput
                      secureTextEntry
                      color={Colors.primary}
                      style={{ marginTop: 5 }}
                      width="100%"
                      height="45px"
                      label="Password"
                      value={values.password}
                      onChange={(val) => {
                        dispatch({
                          type: 'BY_KEY',
                          property: 'password',
                          value: val
                        });
                        setFieldValue('password', val);
                      }}
                      editable={true}
                    />
                  </Field>
                )}
                <CustomButton
                  disabled={
                    handleEmailChecking.isLoading ||
                    handleAuthenticate.isLoading
                  }
                  background={
                    !handleEmailChecking.isLoading &&
                    !handleAuthenticate.isLoading
                      ? Colors.blue
                      : Colors.grey_light
                  }
                  textColor={Colors.white}
                  style={{
                    borderRadius: 5,
                    width: WIDTH - 80,
                    marginTop: 10
                  }}
                  onPress={() =>
                    useMethodWrapper(() => {
                      submitForm();
                    })
                  }
                  label={
                    showPass
                      ? handleAuthenticate.isLoading
                        ? 'LOGGING IN ...'
                        : 'LOGIN'
                      : handleEmailChecking.isLoading
                      ? 'CHECKING ...'
                      : 'SUBMIT'
                  }
                />
                {error && (
                  <Typography
                    style={{ marginTop: 10 }}
                    fontFamily="Roboto-Medium"
                    title={error}
                    size={12}
                    color={Colors.error}
                  />
                )}
              </>
            )}
          </Formik>
        </CustomAccountContainer>
      </Container>
    </MainContainer>
  );
};

const Container = styled.View`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${HEIGHT}px;
  width: ${WIDTH}px;
  background: ${Colors.white};
`;

const LogoImage = styled.Image`
  height: 120px;
  resize-mode: contain;
`;

const SocialContainer = styled.View`
  width: ${WIDTH - 80}px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CustomAccountContainer = styled.View`
  width: ${WIDTH - 80}px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Field = styled.View`
  position: relative;
  height: 70px;
  width: 100%;
`;

const StyledTypography = styled(Typography)`
  position: absolute;
  bottom: 0;
  left: 0;
`;
