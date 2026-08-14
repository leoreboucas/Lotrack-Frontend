import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";

type ColorMode = "light" | "dark";

type ColorModeContextType = {
  mode: ColorMode;
  setMode: () => void;
};

const ColorModeContext = createContext<ColorModeContextType | undefined>(
  undefined,
);

const STORAGE_KEY = "lotrack-color-mode";

export const ColorModeProvider = ({ children }: PropsWithChildren) => {
  const [mode, setModeState] = useState<ColorMode>(() => {
    const storedMode = localStorage.getItem(STORAGE_KEY);

    return storedMode === "dark" ? "dark" : "light";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", mode === "dark");
    localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  const setMode = () => {
    setModeState((currentMode) =>
      currentMode === "light" ? "dark" : "light",
    );
  };

  return (
    <ColorModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ColorModeContext.Provider>
  );
};

export const useColorMode = () => {
  const context = useContext(ColorModeContext);

  if (!context) {
    throw new Error("useColorMode must be used within a ColorModeProvider");
  }

  return context;
};
