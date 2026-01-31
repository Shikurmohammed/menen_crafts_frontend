import React, { useContext } from 'react';
import { LayoutContext } from './context/layoutcontext';

const AppFooter = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const currentYear = new Date().getFullYear();
    return (
        <div className="layout-footer">
            © {currentYear} by
            <span className="font-medium ml-2">Dawud Mohammed</span>
        </div>
    );
};

export default AppFooter;
