import React, { createContext, useContext } from 'react';
import { logger } from '../utils/logger';

interface NavigationContextType {
  onNavigateToEditor?: () => void;
  onAddComponent?: (componentType: string, props?: any) => void;
}

const NavigationContext = createContext<NavigationContextType>({});

export const NavigationProvider: React.FC<{
  children: React.ReactNode;
  onNavigateToEditor?: () => void;
  onAddComponent?: (componentType: string, props?: any) => void;
}> = ({ children, onNavigateToEditor, onAddComponent }) => {
  // Debug: Log what functions are being passed to the provider
  React.useEffect(() => {
    logger.debug('🌐 NavigationProvider mounted with:');
    logger.debug('  - onNavigateToEditor:', typeof onNavigateToEditor);
    logger.debug('  - onAddComponent:', typeof onAddComponent);
  }, [onNavigateToEditor, onAddComponent]);

  return (
    <NavigationContext.Provider value={{ onNavigateToEditor, onAddComponent }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  return useContext(NavigationContext);
};

