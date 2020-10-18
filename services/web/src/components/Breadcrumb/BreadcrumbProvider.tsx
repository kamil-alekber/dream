import React, { useState } from 'react';
import { BreadcrumbEmitter } from './BreadcrumbEmitter';

export type BreadcrumbContextType = {
  breadcrumbEmitter?: BreadcrumbEmitter;
};

export const BreadcrumbContext = React.createContext<BreadcrumbContextType>({});

interface P {
  children: any;
}

export function BreadcrumbProvider({ children }: P) {
  // Рендерит breadcrumb со второго раза, поэтому пришлось инициализировать в стейте.
  const [breadcrumbEmitter] = useState(new BreadcrumbEmitter());
  return (
    <BreadcrumbContext.Provider value={{ breadcrumbEmitter }}>
      {children}
    </BreadcrumbContext.Provider>
  );
}
