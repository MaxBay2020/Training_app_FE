import React, { useState, useEffect } from "react";
import { useOktaAuth } from "@okta/okta-react";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import Main from "./Main";
import BasicLayout from "./layout/BasicLayout";
import { Container } from "@mui/material";
import { Navigate } from "react-router-dom";

const Protected = () => {
  const { authState, oktaAuth } = useOktaAuth();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    if (!authState || !authState.isAuthenticated) {
      setUserInfo(null);
    } else {
      oktaAuth
        .getUser()
        .then((info) => {
          setUserInfo(info);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [authState, oktaAuth]); // Update if authState changes

  if (!userInfo) {
    return (
      <BasicLayout>
        <Container>
          <div>
            <p>Fetching user info ...</p>
          </div>
        </Container>
      </BasicLayout>
    );
  }

  return userInfo != null ? (
    <Main userEmail={userInfo.email} />
  ) : (
    <Navigate to="/training" />
  );
};

export default Protected;
