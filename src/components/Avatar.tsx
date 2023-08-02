import React from 'react';
import { Image } from 'react-native';
import { Avatar as ModuleAvatar } from 'react-native-paper';
import styled from 'styled-components/native';

import ActiveIcon from './../../assets/icons/online_icon.png';
import OfflineIcon from './../../assets/icons/offline_icon.png';

const Avatar = ({
  style,
  source,
  size,
  showActive = true,
  active
}: {
  style?: any;
  source: string | undefined;
  size: number;
  showActive?: boolean;
  active?: boolean;
}) => {
  return (
    <Container style={style}>
      <ModuleAvatar.Image
        size={size || 35}
        source={{
          uri:
            source ||
            'data:image/png;base64,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'
        }}
      />
      {showActive && (
        <StyledActiveIndicator
          style={{ width: 15, height: 15 }}
          source={active ? ActiveIcon : OfflineIcon}
        />
      )}
    </Container>
  );
};

const Container = styled.View`
  position: relative;
`;

const StyledActiveIndicator = styled(Image)`
  position: absolute;
  bottom: -3px;
  right: 0;
`;

export default Avatar;
