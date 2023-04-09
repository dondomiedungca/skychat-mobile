import React from "react";
import styled from "styled-components/native";
import { AntDesign } from "@expo/vector-icons";

// components
import MainContainer from "../../components/MainContainer";
import { CustomButton } from "../../components/Buttons";
import { Typography } from "../../components/Typography";

// assets
import Logo from "./../../../assets/png/logo-no-background.png";
import Colors from "../../types/Colors";

export const GetStarted = () => {
  return (
    <MainContainer>
      <Container>
        <LogoImage source={Logo} />
        <CustomButton
          style={{ marginTop: 30, width: 170 }}
          label="GET STARTED"
          onPress={() => {}}
          textColor={Colors.white}
          iconRight={
            <AntDesign name="arrowright" size={20} color={Colors.white} />
          }
        />
        <CustomButton
          mode="outlined"
          style={{ marginTop: 10, width: 170, marginBottom: 10 }}
          label="LEARN MORE"
          onPress={() => {}}
          textColor={Colors.primary}
        />
        <Typography
          style={{ marginTop: 40 }}
          title="POWERED BY MAINROW"
          color={Colors.secondary}
          size={12}
        />
        <Typography
          title="Copyright © 2023 All Rights Reserved"
          color={Colors.secondary}
          size={10}
        />
      </Container>
    </MainContainer>
  );
};

const Container = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  background: ${Colors.white};
`;

const LogoImage = styled.Image`
  height: 120px;
  resize-mode: contain;
`;
