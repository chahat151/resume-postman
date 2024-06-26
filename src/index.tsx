import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "animate.css/animate.min.css";
import "react-toastify/dist/ReactToastify.css";
import App from "./App";
import { store, persistor } from "./store/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
