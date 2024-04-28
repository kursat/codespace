import { WebContainerContext } from '@/contexts/WebContainerContext';
import React, { useContext, useRef } from 'react';

const CodeTab = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const { setIframe } = useContext(WebContainerContext);

  return <iframe ref={iframeRef} className='h-full w-full'></iframe>;
};

export default CodeTab;
