import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import App from './App';
import './index.css';
import {
  FirebaseApi,
  FirebaseContext,
} from "./Firebase";


const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <FirebaseContext.Provider value={new FirebaseApi()}>
        <App />
      </FirebaseContext.Provider>
    </Provider>
  </React.StrictMode>
);
