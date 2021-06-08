import styled from "@emotion/styled";
import Box from "@material-ui/core/Box";
import React from "react";

import { QuickStart } from "@/containers/QuickStart";
import { useApp } from "@/store/app";
import { withSlippiBackground } from "@/styles/withSlippiBackground";

const OuterBox = styled(Box)`
  ${withSlippiBackground}
`;

export const LandingView: React.FC = () => {
  const user = useApp((store) => store.user);
  return (
    <OuterBox display="flex" style={{ height: "100%", width: "100%" }}>
      <QuickStart user={user} />
    </OuterBox>
  );
};