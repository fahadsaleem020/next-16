import { createContext, type FC, type PropsWithChildren, useCallback, useContext, useEffect, useRef, useState } from "react";
import { type DropzoneOptions, type DropzoneState, useDropzone } from "react-dropzone";

const useGlobalDropzone = () => {
  const context = useContext(DropzoneContext);
  if (!context) {
    throw new Error("useDropzone must be used within the DropzoneProvider");
  }
  return context;
};

export type DropZoneContextType = DropzoneState & {
  dragOverParentRef: React.RefObject<HTMLDivElement | null>;
  isVisible: boolean;
  show: () => void;
  hide: () => void;
};
const DropzoneContext = createContext<DropZoneContextType>({} as any);

interface DropzoneProviderProps extends PropsWithChildren {
  dropzoneOptions?: DropzoneOptions;
}

const DropzoneProvider: FC<DropzoneProviderProps> = ({ dropzoneOptions, children }) => {
  const hide = useCallback(() => setIsVisible(false), []);
  const show = useCallback(() => setIsVisible(true), []);
  const dragOverParentRef = useRef<HTMLDivElement>(null);
  const dropzoneStates = useDropzone(dropzoneOptions);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!dropzoneStates.isDragActive) {
      hide();
    }
  }, [dropzoneStates.isDragActive, hide]);

  useEffect(() => {
    if (dragOverParentRef.current) {
      dragOverParentRef.current.ondragover = () => show();
    }
  }, [show]);

  return (
    <DropzoneContext.Provider value={{ ...dropzoneStates, show, hide, isVisible, dragOverParentRef }}>{children}</DropzoneContext.Provider>
  );
};

export { DropzoneProvider, useGlobalDropzone };
