import { WebContainerContext } from '@/contexts/WebContainerContext';
import React, { useContext, useEffect, useRef } from 'react';

const PreviewTab = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const { setIframe } = useContext(WebContainerContext);

  useEffect(() => {
    if (iframeRef.current) {
      setIframe(iframeRef.current);
    }
  }, [setIframe]);

  return <iframe ref={iframeRef} className='h-full w-full'></iframe>;
};

export default PreviewTab;
