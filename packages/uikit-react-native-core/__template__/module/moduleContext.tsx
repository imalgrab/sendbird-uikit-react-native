// @ts-nocheck - !!REMOVE
import React, { createContext } from 'react';

import ProviderLayout from '../../../components/ProviderLayout';
import type { __domain__ContextType } from '../types';

export const __domain__Context: __domain__ContextType = {
  Fragment: createContext({
    headerTitle: '',
  }),
};

export const __domain__ContextProvider: React.FC = ({ children }) => {
  // const [visible, setVisible] = useState(false);

  return (
    <ProviderLayout>
      <__domain__Context.Fragment.Provider value={{ headerTitle: 'STRINGS.DOMAIN.HEADER_TITLE' }}>
        {children}
      </__domain__Context.Fragment.Provider>
    </ProviderLayout>
  );
};
