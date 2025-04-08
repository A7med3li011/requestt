import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.scss";
import { BrowserRouter } from "react-router-dom";
import "./config/i18n.js";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { LanguageProvider } from "./context/LanguageContext.jsx";
import { NotificationsProvider } from "./context/NotificationsContext.jsx";
import { ChatProvider } from "./context/ChatContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <LanguageProvider>
          <ThemeProvider>
            <NotificationsProvider>
              <ChatProvider>
                <App />
              </ChatProvider>
            </NotificationsProvider>
          </ThemeProvider>
        </LanguageProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
