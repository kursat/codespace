'use client';

import { layoutJson } from '@/constants/layoutJson';
import { WebContainerContextProvider } from '@/contexts/WebContainerContext';
import { Layout, Model } from 'flexlayout-react';

import PanelFactory from '@/components/layout/PanelFactory';

const model = Model.fromJson(layoutJson);

export default function Home() {
  return (
    <WebContainerContextProvider>
      <Layout model={model} factory={PanelFactory} />
    </WebContainerContextProvider>
  );
}
