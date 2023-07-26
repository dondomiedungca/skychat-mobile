import {
  NavigatorScreenParams,
  createNavigationContainerRef,
  StackActions
} from '@react-navigation/native';
import { RootParamList } from '../screens/navigation';

type ScreenParams = Partial<NavigatorScreenParams<RootParamList>>;
type ScreenOptions<Screen extends keyof RootParamList> =
  | (RootParamList[Screen] & ScreenParams)
  | ScreenParams;
type Navigate<Screen extends keyof RootParamList> = (
  ...args: undefined extends RootParamList[Screen]
    ? [screen: Screen] | [screen: Screen, params?: ScreenOptions<Screen>]
    : [screen: Screen, params?: ScreenOptions<Screen>]
) => void;

export const navigationRef = createNavigationContainerRef<RootParamList>();

export function navigate<Screen extends keyof RootParamList>(
  screen: Screen,
  options?: ScreenOptions<Screen>
) {
  if (navigationRef.isReady()) {
    const nav = navigationRef.navigate as Navigate<Screen>;
    nav(screen, options);
  }
}

export function navigationReplace<Screen extends keyof RootParamList>(
  screen: Screen,
  options?: ScreenOptions<Screen>
) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.replace(screen, options));
  }
}

export function navigationPush<Screen extends keyof RootParamList>(
  screen: Screen,
  options?: ScreenOptions<Screen>
) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.push(screen, options));
  }
}
