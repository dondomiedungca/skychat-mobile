import React, { useCallback, useEffect, useState } from 'react';
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
import { MaterialCommunityIcons } from '@expo/vector-icons';

const CallRoom = () => {
  const [localStream, setLocalStream] = useState<any>();

  const [isOpenCam, setOpenCam] = useState<boolean>(true);
  const [isOpenMic, setOpenMic] = useState<boolean>(true);
  const [isFlip, setFlip] = useState<boolean>(true);

  const init = useCallback(async () => {
    try {
      const mediaStream = await mediaDevices.getUserMedia({
        audio: true,
        video: {
          frameRate: 30,
          facingMode: 'user'
        }
      });

      setLocalStream(mediaStream);
    } catch (err) {
      console.log(err);
    }
  }, []);

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

  useEffect(() => {
    init();
  }, []);

  return (
    <Container>
      <CurrerntUserContainer>
        <Video
          mirror={!!isFlip}
          objectFit={'cover'}
          streamURL={localStream?.toURL()}
          zOrder={10}
        />
        {!isOpenCam && <BlackCover />}
      </CurrerntUserContainer>
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
      </ButtonContainer>
      <StyledTouchableOpacity
        onPress={flipCamera}
        style={{
          backgroundColor: Colors.grey_light,
          position: 'absolute',
          bottom: 15,
          right: 15,
          width: 40,
          borderRadius: 10,
          height: 40
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
`;

const CurrerntUserContainer = styled.View`
  position: relative;
  width: 100%;
  height: 100%;
`;

const BlackCover = styled.View`
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${Colors.grey};
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
  width: 100%;
  background: transparent;
  gap: 15px;
`;

const StyledTouchableOpacity = styled.TouchableOpacity`
  background: ${Colors.white};
  height: 60px;
  width: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 60px;
`;
export default CallRoom;
