import React, { createContext, useContext } from 'react';

interface NavigationContextType {
  onNavigateToEditor?: () => void;
}

const NavigationContext = createContext<NavigationContextType>({});

export const NavigationProvider: React.FC<{
  children: React.ReactNode;
  onNavigateToEditor?: () => void;
}> = ({ children, onNavigateToEditor }) => {
  return (
    <NavigationContext.Provider value={{ onNavigateToEditor }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  return useContext(NavigationContext);
};

