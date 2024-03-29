import React, { useCallback, useImperativeHandle, useRef } from 'react';
import { StyleSheet, View, Dimensions, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const MAX_TRANSLATE_Y = -SCREEN_HEIGHT;

type BottomSheetProps = {
  children?: React.ReactNode;
};

export type BottomSheetRefProps = {
  scrollTo: (destination: number) => void;
  is_active: () => boolean;
};

export const BottomSheetView = React.forwardRef<
  BottomSheetRefProps,
  BottomSheetProps
>(({ children }, ref) => {
  const translateY = useSharedValue(0);
  const active = useSharedValue(false);

  const scrollTo = useCallback((destination: number) => {
    'worklet';
    active.value = destination !== 0;

    translateY.value = withSpring(destination, { damping: 50 });
  }, []);

  const is_active = useCallback(() => {
    return active.value;
  }, []);

  useImperativeHandle(ref, () => ({ scrollTo, is_active }), [
    scrollTo,
    is_active
  ]);

  const context = useSharedValue({ y: 0 });
  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate((event) => {
      translateY.value = event.translationY + context.value.y;
      translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y);
    })
    .onEnd(() => {
      if (translateY.value > -SCREEN_HEIGHT / 2) {
        scrollTo(0);
      } else if (translateY.value < -SCREEN_HEIGHT / 2) {
        scrollTo(MAX_TRANSLATE_Y);
      }
    });

  const rBottomSheetStyle = useAnimatedStyle(() => {
    const borderRadius = interpolate(
      translateY.value,
      [MAX_TRANSLATE_Y + 50, MAX_TRANSLATE_Y],
      [25, 5],
      Extrapolate.CLAMP
    );

    return {
      borderRadius,
      transform: [{ translateY: translateY.value }]
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles2.bottomSheetContainer, rBottomSheetStyle]}>
        <View style={styles2.line} />
        {children}
      </Animated.View>
    </GestureDetector>
  );
});

const styles2 = StyleSheet.create({
  bottomSheetContainer: {
    height: SCREEN_HEIGHT,
    width: '100%',
    backgroundColor: 'white',
    position: 'absolute',
    top: SCREEN_HEIGHT,
    borderRadius: 25,
    zIndex: 10
  },
  line: {
    width: 75,
    height: 4,
    backgroundColor: 'grey',
    alignSelf: 'center',
    marginVertical: 15,
    borderRadius: 2
  }
});
