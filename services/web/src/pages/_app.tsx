import React from 'react';
import { BreadcrumbProvider } from '../components/Breadcrumb/BreadcrumbProvider';
import { MainLayout } from '../components/Layout';
import '../styles/main.less';

function app({ Component, pageProps }) {
  return (
    <BreadcrumbProvider>
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </BreadcrumbProvider>
  );
}

export default app;
