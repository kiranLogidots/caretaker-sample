import React, { createContext, useContext, useState, ReactNode } from 'react';

const ActiveMenuContext = createContext({
  activeMenuName: '',
  setActiveMenuName: (name: string) => {},
});

export const useActiveMenu = () => useContext(ActiveMenuContext);

interface ActiveMenuProviderProps {
  children: ReactNode;
}

export const ActiveMenuProvider: React.FC<ActiveMenuProviderProps> = ({ children }) => {
  const [activeMenuName, setActiveMenuName] = useState('');
  {console.log('activeMenuName', activeMenuName);}

  return (
    <ActiveMenuContext.Provider value={{ activeMenuName, setActiveMenuName }}>
      {children}
    </ActiveMenuContext.Provider>
  );
};