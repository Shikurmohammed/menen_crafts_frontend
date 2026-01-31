<<<<<<< HEAD
/* eslint-disable @next/next/no-img-element */

=======
>>>>>>> 5087a95384600db6bb4ed335f320667c367fa917
import React, { useContext } from 'react';
import { LayoutContext } from './context/layoutcontext';

const AppFooter = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const currentYear = new Date().getFullYear();
    return (
        <div className="layout-footer">
<<<<<<< HEAD
            {/* <img src={`/layout/images/logo-${layoutConfig.colorScheme === 'light' ? 'dark' : 'white'}.svg`} alt="Logo" height="20" className="mr-2" />
            by */}
=======
>>>>>>> 5087a95384600db6bb4ed335f320667c367fa917
            © {currentYear} by
            <span className="font-medium ml-2">Dawud Mohammed</span>
        </div>
    );
};

export default AppFooter;
