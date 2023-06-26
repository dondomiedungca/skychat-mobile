import React from 'react';
import { Image } from 'react-native';
import { Avatar as ModuleAvatar } from 'react-native-paper';
import styled from 'styled-components/native';

import ActiveIcon from './../../assets/icons/online_icon.png';
import OfflineIcon from './../../assets/icons/offline_icon.png';

const Avatar = ({
  source,
  size,
  showActive = true,
  active
}: {
  source: string | undefined;
  size: number;
  showActive?: boolean;
  active?: boolean;
}) => {
  return (
    <Container>
      <ModuleAvatar.Image
        size={size || 35}
        source={{ uri: source || 'https://i.pravatar.cc/100' }}
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
  bottom: 0;
  right: 0;
`;

export default Avatar;
