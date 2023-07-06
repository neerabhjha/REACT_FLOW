import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import store from "./redux/store";
import { ReactFlowProvider } from "reactflow";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ReactFlowProvider>
    <Provider store={store}>
      <App />
    </Provider>
  </ReactFlowProvider>
);
