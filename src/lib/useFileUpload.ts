import { useState, useCallback, useEffect } from 'react';
import { useFileUploadHook } from './types';

/**
 * @function formatBytes
 */
const formatBytes = (bytes: number, decimals = 2): string => {
  if (typeof bytes !== 'number') return 'n/a';
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * @function getTotalSizeInBytes
 */
const getTotalSizeInBytes = (files: File[]): number => {
  return files.reduce((acc, file: File) => (acc += file.size), 0);
};

/**
 * @function handleDragDropEvent
 */
const handleDragDropEvent = (e: React.DragEvent<HTMLElement>) => {
  e.stopPropagation();
  e.preventDefault();
};

/**
 * @ReactHook
 */
export const useFileUpload = (): useFileUploadHook => {
  const [files, setFilesState] = useState<File[]>([]);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [fileTypes, setFileTypes] = useState<string[]>([]);
  const [totalSize, setTotalSize] = useState('');
  const [totalSizeInBytes, setTotalSizeInBytes] = useState(0);

  useEffect(() => {
    setFileNames(files.map((file) => file.name));
    setFileTypes(files.map((file) => file.type));
    handleSizes(files);
  }, [files]);

  /** @function setFiles */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setFiles = useCallback(
    (e: any, mode = 'w'): void => {
      let filesArr: File[] = [];

      if (e.currentTarget?.files) {
        filesArr = Array.from(e.currentTarget.files);
        e.currentTarget.value = '';
      } else if (e?.dataTransfer.files) {
        filesArr = Array.from(e.dataTransfer.files);
      } else {
        console.error('Argument not recognized. Are you sure your passing setFiles an event object?');
      }

      if (mode === 'w') {
        setFilesState(filesArr);
      } else if (mode === 'a') {
        setFilesState([...files, ...filesArr]);
      }
    },
    [files],
  );

  /** @function handleSizes */
  const handleSizes = useCallback((files: File[]): void => {
    const sizeInBytes = getTotalSizeInBytes(files);
    const prettySize = formatBytes(sizeInBytes);
    setTotalSizeInBytes(sizeInBytes);
    setTotalSize(prettySize);
  }, []);

  /** @function removeFile */
  const removeFile = useCallback(
    (file: number | string): void => {
      if (typeof file !== 'number' && typeof file !== 'string') {
        console.error('argument supplied to removeFile must be of type number or string.');
        return;
      }

      if (typeof file === 'string') {
        setFilesState(files.filter((_file: File) => _file.name !== file));
      } else {
        setFilesState(files.filter((_file: File, i) => i !== file));
      }
    },
    [files],
  );

  /** @function clearAllFiles */
  const clearAllFiles = useCallback((): void => {
    setFilesState([]);
  }, []);

  /** @function createFormData */
  const createFormData = useCallback((): FormData => {
    const formData = new FormData();

    for (const file of files) {
      formData.append(file.name, file);
    }

    return formData;
  }, [files]);

  return {
    files,
    fileNames,
    fileTypes,
    totalSize,
    totalSizeInBytes,
    clearAllFiles,
    createFormData,
    handleDragDropEvent,
    removeFile,
    setFiles,
  };
};
