export type useFileUploadHook = {
  files: File[];
  fileNames: string[];
  fileTypes: string[];
  totalSize: string;
  totalSizeInBytes: number;
  clearAllFiles: () => void;
  createFormData: () => FormData;
  handleDragDropEvent: (e: Event) => void;
  removeFile: (file: number | string) => void;
  setFiles: (e: Event, mode?: 'a' | 'w') => void;
};
