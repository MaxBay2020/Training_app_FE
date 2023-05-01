import React from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { Security } from "@okta/okta-react";
import { OktaAuth, toRelativeUrl } from "@okta/okta-auth-js";
import config from "./config";
import "./index.css";
import { Provider as ReduxProvider } from "react-redux";
import store from "./redux/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material/styles";
import Login from "./OktaLogin";
import OktaLogin from "./OktaLogin";

const oktaAuth = new OktaAuth(config.oidc);
const reactQueryClient = new QueryClient();
const App = () => {
  const history = useNavigate();

  const customAuthHandler = () => {
    history("/training");
  };

  const restoreOriginalUri = async (_oktaAuth, originalUri) => {
    history(toRelativeUrl(originalUri || "", window.location.origin));
  };

  return (
    <Security
      oktaAuth={oktaAuth}
      onAuthRequired={customAuthHandler}
      restoreOriginalUri={restoreOriginalUri}
    >
      <React.StrictMode>
        <CssVarsProvider>
          <QueryClientProvider client={reactQueryClient}>
            <ReduxProvider store={store}>
              <Routes>
                <Route path="/*" exact element={<Navigate to="/training" />} />
                <Route path="/training/*" exact element={<OktaLogin />} />
              </Routes>
            </ReduxProvider>
            <ToastContainer
              position="bottom-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
            <ReactQueryDevtools initialOpen={false} position="bottom-right" />
          </QueryClientProvider>
        </CssVarsProvider>
      </React.StrictMode>
    </Security>
  );
};

export default App;
