import { createContext, useContext, useState } from "react";

const ImageContext = createContext();

export function ImageProvider({ children }) {
  const [generatedImages, setGeneratedImages] = useState([]);
  const [generatedClass, setGeneratedClass] = useState('');

  return (
    <ImageContext.Provider value={{ generatedImages, setGeneratedImages, generatedClass, setGeneratedClass }}>
      {children}
    </ImageContext.Provider>
  );
}

export function useImageContext() {
  return useContext(ImageContext);
}
