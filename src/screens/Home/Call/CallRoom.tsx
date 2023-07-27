import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import styled from 'styled-components/native';
import {
  ScreenCapturePickerView,
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  MediaStreamTrack,
  mediaDevices,
  registerGlobals
} from 'react-native-webrtc';

import Colors from '../../../types/Colors';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Dimensions } from 'react-native';
import Avatar from '../../../components/Avatar';
import { UserContext } from '../../../context/user.context';
import { Typography } from '../../../components/Typography';
import Constants from 'expo-constants';
import { io } from 'socket.io-client';
import { StackNavigationProp } from '@react-navigation/stack';
import { CallStackParamList, RootParamList } from '../../navigation';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { CallType } from '../../../types/Call';
import { navigationRef } from '../../../libs/rootNavigation';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;
const BASE_URL = Constants?.expoConfig?.extra?.API_URL;

const SERVERS = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302']
    }
  ]
};

type CallScreenProps = {
  navigation: StackNavigationProp<RootParamList>;
  route: RouteProp<CallStackParamList, 'CallRoom'>;
};

const CallRoom = ({ navigation, route }: CallScreenProps) => {
  const { user } = useContext(UserContext);
  /**
   * For offer type
   */
  const partner = route?.params?.user;
  const type = route?.params?.type;

  /**
   * For call type
   */
  const externalRoomId = route?.params?.roomId;
  const externalOffer = route?.params?.offer;

  const [localStream, setLocalStream] = useState<MediaStream | null>();
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(
    new MediaStream(undefined)
  );
  const peerConnection = useRef<any>(
    new RTCPeerConnection({
      iceServers: [
        {
          urls: 'stun:stun.l.google.com:19302'
        },
        {
          urls: 'stun:stun1.l.google.com:19302'
        },
        {
          urls: 'stun:stun2.l.google.com:19302'
        }
      ]
    })
  );

  const [isOpenCam, setOpenCam] = useState<boolean>(true);
  const [isOpenMic, setOpenMic] = useState<boolean>(true);
  const [isFlip, setFlip] = useState<boolean>(true);

  // const roomId = useMemo(() => {
  //   const parties = [partner, user].sort(
  //     (a, b) =>
  //       new Date(b?.created_at!).getTime() - new Date(a?.created_at!).getTime()
  //   );

  //   return parties.map((p) => p?.id).join('_call_room_');
  // }, [partner, user]);
  const roomId = 'test_room';

  /**
   * * Socket Iniiialization
   */
  const socket = useMemo(() => {
    return io(`${BASE_URL}/call`, {
      query: {
        roomId
      },
      forceNew: true
    });
  }, []);

  /**
   * * For Exit
   */
  const exit = useCallback(() => {
    localStream?.getTracks()?.forEach((track: any) => track.stop());
    remoteStream?.getTracks()?.forEach((track: any) => track.stop());
    setLocalStream(null);
    setRemoteStream(null);
    if (
      navigationRef?.canGoBack() &&
      navigationRef?.getCurrentRoute()?.name === 'CallRoom'
    ) {
      navigationRef.goBack();
    }
  }, [navigationRef, peerConnection, localStream, remoteStream]);

  /**
   * * Listener for exchanging
   */
  useEffect(() => {
    socket.on('call-partnerManualEnd', () => {
      exit();
    });
    socket.on('call-addAnswer', (data) => {
      if (!peerConnection.current.currentRemoteDescription) {
        peerConnection.current.setRemoteDescription(
          new RTCSessionDescription(data.answer)
        );
      }
    });
    socket.on('call-handleIceCandidate', (data) => {
      if (peerConnection.current) {
        if (peerConnection.current) {
          peerConnection?.current.addIceCandidate(
            new RTCIceCandidate(data.candidate)
          );
        }
      }
    });

    peerConnection.current.onicecandidate = (event: any) => {
      socket.emit('call-handleIceCandidate', {
        candidate: event.candidate,
        roomId
      });
    };

    peerConnection.current.addEventListener('icecandidate', (event: any) => {
      if ((event as any)?.candidate) {
        socket.emit('call-handleIceCandidate', {
          candidate: (event as any)?.candidate,
          roomId
        });
      }
    });

    peerConnection.current.addEventListener('track', (event: any) => {
      remoteStream?.addTrack((event as any).track);
    });

    localStream
      ?.getTracks()
      .forEach((track) => peerConnection.current.addTrack(track, localStream));

    return () => {
      socket.off('call-partnerManualEnd');
      socket.off('call-addAnswer');
      socket.off('call-handleIceCandidate');
    };
  }, [localStream, remoteStream, user]);

  /**
   * * Disconnection
   */
  useEffect(() => {
    (async () => {
      const media = await mediaDevices.getUserMedia({
        audio: true,
        video: {
          mandatory: {
            minWidth: 500, // Provide your own width, height and frame rate here
            minHeight: 300,
            minFrameRate: 30
          },
          facingMode: 'user'
        }
      });

      setLocalStream(media);
    })();

    return () => {
      socket.disconnect();
    };
  }, []);

  const createOffer = async () => {
    if (peerConnection.current) {
      const offer = await peerConnection.current.createOffer({
        mandatory: {
          OfferToReceiveAudio: true,
          OfferToReceiveVideo: true,
          VoiceActivityDetection: true
        }
      });
      await peerConnection.current.setLocalDescription(offer);
      socket.emit('call-handleOffer', {
        offer,
        partnerId: partner?.id,
        roomId,
        caller: user
      });
    }
  };

  const createAnswer = async (roomIdParam?: string, offerParam?: any) => {
    peerConnection.current.setRemoteDescription(
      new RTCSessionDescription(offerParam)
    );
    const answer = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(answer);

    socket.emit('call-addAnswer', { roomId: roomIdParam, answer });
  };

  useFocusEffect(
    useCallback(() => {
      if (type == CallType.CALL) {
        createOffer();
      } else {
        createAnswer(externalRoomId, externalOffer);
      }
    }, [])
  );

  const toggleCamera = useCallback(async () => {
    setOpenCam(!isOpenCam);
    if (localStream) {
      const videoTrack = await localStream.getVideoTracks()[0];
      videoTrack.enabled = !isOpenCam;
    }
  }, [isOpenCam, localStream]);

  const toggleMic = useCallback(() => {
    setOpenMic(!isOpenMic);
  }, [isOpenMic]);

  const flipCamera = useCallback(async () => {
    setFlip(!isFlip);
    if (localStream) {
      const videoTrack = await localStream.getVideoTracks()[0];
      videoTrack._switchCamera();
    }
  }, [isFlip, localStream]);

  return (
    <Container>
      <CurrentUserContainer>
        {isOpenCam && localStream && (
          <Video
            mirror={!!isFlip}
            objectFit={'cover'}
            streamURL={localStream.toURL()}
            zOrder={10}
          />
        )}
        {!isOpenCam && (
          <BlackCover>
            <Avatar
              source={user?.user_meta?.profile_photo}
              size={80}
              showActive={false}
            />
            <Typography
              title={`${user?.first_name} ${user?.last_name}`}
              size={15}
              color={Colors.white}
            />
          </BlackCover>
        )}
      </CurrentUserContainer>
      <ButtonContainer>
        <StyledTouchableOpacity onPress={toggleCamera}>
          <MaterialCommunityIcons
            name={isOpenCam ? 'camera' : 'camera-off'}
            size={30}
            color={isOpenCam ? Colors.primary : Colors.grey_light}
          />
        </StyledTouchableOpacity>
        <StyledTouchableOpacity onPress={toggleMic}>
          <MaterialCommunityIcons
            name={isOpenMic ? 'microphone' : 'microphone-off'}
            size={30}
            color={isOpenMic ? Colors.primary : Colors.grey_light}
          />
        </StyledTouchableOpacity>
        <StyledTouchableOpacity style={{ backgroundColor: Colors.error_light }}>
          <MaterialIcons
            onPress={() => {
              socket.emit('call-manualEnd', { partnerId: partner?.id });
              exit();
            }}
            name="call-end"
            size={30}
            color={Colors.white}
          />
        </StyledTouchableOpacity>
      </ButtonContainer>
      <StyledTouchableOpacity
        onPress={flipCamera}
        style={{
          backgroundColor: Colors.grey_light,
          position: 'absolute',
          bottom: 15,
          right: 15,
          width: 30,
          borderRadius: 10,
          height: 30
        }}
      >
        <MaterialCommunityIcons
          name="rotate-3d-variant"
          size={24}
          color={Colors.white}
        />
      </StyledTouchableOpacity>
    </Container>
  );
};

const Container = styled.View`
  width: 100%;
  flex: 1;
  background: ${Colors.grey};
  position: relative;
  display: flex;
  flex-direction: column;
`;

const RemoteUserContainer = styled.View`
  position: relative;
  width: ${WIDTH}px;
  height: ${HEIGHT / 2}px;
`;

const CurrentUserContainer = styled.View`
  position: relative;
  width: ${WIDTH}px;
  height: ${HEIGHT}px;
`;

const BlackCover = styled.View`
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${Colors.black};
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
  align-items: center;
`;

const Video = styled(RTCView)`
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const ButtonContainer = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: 0;
  left: 0;
  height: 80px;
  width: ${WIDTH}px;
  background: transparent;
  gap: 15px;
`;

const StyledTouchableOpacity = styled.TouchableOpacity`
  background: ${Colors.white};
  height: 50px;
  width: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 60px;
`;
export default CallRoom;
