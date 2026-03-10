import React              from 'react';
import ReactDOM           from 'react-dom/client';
import { BrowserRouter }  from 'react-router-dom';

import { store }    from './store/store';
import { Provider } from 'react-redux';

import { JournalApp }   from './JournalApp';
import reportWebVitals   from './reportWebVitals';
import './styles.css';

// Configurar interceptores de Axios con el store de Redux
import { setupAxiosInterceptors } from './api/axiosInstance';
import { logout }    from './store/authStore/authStore';
import { showAlert } from './store/globalStore/globalStore';
setupAxiosInterceptors(store, { logout, showAlert });

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>

      <Provider store={store}>
        <JournalApp />
      </Provider>

    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
