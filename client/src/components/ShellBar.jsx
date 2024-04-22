import { Avatar, Menu, MenuItem, ShellBar } from '@ui5/webcomponents-react';
import { useState } from 'react';
import { LogOutDialog, LoginDialog, NewUserDialog } from './Dialogs';
import { logOut } from '../networkRequests/fetchRequests';
import sapLogo from '../assets/SAP_2011_logo.svg';
import { clearSessionFromStorage } from '../localStorage/localStorage';

export default function DisplayShellBar({
  loginSession,
  setLoginSession,
  setErrorStatus,
  setErrorMessage,
  errorMessage,
  openErrorDialog,
}) {
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [logOutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [newUserDialogOpen, setNewUserDialogOpen] = useState(false);
  const [logoutMessage, setLogOutMessage] = useState('');
  // const [loginSession, setLoginSession] = useState(null);

  function displayMenu() {
    setMenuIsOpen(true);
  }

  function closeMenu() {
    setMenuIsOpen(false);
  }
  // differentiate this from the error dialog
  function displayDialog() {
    setNewUserDialogOpen(false);
    setDialogIsOpen(true);
  }

  function closeDialog() {
    setDialogIsOpen(false);
  }

  function displayLogoutDialog() {
    setLogoutDialogOpen(true);
  }

  function closeLogoutDialog() {
    setLogoutDialogOpen(false);
  }

  function openCreateUserDialog() {
    closeDialog();
    setNewUserDialogOpen(true);
  }

  async function setLogOut() {
    try {
      const handleLogout = await logOut();

      if (!handleLogout.success) {
        setErrorStatus(handleLogout.status);
        setErrorMessage(handleLogout.message);
        openErrorDialog();
      } else {
        setErrorMessage('');
        clearSessionFromStorage();
        setLoginSession(null);
        setLogOutMessage(handleLogout.message);
        displayLogoutDialog();
      }
    } catch (error) {
      setErrorStatus(500);
      setErrorMessage(error);
      openErrorDialog();
    }
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
      <LoginDialog
        isOpen={dialogIsOpen}
        onClose={closeDialog}
        onLogin={setLoginSession}
        openCreateUserDialog={openCreateUserDialog}
        setErrorMessage={setErrorMessage}
        errorMessage={errorMessage}
      />
      <LogOutDialog isOpen={logOutDialogOpen} logOutMessage={logoutMessage} handleClose={closeLogoutDialog} />
      <NewUserDialog
        isOpen={newUserDialogOpen}
        openLoginDialog={displayDialog}
        setErrorMessage={setErrorMessage}
        errorMessage={errorMessage}
      />
    </>
  );
}
