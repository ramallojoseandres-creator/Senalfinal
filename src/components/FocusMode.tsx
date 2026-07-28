"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type FocusContextValue = {
  focus: boolean;
  setFocus: (value: boolean) => void;
};

const FocusContext = createContext<FocusContextValue>({
  focus: false,
  setFocus: () => undefined,
});

export function FocusModeProvider({ children }: { children: React.ReactNode }) {
  const [focus, setFocusState] = useState(false);
  const setFocus = useCallback((value: boolean) => {
    setFocusState(value);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.arena = focus ? "1" : "0";
    return () => {
      delete document.documentElement.dataset.arena;
    };
  }, [focus]);

  const value = useMemo(() => ({ focus, setFocus }), [focus, setFocus]);
  return (
    <FocusContext.Provider value={value}>{children}</FocusContext.Provider>
  );
}

export function useFocusMode() {
  return useContext(FocusContext);
}
