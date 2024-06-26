'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

// Create the context
interface CopyContextType {
  isCopy: boolean;
  setIsCopy: (value: boolean) => void;
}

const CopyContext = createContext<CopyContextType | undefined>(undefined);

// Create a provider component
export const CopyProvider = ({ children }: { children: ReactNode }) => {
  const [isCopy, setIsCopy] = useState(false);

  return (
    <CopyContext.Provider value={{ isCopy, setIsCopy }}>
      {children}
    </CopyContext.Provider>
  );
};

// Create a custom hook to use the CopyContext
export const useCopy = () => {
  const context = useContext(CopyContext);
  if (context === undefined) {
    throw new Error('useCopy must be used within a CopyProvider');
  }
  return context;
};
