import '../styles/main.less';
import React from 'react';
import { BreadcrumbProvider } from '../components/Breadcrumb/BreadcrumbProvider';

function app({ Component, pageProps }) {
  return (
    <BreadcrumbProvider>
      <Component {...pageProps} />
    </BreadcrumbProvider>
  );
}

export default app;
