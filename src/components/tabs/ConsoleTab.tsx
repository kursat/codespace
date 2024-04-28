import { WebContainerContext } from '@/contexts/WebContainerContext';
import React, { useContext, useEffect, useLayoutEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

const ConsoleTab = () => {
  const terminalRef = useRef<HTMLDivElement>(null);

  const fitAddonRef = useRef<FitAddon | null>(null);
  const terminal = useRef<Terminal | null>(null);

  const { setTerminal } = useContext(WebContainerContext);

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

      terminal.current = term;
    }
  }, []);

  useEffect(() => {
    if (terminal.current) setTerminal(terminal.current);
  }, [setTerminal]);

  return (
    <div
      ref={terminalRef}
      className='h-full max-h-full min-h-full overflow-hidden'
    ></div>
  );
};

export default ConsoleTab;
