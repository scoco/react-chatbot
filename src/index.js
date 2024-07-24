import React from 'react';
import { createRoot } from 'react-dom/client';

import { Provider } from 'react-redux';
import store from './redux/store';

import './index.scss';

// Routes
import RoutesConfig from './routes';

const App = createRoot(document.getElementById('app'));

App.render(
  <Provider store={store}>
    <RoutesConfig />
  </Provider>
);
