'use client';

import useWebContainer from '@/hooks/useWebContainer';
import { useCallback, useEffect, useRef } from 'react';

export default function Home() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const webContainerInstance = useWebContainer();

  const npmInstall = useCallback(async () => {
    if (!webContainerInstance) return;

    const installProcess = await webContainerInstance?.spawn('npm', [
      'install',
    ]);

    installProcess.output.pipeTo(
      new WritableStream({
        write(data) {
          console.log(data);
        },
      })
    );

    return installProcess.exit;
  }, [webContainerInstance]);

  const mountFiles = useCallback(async () => {
    if (webContainerInstance) {
      // const snapshot = await getTutorial1();

      const snapshotResponse = await fetch('/api/code');
      const snapshot = await snapshotResponse.arrayBuffer();

      await webContainerInstance.mount(snapshot);

      if (textareaRef.current)
        textareaRef.current.value = await webContainerInstance.fs.readFile(
          'src/main.tsx',
          'utf-8'
        );
    }
  }, [webContainerInstance]);

  const npmStart = useCallback(async () => {
    if (!webContainerInstance) return;

    const startProcess = await webContainerInstance?.spawn('npm', [
      'run',
      'dev',
    ]);

    startProcess.output.pipeTo(
      new WritableStream({
        write(data) {
          console.log(data);
        },
      })
    );
  }, [webContainerInstance]);

  const startBrowser = useCallback(async () => {
    if (webContainerInstance) {
      console.log('?????');
      webContainerInstance.on('server-ready', (port, url) => {
        if (iframeRef.current) iframeRef.current.src = url;
      });
    }
  }, [webContainerInstance]);

  useEffect(() => {
    const run = async () => {
      console.log('mounting files');
      await mountFiles();
      console.log('npm install');
      await npmInstall();
      console.log('npm start');
      await npmStart();
      console.log('start browser');
      await startBrowser();
    };

    if (webContainerInstance) {
      run();
    }
  }, [mountFiles, npmInstall, npmStart, startBrowser, webContainerInstance]);

  return (
    <main className='flex min-h-screen items-stretch justify-stretch'>
      <textarea
        ref={textareaRef}
        className='flex-1 bg-sky-950 p-2 text-white'
        onChange={(e) =>
          webContainerInstance?.fs.writeFile('/src/main.tsx', e.target.value)
        }
        defaultValue={'Loading...'}
      />
      <iframe ref={iframeRef} className='flex-1 border-2'>
        Loading...
      </iframe>
    </main>
  );
}
