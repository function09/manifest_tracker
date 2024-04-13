import { useEffect, useState } from 'react';
import DocumentTable from './components/AnalyticalTable';
import DisplayShellBar from './components/ShellBar';
import { fetchCurrentSession } from './networkRequests/fetchRequests';
import { saveSessionToStorage } from './localStorage/localStorage';

export default function App() {
  const [loginSession, setLoginSession] = useState(null);

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
      <DocumentTable loginSession={loginSession} />
    </>
  );
}
