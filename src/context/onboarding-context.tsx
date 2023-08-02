import React, { useReducer } from 'react';

export type OnBoardContextType = {
  onboardingData: OnBoardingData;
  dispatch: ({
    property,
    value,
    type
  }: {
    property?: keyof OnBoardingData | keyof OnBoardingData['user_data'];
    value: OnBoardingData | any;
    type: 'BY_KEY' | 'DIRECT' | 'RESET';
  }) => void;
};

const initialOnBoarding: OnBoardingData = {
  phone_number: '',
  formatted_phone_number: '',
  code: '',
  user_data: {
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: ''
  }
};

export const OnboardContext = React.createContext<OnBoardContextType>({
  onboardingData: initialOnBoarding,
  dispatch: () => {}
});

interface Props {
  children: React.ReactNode;
}

export interface OnBoardingData {
  phone_number: string | null;
  formatted_phone_number: string | null;
  code: string;
  user_data: {
    first_name: string;
    last_name: string;
    email: string;
    password?: string;
    confirm_password?: string;
  };
}

const OnBoardContextComponent: React.FC<Props> = ({ children }) => {
  const reducer = (
    state: OnBoardingData,
    action: {
      property?: keyof OnBoardingData | keyof OnBoardingData['user_data'];
      value: OnBoardingData | any;
      type: 'BY_KEY' | 'DIRECT' | 'RESET';
    }
  ) => {
    switch (action.type) {
      case 'BY_KEY':
        if (state.hasOwnProperty(action.property!)) {
          state = { ...state, [action.property!]: action.value };
        } else {
          state = {
            ...state,
            user_data: {
              ...state.user_data,
              [action.property!]: action.value
            }
          };
        }
        return state;
      case 'DIRECT':
        return action.value;
      default:
        return initialOnBoarding;
    }
  };

  const [onboardingData, dispatch] = useReducer(reducer, initialOnBoarding);

  return (
    <OnboardContext.Provider value={{ onboardingData, dispatch }}>
      {children}
    </OnboardContext.Provider>
  );
};

export default OnBoardContextComponent;
