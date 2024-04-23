import useWebContainer from '@/hooks/useWebContainer';
import React, { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

const ConsoleTab = () => {
  const terminalRef = useRef<HTMLDivElement>(null);

  const fitAddonRef = useRef<FitAddon | null>(null);
  const terminal = useRef<Terminal | null>(null);

  const webcontainerInstance = useWebContainer();
  console.log('webcontainerInstance: ', webcontainerInstance);

  useLayoutEffect(() => {
    if (fitAddonRef.current) {
      fitAddonRef.current.fit();
    }
  });

  useEffect(() => {
    if (terminalRef.current && !terminal.current) {
      const term = new Terminal({
        convertEol: true,
      });
      const fitAddon = new FitAddon();
      fitAddonRef.current = fitAddon;
      term.loadAddon(fitAddon);

      term.open(terminalRef.current);
      fitAddon.fit();

      console.log('fitAddon: ', fitAddon);

      console.log('term: ', term);
      terminal.current = term;
    }
  }, []);

  const asd = useCallback(async () => {
    if (!webcontainerInstance || !terminal.current) return;

    console.log('creating shell');
    const shellProcess = await webcontainerInstance.spawn('jsh');

    shellProcess.output.pipeTo(
      new WritableStream({
        write(data) {
          terminal.current?.write(data);
        },
      })
    );

    const input = shellProcess.input.getWriter();
    terminal.current.onData((data) => {
      input.write(data);
    });
  }, [webcontainerInstance]);

  useEffect(() => {
    asd();
  }, [asd]);

  return (
    <div
      ref={terminalRef}
      className='h-full max-h-full min-h-full overflow-hidden'
    ></div>
  );
};

export default ConsoleTab;
