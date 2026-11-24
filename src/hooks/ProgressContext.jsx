import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { loadState, progressReducer, saveState } from '../lib/progress';
import { todayKey } from '../lib/utils';
import { emptyDay } from '../lib/srs';

const ProgressContext = createContext(null);

export function ProgressProvider({ children }) {
  const [state, dispatch] = useReducer(progressReducer, undefined, loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export const useProgress = () => useContext(ProgressContext);
export const useToday = () => useProgress().state.days[todayKey()] || emptyDay();
