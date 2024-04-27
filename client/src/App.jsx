import { useEffect, useState } from 'react';
import DocumentTable from './components/AnalyticalTable';
import DisplayShellBar from './components/ShellBar';
import { fetchCurrentSession, fetchManifests, uploadManifest } from './networkRequests/fetchRequests';
import { getLoginSessionFromStorage, saveSessionToStorage } from './localStorage/localStorage';
import { ErrorDialog, ItemsDialog } from './components/Dialogs';
import FileUpload from './components/FileUpload';

export default function App() {
  const [loginSession, setLoginSession] = useState(null);
  const [manifestData, setManifestData] = useState([]);
  const [header, setHeader] = useState('');
  const [itemData, setItemData] = useState([]);
  const [UUID, setUUID] = useState(null);
  const [itemDisplayOpen, setItemDisplayOpen] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  // See if this can be combined into another state
  const [errorStatus, setErrorStatus] = useState('');
  const [errorMessage, setErrorMessage] = useState();

  function openItemsDialog() {
    setItemDisplayOpen(true);
  }

  function openErrorDialog() {
    setErrorDialogOpen(true);
  }

  async function handleFileUpload(event) {
    try {
      const uploadedResult = await uploadManifest(event);

      if (!uploadedResult.success) {
        setErrorStatus(uploadedResult.status);
        setErrorMessage(uploadedResult.message);
        openErrorDialog();
      } else {
        const updatedData = await fetchManifests();
        setManifestData(updatedData.data);
      }
    } catch (error) {
      setErrorMessage(error.message);
      openErrorDialog();
    }
  }

  useEffect(() => {
    async function getCurrentSession() {
      try {
        const storedSession = getLoginSessionFromStorage();
        if (storedSession) {
          setLoginSession(storedSession);
        } else {
          const session = await fetchCurrentSession();
          if (!session.success) {
            setLoginSession(null);
            saveSessionToStorage(null);

            //openErrorDialog(); //This modal displays after logging in
          } else {
            setLoginSession(session);
            saveSessionToStorage(session);
          }
        }
      } catch (error) {
        setErrorMessage(error.message);
        setLoginSession(null);
        saveSessionToStorage(null);
        openErrorDialog();
      }
    }

    getCurrentSession();
  }, []);

  return (
    <>
      <DisplayShellBar
        loginSession={loginSession}
        setLoginSession={setLoginSession}
        setErrorStatus={setErrorStatus}
        setErrorMessage={setErrorMessage}
        errorMessage={errorMessage}
        openErrorDialog={openErrorDialog}
      />
      {loginSession && (
        <>
          <DocumentTable
            manifestData={manifestData}
            setManifestData={setManifestData}
            loginSession={loginSession}
            handleFileUpload={handleFileUpload}
            openItemsDialog={openItemsDialog}
            setUUID={setUUID}
            setItemData={setItemData}
            setHeader={setHeader}
            header={header}
            setErrorStatus={setErrorStatus}
            setErrorMessage={setErrorMessage}
            openErrorDialog={openErrorDialog}
          />
          <ItemsDialog
            isOpen={itemDisplayOpen}
            setIsOpen={setItemDisplayOpen}
            UUID={UUID}
            setItemData={setItemData}
            itemData={itemData}
            header={header}
          />
          <FileUpload handleFileUpload={handleFileUpload} />
          <ErrorDialog
            errorMessage={errorMessage}
            errorStatus={errorStatus}
            errorDialogOpen={errorDialogOpen}
            setErrorDialogOpen={setErrorDialogOpen}
          />
        </>
      )}
    </>
  );
}
