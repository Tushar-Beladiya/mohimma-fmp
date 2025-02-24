import React, { createContext, useState, useContext, ReactNode } from "react";

// Define the shape of the context state
interface FolderContextType {
  folderPath: string;
  setFolderPath: (path: string) => void;
}

// Create the context with default undefined (will be provided by provider)
const FolderContext = createContext<FolderContextType | undefined>(undefined);

// Provider Component Props Type
interface FolderProviderProps {
  children: ReactNode;
}

// Context Provider Component
export const FolderProvider: React.FC<FolderProviderProps> = ({ children }) => {
  const [folderPath, setFolderPath] = useState<string>("");

  return (
    <FolderContext.Provider value={{ folderPath, setFolderPath }}>
      {children}
    </FolderContext.Provider>
  );
};

// Custom hook to use the FolderContext
export const useFolder = (): FolderContextType => {
  const context = useContext(FolderContext);
  if (!context) {
    throw new Error("useFolder must be used within a FolderProvider");
  }
  return context;
};
