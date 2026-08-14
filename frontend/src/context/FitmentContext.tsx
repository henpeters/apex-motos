import React, { createContext, useContext, useState } from 'react';
import { FitmentFilter } from '../types';

interface FitmentContextType {
  fitment: FitmentFilter;
  setFitment: (fitment: FitmentFilter) => void;
  clearFitment: () => void;
  isVehicleSelected: boolean;
}

const FitmentContext = createContext<FitmentContextType | undefined>(undefined);

export const FitmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fitment, setFitmentState] = useState<FitmentFilter>(() => {
    try {
      const saved = localStorage.getItem('apex_fitment');
      return saved ? JSON.parse(saved) : { make: '', model: '', year: '' };
    } catch {
      return { make: '', model: '', year: '' };
    }
  });

  const setFitment = (newFitment: FitmentFilter) => {
    setFitmentState(newFitment);
    localStorage.setItem('apex_fitment', JSON.stringify(newFitment));
  };

  const clearFitment = () => {
    const empty = { make: '', model: '', year: '' };
    setFitmentState(empty);
    localStorage.removeItem('apex_fitment');
  };

  const isVehicleSelected = Boolean(fitment.make && fitment.model && fitment.year);

  return (
    <FitmentContext.Provider value={{ fitment, setFitment, clearFitment, isVehicleSelected }}>
      {children}
    </FitmentContext.Provider>
  );
};

export const useFitment = () => {
  const context = useContext(FitmentContext);
  if (!context) {
    throw new Error('useFitment must be used within a FitmentProvider');
  }
  return context;
};
