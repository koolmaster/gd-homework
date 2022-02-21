import "react-app-polyfill/stable";
import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { AppProviders } from "./contexts";
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

import "./index.scss";
import "@gooddata/sdk-ui-charts/styles/css/main.css";
import "@gooddata/sdk-ui-ext/styles/css/main.css";
import "@gooddata/sdk-ui-filters/styles/css/main.css";
import "@gooddata/sdk-ui-geo/styles/css/main.css";
import "@gooddata/sdk-ui-kit/styles/css/main.css";
import "@gooddata/sdk-ui-pivot/styles/css/main.css";
import "@gooddata/sdk-ui-dashboard/styles/css/main.css";

ReactDOM.render(
    <AppProviders>
        <I18nextProvider i18n={i18n}>
            <App />
        </I18nextProvider>
    </AppProviders>,
    document.getElementById("root"),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
