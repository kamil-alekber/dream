import React, { useContext, useEffect, useState } from 'react';
import { BreadcrumbContext } from './BreadcrumbProvider';
import Link from 'next/link';
import './BreadcrumbPanel.less';
interface P {
  separator?: React.ReactNode;
  enableLastLink?: boolean;
}

export function BreadcrumbPanel({ separator, enableLastLink }: P) {
  const { breadcrumbEmitter } = useContext(BreadcrumbContext);
  const [breadcrumbs, setBreadcrumbs] = useState(breadcrumbEmitter?.breadcrumbs);

  useEffect(() => {
    return breadcrumbEmitter?.onChange((b) => {
      setBreadcrumbs(b);
    });
  }, []); //eslint-disable-line

  const list = breadcrumbs?.map(({ href, title, as }, index) => {
    const renderSeparator = breadcrumbs.length - 1 !== index;
    const text =
      href && (breadcrumbs.length - 1 !== index || enableLastLink) ? (
        <Link href={href} as={as || href}>
          <a className="breadcrumb-link">{title}</a>
        </Link>
      ) : (
        <span>{title}</span>
      );

    return (
      <span className="breadcrumb" key={index}>
        <span className="breadcrumb__item">{text}</span>
        {renderSeparator && <span className="breadcrumb-separator">{separator || '/'}</span>}
      </span>
    );
  });

  return <div id="breadcrumb-panel">{list}</div>;
}
