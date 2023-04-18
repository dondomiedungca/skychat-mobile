import { Keyboard } from 'react-native';

export default function useMethodWrapper(payload: any) {
  Keyboard.dismiss();
  typeof payload === 'function' ? payload() : () => payload;
}
