'use client';

import {Layout, Model} from 'flexlayout-react';
import PanelFactory from "@/components/layout/PanelFactory";
import {layoutJson} from "@/constants/layoutJson";


const model = Model.fromJson(layoutJson);

export default function Home() {

    return (
        <Layout
            model={model}
            factory={PanelFactory}
        />
    );
}
