import { Avatar, Menu, MenuItem, ShellBar } from '@ui5/webcomponents-react';
import { useState } from 'react';
import { LoginDialog } from './Dialogs';
import { logOut } from '../networkRequests/fetchRequests';
import sapLogo from '../assets/SAP_2011_logo.svg';

export default function DisplayShellBar() {
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [loginSession, setLoginSession] = useState(null);

  function displayMenu() {
    setMenuIsOpen(true);
  }

  function closeMenu() {
    setMenuIsOpen(false);
  }

  function displayDialog() {
    setDialogIsOpen(true);
  }

  function closeDialog() {
    setDialogIsOpen(false);
  }

  async function setLogOut() {
    await logOut();
    setLoginSession(null);
  }

  function handleItemClick(event) {
    const menuItemText = event.target.firstChild.text;

    if (menuItemText === 'Log in') {
      displayDialog();
    }

    if (menuItemText === 'Log out') {
      setLogOut();
    }
  }

  return (
    <>
      <ShellBar
        onProfileClick={displayMenu}
        logo={<img alt="SAP Logo" src={sapLogo} />}
        primaryTitle="Manifest Tracker"
        profile={<Avatar id={'openMenuBtn'} icon="employee"></Avatar>}
      ></ShellBar>
      <Menu opener={'openMenuBtn'} open={menuIsOpen} onItemClick={handleItemClick} onAfterClose={closeMenu}>
        {loginSession ? <MenuItem icon="log" text="Log out" /> : <MenuItem icon="visits" text="Log in" />}
      </Menu>
      <LoginDialog isOpen={dialogIsOpen} onClose={closeDialog} onLogin={setLoginSession} />
    </>
  );
}
