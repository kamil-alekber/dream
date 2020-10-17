import React from 'react';
import { MainLayout } from '../components/Layout';
import '../styles/main.less';

function app({ Component, pageProps }) {
  return (
    <MainLayout>
      <Component {...pageProps} />
    </MainLayout>
  );
}

export default app;
