import { useEffect, useState } from 'react';
import DocumentTable from './components/AnalyticalTable';
import DisplayShellBar from './components/ShellBar';
import { fetchCurrentSession, fetchManifests, uploadManifest, fetchItems } from './networkRequests/fetchRequests';
import { saveSessionToStorage } from './localStorage/localStorage';
import { ItemsDialog } from './components/Dialogs';

export default function App() {
  const [loginSession, setLoginSession] = useState(null);
  const [manifestData, setManifestData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [itemData, setItemData] = useState([]);
  const [UUID, setUUID] = useState(null);

  function openItemsDialog() {
    setIsOpen(true);
  }

  // async function displayItems(UUID) {
  //   openItemsDialog();
  //   try {
  //     const result = await fetchItems(UUID);
  //     const items = await result.data.items;
  //     setItemData(items);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  async function handleFileUpload(event) {
    try {
      await uploadManifest(event);
      const updatedData = await fetchManifests();
      setManifestData(updatedData);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    async function getCurrentSession() {
      try {
        const session = await fetchCurrentSession();

        if (session) {
          setLoginSession(session);
          saveSessionToStorage(session);
        } else {
          setLoginSession(null);
          saveSessionToStorage(null);
        }
      } catch (error) {
        console.log(error);
        setLoginSession(null);
        saveSessionToStorage(null);
      }
    }

    getCurrentSession();
  }, []);

  return (
    <>
      <DisplayShellBar loginSession={loginSession} setLoginSession={setLoginSession} />
      <DocumentTable
        manifestData={manifestData}
        setManifestData={setManifestData}
        loginSession={loginSession}
        handleFileUpload={handleFileUpload}
        openItemsDialog={openItemsDialog}
        setUUID={setUUID}
        setItemData={setItemData}
      />
      <ItemsDialog isOpen={isOpen} setIsOpen={setIsOpen} UUID={UUID} setItemData={setItemData} itemData={itemData} />
    </>
  );
}
