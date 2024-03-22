'use client';

import { useCallback, useEffect, useRef} from "react";
import useWebContainer from "@/hooks/useWebContainer";


export default function Home() {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const webcontainerInstance = useWebContainer();

    console.log('webcontainerInstance: ', webcontainerInstance);

    const npmInstall = useCallback(async () => {
        if (!webcontainerInstance)  return;

        const installProcess = await webcontainerInstance?.spawn('npm', ['install']);

        installProcess.output.pipeTo(new WritableStream({
            write(data) {
                console.log(data);
            }
        }));

        return installProcess.exit;

    }, [webcontainerInstance]);

    const mountFiles = useCallback(async () => {
        if (webcontainerInstance) {
            // const snapshot = await getTutorial1();

            const snapshotResponse = await  fetch('/api/code');
            const snapshot = await snapshotResponse.arrayBuffer();

            await webcontainerInstance.mount(snapshot);

            if (textareaRef.current)
                textareaRef.current.value = await webcontainerInstance.fs.readFile('src/main.tsx', 'utf-8');
        }
    }, [webcontainerInstance]);

    const npmStart = useCallback(async () => {
        if (!webcontainerInstance) return;

        const startProcess = await webcontainerInstance?.spawn('npm', ['run', 'dev']);

        startProcess.output.pipeTo(new WritableStream({
            write(data) {
                console.log(data);
            }
        }));
    }, [webcontainerInstance]);

    const startBrowser = useCallback(async () => {
        if (webcontainerInstance) {
            console.log('?????')
            webcontainerInstance.on('server-ready', (port, url) => {
                if (iframeRef.current)
                    iframeRef.current.src = url;
            });
        }
    }, [webcontainerInstance]);


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
        }

        if (webcontainerInstance) {
            run();
        }
    }, [mountFiles, npmInstall, npmStart, startBrowser, webcontainerInstance]);

    return (
        <main className="flex min-h-screen items-stretch justify-stretch">
      <textarea
          ref={textareaRef}
          className='p-2 flex-1 bg-sky-950 text-white'
          onChange={e => webcontainerInstance?.fs.writeFile('/src/main.tsx', e.target.value)}
          defaultValue={'Loading...'}
      />
            <iframe ref={iframeRef} className='border-2 flex-1'>
                Loading...
            </iframe>
        </main>
    );
}
