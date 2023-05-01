import React from "react";
import OktaSignInWidget from "./OktaSignInWidget";
import { useOktaAuth } from "@okta/okta-react";
import Protected from "./Protected";
import BasicLayout from "./layout/BasicLayout";
import { Container } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import CreditPage from "./pages/CreditPage";

const OktaLogin = ({ config }) => {
  const { oktaAuth, authState } = useOktaAuth();

  const onSuccess = (tokens) => {
    oktaAuth.handleLoginRedirect(tokens);
  };

  const onError = (err) => {
    console.log("Sign in error:", err);
  };

  if (!authState) {
    return (
      <BasicLayout>
        <Container>
          <div>Loading ... </div>
        </Container>
      </BasicLayout>
    );
  }

  return authState.isAuthenticated ? (
    <Routes>
      <Route path="" element={<Protected />} />
      <Route path="credit" element={<CreditPage />} />
    </Routes>
  ) : (
    <BasicLayout>
      <Container>
        <OktaSignInWidget
          config={config}
          onSuccess={onSuccess}
          onError={onError}
        />
      </Container>
    </BasicLayout>
  );
};

export default OktaLogin;
