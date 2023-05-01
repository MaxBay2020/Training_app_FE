import React, { useEffect } from "react";

import TrainingPage from "./pages/TrainingPage";
import useLogin from "./hooks/authHooks/useLogin";
import { useSelector } from "react-redux";

const Main = ({ userEmail }) => {
  const { accessToken } = useSelector((state) => state.user);

  const { mutate: loginUser } = useLogin(["login"]);

  useEffect(() => {
    if (userEmail) {
      loginUser({ email: userEmail });
    }
  }, []);

  return accessToken ? <TrainingPage /> : null;
};

export default Main;
