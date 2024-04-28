import { WebContainer } from '@webcontainer/api';
import React, {
  MutableRefObject,
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Terminal } from 'xterm';

interface IWebContainerContext {
  initiated: MutableRefObject<boolean>;
  iframe: HTMLIFrameElement | undefined;
  terminal: Terminal | undefined;
  setIframe: React.Dispatch<
    React.SetStateAction<HTMLIFrameElement | undefined>
  >;
  setTerminal: React.Dispatch<React.SetStateAction<Terminal | undefined>>;
}

export const WebContainerContext = createContext<IWebContainerContext>({
  initiated: {
    current: false,
  },
  iframe: undefined,
  terminal: undefined,
  setIframe: () => {},
  setTerminal: () => {},
});

interface IWebContainerContextProviderProps {
  children: React.ReactNode;
}

export const WebContainerContextProvider = ({
  children,
}: IWebContainerContextProviderProps) => {
  const initiated = useRef(false);

  const [iframe, setIframe] = useState<HTMLIFrameElement>();
  const [terminal, setTerminal] = useState<Terminal>();
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
  }, []);

  const initiateShell = useCallback(
    async (terminal: Terminal) => {
      if (!webContainerInstance || !terminal) return;

      const shellProcess = await webContainerInstance.spawn('jsh');

      shellProcess.output.pipeTo(
        new WritableStream({
          write(data) {
            terminal?.write(data);
          },
        })
      );

      const input = shellProcess.input.getWriter();
      terminal.onData((data) => {
        input.write(data);
      });
    },
    [webContainerInstance]
  );

  const mountFiles = useCallback(async () => {
    if (webContainerInstance) {
      // const snapshot = await getTutorial1();

      const snapshotResponse = await fetch('/api/code');
      const snapshot = await snapshotResponse.arrayBuffer();

      await webContainerInstance.mount(snapshot);

      // if (textareaRef.current)
      //   textareaRef.current.value = await webContainerInstance.fs.readFile(
      //     'src/main.tsx',
      //     'utf-8'
      //   );
    }
  }, [webContainerInstance]);

  const npmInstall = useCallback(async () => {
    if (!webContainerInstance) return;

    const installProcess = await webContainerInstance?.spawn('npm', [
      'install',
    ]);

    installProcess.output.pipeTo(
      new WritableStream({
        write(data) {
          terminal!.write(data);
        },
      })
    );

    return installProcess.exit;
  }, [terminal, webContainerInstance]);

  const npmStart = useCallback(async () => {
    if (!webContainerInstance) return;

    const startProcess = await webContainerInstance?.spawn('npm', [
      'run',
      'dev',
    ]);

    startProcess.output.pipeTo(
      new WritableStream({
        write(data) {
          terminal!.write(data);
        },
      })
    );
  }, [terminal, webContainerInstance]);

  const startBrowser = useCallback(async () => {
    if (webContainerInstance) {
      webContainerInstance.on('server-ready', (port, url) => {
        if (iframe) iframe.src = url;
      });
    }
  }, [iframe, webContainerInstance]);

  useEffect(() => {
    if (webContainerInstance && terminal && iframe) {
      initiateShell(terminal).then(() => {
        mountFiles().then(() => {
          npmInstall().then(() => {
            npmStart().then(() => {
              startBrowser();
            });
          });
        });
      });
    }
  }, [
    iframe,
    initiateShell,
    mountFiles,
    npmInstall,
    npmStart,
    startBrowser,
    terminal,
    webContainerInstance,
  ]);

  return (
    <WebContainerContext.Provider
      value={{
        initiated,
        iframe,
        terminal,
        setIframe,
        setTerminal,
      }}
    >
      {children}
    </WebContainerContext.Provider>
  );
};
