import React from "react";
import { StatusBar } from "react-native";
import styled from "styled-components/native";

interface Props {
  children: React.ReactNode;
}

const MainContainer: React.FC<Props> = ({ children }) => {
  return <ContainerView>{children}</ContainerView>;
};

const ContainerView = styled.View`
  padding-top: ${StatusBar.currentHeight}px;
`;

export default MainContainer;
