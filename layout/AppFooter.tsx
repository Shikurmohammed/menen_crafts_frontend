/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import { LayoutContext } from './context/layoutcontext';

const AppFooter = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const currentYear = new Date().getFullYear();
    return (
        <div className="layout-footer">
            {/* <img src={`/layout/images/logo-${layoutConfig.colorScheme === 'light' ? 'dark' : 'white'}.svg`} alt="Logo" height="20" className="mr-2" />
            by */}
            © {currentYear} by
            <span className="font-medium ml-2">Dawud Mohammed</span>
        </div>
    );
};

export default AppFooter;
