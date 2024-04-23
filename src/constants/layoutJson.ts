import { PanelTypes } from '@/constants/panelTypes';
import { IJsonModel } from 'flexlayout-react';

export const layoutJson: IJsonModel = {
  global: {
    splitterSize: 4,
  },
  borders: [
    {
      type: 'border',
      location: 'bottom',
      selected: 0,
      children: [
        {
          type: 'tab',
          name: 'Console',
          component: PanelTypes.CONSOLE,
          enableClose: false,
          id: 'console',
        },
      ],
    },
    {
      type: 'border',
      location: 'left',
      show: true,
      selected: 0,
      children: [
        {
          type: 'tab',
          name: 'File Explorer',
          component: 'FileExplorer',
          enableClose: false,
          id: 'file-explorer',
        },
      ],
    },
  ],
  layout: {
    type: 'row',
    weight: 100,
    children: [
      {
        type: 'tabset',
        weight: 60,
        children: [
          {
            type: 'tab',
            name: 'index.js',
            component: PanelTypes.CODE_TAB,
            id: 'code-tab_index.js',
          },
        ],
      },
      {
        type: 'tabset',
        weight: 40,

        children: [
          {
            type: 'tab',
            enableClose: false,
            name: 'Preview',
            component: PanelTypes.PREVIEW_TAB,
            id: 'preview-tab',
          },
        ],
      },
    ],
  },
};
