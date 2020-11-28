import '../styles/main.less';
import React from 'react';
import { BasicLayout } from '../components/BasicLayout';
import { BreadcrumbProvider } from '../components/Breadcrumb/BreadcrumbProvider';

function app({ Component, pageProps }) {
  return (
    <BreadcrumbProvider>
      <BasicLayout>
        <Component {...pageProps} />
      </BasicLayout>
    </BreadcrumbProvider>
  );
}

export default app;
