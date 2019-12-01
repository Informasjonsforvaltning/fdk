import React from 'react';
import { Router } from 'react-router-dom';

import { AppHeader } from '../components/app-header/app-header.component';
import { Breadcrumbs } from '../components/breadcrumbs/breadcrumbs.component';
import Footer from '../components/app-footer/app-footer.component';
import { Routes } from './routes';
import { globalHistory } from '../services/global-history';

export const App = () => (
  <Router history={globalHistory}>
    <div className="d-flex flex-column site theme-fdk">
      <AppHeader />
      <Breadcrumbs />
      <div className="site-content d-flex flex-column pt-5">
        <Routes />
      </div>
      <Footer />
    </div>
  </Router>
);
