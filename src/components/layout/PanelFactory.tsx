import { PanelTypes } from '@/constants/panelTypes';
import { TabNode } from 'flexlayout-react';
import React, { Suspense, lazy } from 'react';
import CodeTab from "@/components/tabs/CodeTab";

const PreviewTab = lazy(
  () => import('../tabs/PreviewTab' /* webpackChunkName: "ApplicationsPanel" */)
);
const ConsoleTab = lazy(
  () => import('../tabs/ConsoleTab' /* webpackChunkName: "ApplicationsPanel" */)
);

const renderLoader = () => <div className={'center-flex'}>Loading...</div>;

const PanelFactory = (node: TabNode) => {
  const panelType = node.getComponent();

  let component = (
    <pre>
      {panelType}: {JSON.stringify(node.getConfig(), null, 2)}
    </pre>
  );

  switch (panelType) {
    case PanelTypes.PREVIEW_TAB:
      component = <PreviewTab />;
      break;
    case PanelTypes.CONSOLE:
      component = <ConsoleTab />;
      break;
    case PanelTypes.CODE_TAB:
      component = <CodeTab />;
      break;
    default:
      break;
  }

  return <Suspense fallback={renderLoader()}>{component}</Suspense>;
};

export default PanelFactory;
