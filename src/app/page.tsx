'use client';

import { WebContainer } from '@webcontainer/api';
import {Ref, useEffect, useRef, useState} from "react";
import {files} from "@/files";
import {getTutorial1} from "@/projects";


export default function Home() {
    const initiated = useRef<boolean>(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);


    const [webcontainerInstance, setWebcontainerInstance] = useState<WebContainer>();

    useEffect(() => {
        const init = async () => {

            const webcontainerInstance = await WebContainer.boot();

            setWebcontainerInstance(webcontainerInstance);

            // const snapshot = await getTutorial1();

            webcontainerInstance.mount(files);


            if (textareaRef.current)
            textareaRef.current.value = files['index.js'].file.contents;

            webcontainerInstance.spawn('npm', ['install']);


            const installProcess = await webcontainerInstance?.spawn('npm', ['install']);


            installProcess.output.pipeTo(new WritableStream({
                write(data) {
                    console.log(data);
                }
            }));

            console.log('installProcess.exit: ', await installProcess.exit);


            const startProcess = await webcontainerInstance.spawn('npm', ['run', 'start']);

            startProcess.output.pipeTo(new WritableStream({
                write(data) {
                    console.log(data);
                }
            }));

            // Wait for `server-ready` event
            webcontainerInstance.on('server-ready', (port, url) => {
                if (iframeRef.current)
                iframeRef.current.src = url;
            });

        }

        if (!initiated.current) {
            initiated.current = true;

            init();
        }
    }, []);

  return (
    <main className="flex min-h-screen items-stretch justify-stretch">
      <textarea
          ref={textareaRef}
          className='p-2 flex-1 bg-sky-950 text-white'
          onChange={e => webcontainerInstance?.fs.writeFile('/index.js', e.target.value)}
          defaultValue={'Loading...'}
      />
      <iframe ref={iframeRef} src="loading.html" className='border-2 flex-1'></iframe>
    </main>
  );
}
