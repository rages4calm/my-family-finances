import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import toast from 'react-hot-toast';

interface SaveStatus {
  isSaving: boolean;
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
}

interface SaveStatusContextType {
  saveStatus: SaveStatus;
  setSaving: (saving: boolean) => void;
  markSaved: (showToast?: boolean) => void;
  markUnsaved: () => void;
  autoSave: (saveFunction: () => Promise<void>, description?: string) => Promise<void>;
}

const SaveStatusContext = createContext<SaveStatusContextType | undefined>(undefined);

export const useSaveStatus = () => {
  const context = useContext(SaveStatusContext);
  if (!context) {
    throw new Error('useSaveStatus must be used within a SaveStatusProvider');
  }
  return context;
};

interface SaveStatusProviderProps {
  children: ReactNode;
}

export const SaveStatusProvider: React.FC<SaveStatusProviderProps> = ({ children }) => {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>({
    isSaving: false,
    lastSaved: null,
    hasUnsavedChanges: false
  });

  const setSaving = useCallback((saving: boolean) => {
    setSaveStatus(prev => ({
      ...prev,
      isSaving: saving
    }));
  }, []);

  const markSaved = useCallback((showToast: boolean = true) => {
    setSaveStatus({
      isSaving: false,
      lastSaved: new Date(),
      hasUnsavedChanges: false
    });
    
    if (showToast) {
      toast.success('All changes saved automatically', {
        duration: 2000,
        icon: '💾'
      });
    }
  }, []);

  const markUnsaved = useCallback(() => {
    setSaveStatus(prev => ({
      ...prev,
      hasUnsavedChanges: true
    }));
  }, []);

  const autoSave = useCallback(async (saveFunction: () => Promise<void>, description?: string) => {
    try {
      setSaving(true);
      await saveFunction();
      markSaved(true);
    } catch (error) {
      console.error('Auto-save failed:', error);
      toast.error(`Failed to save ${description || 'changes'}. Please try again.`);
      setSaving(false);
    }
  }, [setSaving, markSaved]);

  const contextValue = {
    saveStatus,
    setSaving,
    markSaved,
    markUnsaved,
    autoSave
  };

  return (
    <SaveStatusContext.Provider value={contextValue}>
      {children}
    </SaveStatusContext.Provider>
  );
};