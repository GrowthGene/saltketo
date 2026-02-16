import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Analysis from './pages/Analysis';
import Stats from './pages/Stats';
import Profile from './pages/Profile';
import './styles/global.css';

import { DataProvider } from './context/DataContext';
import ErrorBoundary from './components/ErrorBoundary';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="analysis" element={<Analysis />} />
              <Route path="stats" element={<Stats />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
