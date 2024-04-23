import { WebContainer } from '@webcontainer/api';
import { useEffect, useRef, useState } from 'react';

const useWebContainer = () => {
  const initiated = useRef<boolean>(false);
  const [webContainerInstance, setWebContainerInstance] =
    useState<WebContainer>();

  useEffect(() => {
    const init = async () => {
      const webContainerInstance = await WebContainer.boot();
      setWebContainerInstance(webContainerInstance);
    };

    if (!initiated.current) {
      initiated.current = true;
      init();
    }
  }, [webContainerInstance]);

  return webContainerInstance;
};

export default useWebContainer;
