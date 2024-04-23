'use client';

import { layoutJson } from '@/constants/layoutJson';
import { Layout, Model } from 'flexlayout-react';

import PanelFactory from '@/components/layout/PanelFactory';

const model = Model.fromJson(layoutJson);

export default function Home() {
  return <Layout model={model} factory={PanelFactory} />;
}
