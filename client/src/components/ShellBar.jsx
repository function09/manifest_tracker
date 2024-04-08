import { Avatar, ShellBar } from '@ui5/webcomponents-react';
import { LoginDialog } from './Dialogs';
import { useState, useEffect } from 'react';
import { fetchManifests, deleteManifests } from '../networkRequests/fetchRequests';
import DocumentTable from './AnalyticalTable';

//Take this component and the analytical table, put them into their own shared component with shared state
export default function DisplayShellBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState([]);

  async function fetchData() {
    try {
      const fetchedData = await fetchManifests();
      setData(fetchedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async function handleDelete(UUID) {
    try {
      const response = await deleteManifests(UUID);

      if (response.ok) {
        const updatedData = data.filter((item) => item.UUID !== UUID);
        setData(updatedData);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function displayLoginDialog() {
    setIsOpen(true);
  }

  async function closeLogin() {
    setIsOpen(false);
    await fetchData();
  }

  return (
    <>
      <LoginDialog isOpen={isOpen} setIsOpen={closeLogin} />
      <ShellBar
        // Download this image to use as a static file
        logo={<img alt="SAP Logo" src="https://sap.github.io/ui5-webcomponents/assets/images/sap-logo-svg.svg" />}
        primaryTitle="Manifest Tracker"
        profile={<Avatar icon="employee"></Avatar>}
        onProfileClick={displayLoginDialog}
      ></ShellBar>
      <DocumentTable data={data} onDelete={handleDelete} onUpdate={setData} />
    </>
  );
}
