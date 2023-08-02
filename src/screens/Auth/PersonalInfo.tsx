import { AntDesign } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from 'react';
import { Dimensions, View } from 'react-native';
import styled from 'styled-components/native';
import { CustomButton } from '../../components/Buttons';
import Colors from '../../types/Colors';
import { AuthStackParamList, RootParamList } from '../navigation';
import useMethodWrapper from '../../libs/useWrapper';
import { OnboardContext } from '../../context/onboarding-context';
import { TypeVerification, useCompleteOnboarding } from './../../libs/useUser';
import { RouteProp } from '@react-navigation/native';
import { useFetchEffect } from '../../libs/useFetchEffect';
import { Typography } from '../../components/Typography';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';
import { UserContext } from '../../context/user.context';
import PersonalInformationVector from './../../../assets/png/personal_information.jpg';
import TextInput from '../../components/TextInput';
import { Checkbox } from 'react-native-paper';
import { Formik, useFormik, useFormikContext } from 'formik';
import * as Yup from 'yup';
import { values } from 'lodash';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

type PhoneScreenProps = {
  navigation: StackNavigationProp<RootParamList>;
  route: RouteProp<AuthStackParamList, 'PersonalInfo'>;
};

export const PersonalInfo = ({ navigation, route }: PhoneScreenProps) => {
  const { onboardingData, dispatch } = useContext(OnboardContext);
  const { setUser } = useContext(UserContext);
  const { makeRequest, ...handleCompleteOnBoarding } = useCompleteOnboarding();
  const [check, setCheck] = useState<boolean>(false);
  const [emailExistError, setEmailExistError] = useState<string | null>(null);
  const type = route.params.type;

  const OnboardingSchema = Yup.object().shape({
    first_name: Yup.string()
      .min(2, 'First name is too short!')
      .max(50, 'Last name is too long!')
      .required('Required'),
    last_name: Yup.string()
      .min(2, 'Last name is too short!')
      .max(50, 'Last name is too long!!')
      .required('Required'),
    email: Yup.string()
      .email('Please enter a valid email')
      .required('Required'),
    ...(type == TypeVerification.EMAIL && {
      password: Yup.string()
        .min(5, 'Password is too short!')
        .max(50, 'Password is too long!')
        .required('Required'),
      confirm_password: Yup.string()
        .min(5, 'Confirm password is too short!')
        .max(50, 'Confirm password is too long!')
        .required('Required')
    })
  });

  const BackButton = () =>
    navigation.canGoBack() ? (
      <CustomButton
        style={{ padding: 10, position: 'absolute', top: 0, left: 0 }}
        onPress={() => navigation.goBack()}
        label={<AntDesign name="arrowleft" size={20} color={Colors.white} />}
      />
    ) : null;

  useFetchEffect(handleCompleteOnBoarding, {
    onData: async (data: any) => {
      if (data?.is_success) {
        setEmailExistError(null);
        if (data?.authTokens?.accessToken && data?.authTokens?.refreshToken) {
          const accessToken = data?.authTokens?.accessToken;
          const refreshToken = data?.authTokens?.refreshToken;
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
        setEmailExistError('Email is already exists.');
      }
    }
  });

  const StepIndicator = () => {
    return (
      <StepIndicatorContainer>
        <Step active></Step>
        <Step active></Step>
        <Step active></Step>
      </StepIndicatorContainer>
    );
  };

  return (
    <Container>
      <BackButton />
      <StepIndicator />
      <StyledImage source={PersonalInformationVector} />
      <Typography
        title={'Welcome and cheers!!! Now set your profile'}
        size={17}
        color={Colors.blue}
        fontFamily="Roboto-Bold"
      />
      <Formik
        initialValues={{
          first_name: onboardingData?.user_data?.first_name,
          last_name: onboardingData?.user_data?.last_name,
          email: onboardingData?.user_data?.email,
          ...(type === TypeVerification.EMAIL && {
            password: onboardingData?.user_data?.password,
            confirm_password: onboardingData?.user_data?.confirm_password
          })
        }}
        validationSchema={OnboardingSchema}
        onSubmit={(values, test) => {
          makeRequest(onboardingData);
        }}
        validateOnChange={false}
        validateOnBlur
      >
        {({
          values,
          setFieldValue,
          touched,
          errors,
          setTouched,
          submitForm
        }) => (
          <FieldContainer>
            <Field>
              <TextInput
                color={
                  touched.first_name && errors.first_name
                    ? Colors.error_light
                    : Colors.primary
                }
                style={{ marginTop: 5 }}
                width="100%"
                height="45px"
                label="First Name *"
                name="first_name"
                value={values.first_name}
                onChange={(val) => {
                  dispatch({
                    type: 'BY_KEY',
                    property: 'first_name',
                    value: val
                  });
                  setTouched({ ...touched, first_name: true });
                  setFieldValue('first_name', val);
                }}
                editable={true}
              />
              {errors?.first_name && touched?.first_name && (
                <StyledTypography
                  title={errors.first_name}
                  size={10}
                  color={Colors.error}
                />
              )}
            </Field>
            <Field>
              <TextInput
                color={
                  errors.last_name && touched?.last_name
                    ? Colors.error_light
                    : Colors.primary
                }
                style={{ marginTop: 5 }}
                width="100%"
                height="45px"
                label="Last Name *"
                value={values.last_name}
                onChange={(val) => {
                  dispatch({
                    type: 'BY_KEY',
                    property: 'last_name',
                    value: val
                  });
                  setTouched({ ...touched, last_name: true });
                  setFieldValue('last_name', val);
                }}
                editable={true}
              />
              {errors?.last_name && touched?.last_name && (
                <StyledTypography
                  title={errors.last_name}
                  size={10}
                  color={Colors.error}
                />
              )}
            </Field>
            <Field>
              <TextInput
                color={
                  (errors.email && touched?.email) || emailExistError
                    ? Colors.error_light
                    : Colors.primary
                }
                style={{ marginTop: 5 }}
                width="100%"
                height="45px"
                label="Email *"
                value={values.email}
                onChange={(val) => {
                  dispatch({
                    type: 'BY_KEY',
                    property: 'email',
                    value: val
                  });
                  setTouched({ ...touched, email: true });
                  setFieldValue('email', val);
                }}
                editable={true}
              />
              {((errors?.email && touched?.email) || emailExistError) && (
                <StyledTypography
                  title={errors?.email || emailExistError || ''}
                  size={10}
                  color={Colors.error}
                />
              )}
            </Field>
            {type === TypeVerification.EMAIL && (
              <>
                <Field>
                  <TextInput
                    secureTextEntry
                    color={
                      errors.password && touched?.password
                        ? Colors.error_light
                        : Colors.primary
                    }
                    style={{ marginTop: 5 }}
                    width="100%"
                    height="45px"
                    label="Password *"
                    value={values.password}
                    onChange={(val) => {
                      dispatch({
                        type: 'BY_KEY',
                        property: 'password',
                        value: val
                      });
                      setTouched({ ...touched, password: true });
                      setFieldValue('password', val);
                    }}
                    editable={true}
                  />
                  {errors?.password && touched?.password && (
                    <StyledTypography
                      title={errors.password}
                      size={10}
                      color={Colors.error}
                    />
                  )}
                </Field>
                <Field>
                  <TextInput
                    secureTextEntry
                    color={
                      (errors?.confirm_password && touched?.confirm_password) ||
                      (values?.password !== values?.confirm_password &&
                        touched?.confirm_password)
                        ? Colors.error_light
                        : Colors.primary
                    }
                    style={{ marginTop: 5, marginBottom: 10 }}
                    width="100%"
                    height="45px"
                    label="Confirm Password*"
                    value={values.confirm_password}
                    onChange={(val) => {
                      dispatch({
                        type: 'BY_KEY',
                        property: 'confirm_password',
                        value: val
                      });
                      setTouched({ ...touched, confirm_password: true });
                      setFieldValue('confirm_password', val);
                    }}
                    editable={true}
                  />
                  {((errors?.confirm_password && touched?.confirm_password) ||
                    (values?.password !== values?.confirm_password &&
                      touched?.confirm_password)) && (
                    <StyledTypography
                      title={
                        !!errors.confirm_password
                          ? errors.confirm_password
                          : values?.password !== values?.confirm_password
                          ? 'Must match "password" field value'
                          : ''
                      }
                      size={10}
                      color={Colors.error}
                    />
                  )}
                </Field>
              </>
            )}
            <CheckBoxContainer>
              <Checkbox
                color={Colors.blue}
                status={check ? 'checked' : 'unchecked'}
                onPress={() => {
                  setCheck(!check);
                }}
              />
              <Typography
                title={'TERMS AND CONDITION'}
                size={12}
                color={Colors.grey}
              />
            </CheckBoxContainer>
            <CustomButton
              disabled={
                !check ||
                handleCompleteOnBoarding.isLoading ||
                (touched.confirm_password && touched.password
                  ? values?.password !== values?.confirm_password
                  : false)
              }
              background={
                check &&
                !handleCompleteOnBoarding.isLoading &&
                (touched.confirm_password && touched.password
                  ? values?.password === values?.confirm_password
                  : true)
                  ? Colors.blue
                  : Colors.grey_light
              }
              textColor={Colors.white}
              style={{
                borderRadius: 5
              }}
              onPress={() =>
                useMethodWrapper(() => {
                  submitForm();
                })
              }
              label={
                handleCompleteOnBoarding.isLoading ? 'PROCESSING ...' : 'SUBMIT'
              }
            />
          </FieldContainer>
        )}
      </Formik>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  padding-top: 50px;
  height: ${HEIGHT}px;
  width: ${WIDTH}px;
  background: ${Colors.white};
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: center;
  justify-content: center;
`;

const StepIndicatorContainer = styled.View`
  width: 200px;
  height: 50px;
  position: absolute;
  right: 10px;
  top: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  gap: 5px;
  z-index: 2;
`;

const Step = styled.View<{ active?: boolean }>`
  border-radius: 3px;
  background: ${({ active }) =>
    active ? Colors.primary : Colors.white_semi_dark};
  width: 30px;
  height: 5px;
`;

const StyledImage = styled.Image`
  width: 100%;
  height: 200px;
  aspect-ratio: 1.5/1.1;
  margin-bottom: 30px;
`;

const FieldContainer = styled.View`
  width: ${WIDTH}px;
  padding: 25px;
  display: flex;
  flex-direction: column;
`;

const CheckBoxContainer = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Field = styled.View`
  position: relative;
  height: 70px;
`;

const StyledTypography = styled(Typography)`
  position: absolute;
  bottom: 0;
  left: 0;
`;
