import { createContext, useContext, useState } from "react";

const ImageContext = createContext();

export function ImageProvider({ children }) {
  const [generatedImages, setGeneratedImages] = useState([]);

  return (
    <ImageContext.Provider value={{ generatedImages, setGeneratedImages }}>
      {children}
    </ImageContext.Provider>
  );
}

export function useImageContext() {
  return useContext(ImageContext);
}
