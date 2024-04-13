import { useEffect, useState } from 'react';
import DocumentTable from './components/AnalyticalTable';
import DisplayShellBar from './components/ShellBar';
import { fetchCurrentSession, fetchManifests, uploadManifest } from './networkRequests/fetchRequests';
import { saveSessionToStorage } from './localStorage/localStorage';

export default function App() {
  const [loginSession, setLoginSession] = useState(null);
  const [data, setData] = useState([]);

  async function handleFileUpload(event) {
    try {
      await uploadManifest(event);
      const updatedData = await fetchManifests();
      setData(updatedData);
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
      <DocumentTable data={data} setData={setData} loginSession={loginSession} handleFileUpload={handleFileUpload} />
    </>
  );
}
