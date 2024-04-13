function saveSessionToStorage(loginSession) {
  localStorage.setItem('loginSession', JSON.stringify(loginSession));
}

function getLoginSessionFromStorage() {
  const storedSession = localStorage.getItem('loginSession');
  return storedSession ? JSON.parse(storedSession) : null;
}

function clearSessionFromStorage() {
  localStorage.removeItem('loginSession');
}

export { saveSessionToStorage, getLoginSessionFromStorage, clearSessionFromStorage };
