'use client';

import Link from 'next/link';
import React, {
    forwardRef,
    useContext,
    useImperativeHandle,
    useRef
} from 'react';
import { classNames } from 'primereact/utils';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { LayoutContext } from './context/layoutcontext';
import { AppTopbarRef } from '@/types';
import { logout } from '@/utils/auth';

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
    const {
        layoutConfig,
        layoutState,
        onMenuToggle,
        showProfileSidebar
    } = useContext(LayoutContext);

    /* REQUIRED REFS — DO NOT REMOVE */
    const menubuttonRef = useRef<HTMLButtonElement>(null);
    const topbarmenuRef = useRef<HTMLDivElement>(null);
    const topbarmenubuttonRef = useRef<HTMLButtonElement>(null);

    /* REQUIRED IMPERATIVE HANDLE — DO NOT CHANGE KEYS */
    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current
    }));

    return (
        <div className="layout-topbar">
            {/* LOGO */}
            <Link href="/" className="layout-topbar-logo">
                <img
                    src={`/layout/images/logo-${layoutConfig.colorScheme !== 'light' ? 'white' : 'dark'}.jpeg`}
                    className="rounded-full"
                    width={36}
                    height={36}
                    alt="logo"
                />
                <span>Menen Crafts</span>
            </Link>

            {/* MAIN MENU TOGGLE */}
            <button
                ref={menubuttonRef}
                type="button"
                className="p-link layout-menu-button layout-topbar-button"
                onClick={onMenuToggle}
                aria-label="Toggle Menu"
            >
                <i className="pi pi-bars" />
            </button>

            {/* DESKTOP ACTIONS */}
            {/* <div className="layout-topbar-actions hidden md:flex gap-2">
                <button className="p-link layout-topbar-button" aria-label="Notifications">
                    <i className="pi pi-bell" />
                </button>

                <button
                    className="p-link layout-topbar-button"
                    aria-label="Profile"
                    onClick={showProfileSidebar}
                >
                    <i className="pi pi-user" />
                </button>
            </div> */}

            {/* MOBILE PROFILE MENU BUTTON */}
            <button
                ref={topbarmenubuttonRef}
                type="button"
                className="p-link layout-topbar-menu-button layout-topbar-button"
                onClick={showProfileSidebar}
                aria-label="More"
            >
                <i className="pi pi-ellipsis-v" />
            </button>

            {/* MOBILE TOPBAR MENU */}
            <div
                ref={topbarmenuRef}
                className={classNames('layout-topbar-menu', {
                    'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible
                })}
            >
                <button className="p-link layout-topbar-button" aria-label="Notifications">
                    <i className="pi pi-bell" />
                </button>
                <button className="p-link layout-topbar-button">
                    <i className="pi pi-calendar" />
                    <span>Calendar</span>
                </button>

                <button
                    className="p-link layout-topbar-button"
                    onClick={showProfileSidebar}
                >
                    <i className="pi pi-user" />
                    <span>Profile</span>
                </button>
            </div>

            {/* PROFILE SIDEBAR */}
            <Dialog
                header="Profile"
                visible={layoutState.profileSidebarVisible}
                modal
                position="top-right"
                onHide={showProfileSidebar}
                className="layout-topbar-profile-sidebar mt-0"
            >
                <div className="flex flex-column align-items-center gap-3 p-4">
                    <Avatar
                        image="/layout/images/login/avatar.png"
                        size="xlarge"
                        shape="circle"
                    />

                    <div className="text-center">
                        <h4 className="m-0">John Doe</h4>
                        <small className="text-500">Administrator</small>
                    </div>

                    <div className="flex flex-column gap-2 w-full">
                        <Button
                            label="My Profile"
                            icon="pi pi-user"
                            className="w-full"
                        />

                        <Button
                            label="Settings"
                            icon="pi pi-cog"
                            outlined
                            className="w-full"
                        />

                        <Button
                            label="Logout"
                            icon="pi pi-sign-out"
                            severity="danger"
                            className="w-full"
                            onClick={logout}
                        />
                    </div>
                </div>
            </Dialog>
        </div>
    );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;
