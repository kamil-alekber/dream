import { useContext, useEffect, useRef } from 'react';
import { BreadcrumbContext } from './BreadcrumbProvider';

interface P {
  title: string;
  href?: string;
  as?: string;
}

export function Breadcrumb({ as, title, href }: P) {
  const { breadcrumbEmitter } = useContext(BreadcrumbContext);
  const ref = useRef();

  useEffect(() => {
    breadcrumbEmitter?.addBreadcrumb({ ref, title, as, href });
    return () => {
      breadcrumbEmitter?.removeBreadcrumb(ref);
    };
  }, []);

  useEffect(() => {
    breadcrumbEmitter?.updateBreadcrumb({ ref, title, as, href });
    return () => {}; //eslint-disable-line
  }, [as, title, href]);

  return null;
}
