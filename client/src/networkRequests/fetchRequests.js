// Add a loading modal to display as requests are being sent and processed by server
//Also try to break these down and prevent repetition
//Clean these up as well so they're consistent
const fetchManifests = async () => {
  const fetchOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  };

  try {
    const response = await fetch('http://localhost:3000/api/v1/manifests', fetchOptions);
    const result = await response.json();

    if (!response.ok) {
      return { success: false, status: response.status, data: result.message };
    } else {
      return { success: true, status: response.status, data: result.data };
    }
  } catch (error) {
    throw new Error('Failed to connect to the server:', error.message);
  }
};

const fetchItems = async (UUID) => {
  const fetchOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  };
  // clean all of this up
  try {
    const response = await fetch(`http://localhost:3000/api/v1/manifests/${UUID}`, fetchOptions);
    const result = await response.json();

    if (!response.ok) {
      return { success: false, status: response.status, message: result.message };
    } else {
      // Don't need anything but the document number,items, and UUID fix this in the API
      return { success: true, status: response.status, data: result.data };
    }
  } catch (error) {
    throw new Error('Failed to connect to the server:', error.message);
  }
};

const uploadManifest = async (event) => {
  /*
    Sedialect the file, create a new form data object, 
    use the form data object to send the file to the server for processing
  */

  const file = event.target.files[0];

  if (!file) {
    return;
  }

  const formData = new FormData();

  // consider changing "file" to "manifest" in both server-side and client
  formData.append('file', file);

  const fetchOptions = {
    method: 'POST',
    credentials: 'include',
    body: formData,
  };

  try {
    const response = await fetch('http://localhost:3000/api/v1/manifests/upload', fetchOptions);
    const data = await response.json();

    if (!response.ok) {
      event.target.value = '';
      return { success: false, status: response.status, message: data.message };
    } else {
      event.target.value = '';
      return { success: true, message: data.message };
    }
  } catch (error) {
    throw new Error('Failed to connect to the server:', error.message);
  }
};

//Change this to updateMaterialDocument
const editMaterialDocument = async (UUID, materialDocNumber) => {
  const fetchOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ materialDocNumber }),
    credentials: 'include',
  };
  try {
    const response = await fetch(`http://localhost:3000/api/v1/manifests/update/${UUID}`, fetchOptions);
    const result = await response.json();
    console.log(result.message);
    if (!response.ok) {
      const errorMessages = Array.isArray(result.message)
        ? result.message.map((message) => message.msg)
        : [result.message];
      return { success: false, status: response.status, message: await errorMessages };
    }
    return { success: true, data: result };
  } catch (error) {
    throw new Error('Failed to connect to the server:', error.message);
  }
};

const deleteManifests = async (UUID) => {
  const fetchOptions = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  };

  try {
    const response = await fetch(`http://localhost:3000/api/v1/manifests/delete/${UUID}`, fetchOptions);
    const data = await response.json();

    if (!response.ok) {
      return { success: false, status: response.status, message: data.message };
    } else {
      return { success: true, status: response.status, message: data.message };
    }
  } catch (error) {
    throw new Error('Failed to connect to the server:', error.message);
  }
};

const login = async (username, password) => {
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
    credentials: 'include',
  };

  try {
    const response = await fetch(`http://localhost:3000/users/login`, fetchOptions);
    const result = await response.json();

    if (!response.ok) {
      return { success: false, status: response.status, message: result.message };
    } else {
      //Need to fix endpoint structure
      return { success: true, status: response.status, message: result.username };
    }
  } catch (error) {
    throw new Error('Failed to connect to the server:', error.message);
  }
};

const logOut = async () => {
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  };

  try {
    const response = await fetch('http://localhost:3000/users/logout', fetchOptions);
    const result = await response.json();

    if (!response.ok) {
      return { success: false, status: response.status, message: result.message };
    } else {
      return { success: true, status: response.status, message: result.message };
    }
  } catch (error) {
    throw new Error('Failed to connect to the server:', error.message);
  }
};

const createNewUser = async (username, password) => {
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
    credentials: 'include',
  };

  try {
    const response = await fetch('http://localhost:3000/users/create', fetchOptions);
    const data = await response.json();

    if (!response.ok) {
      console.log(data.error);
      return { success: false, status: response.status, message: data.message };
    } else {
      return { success: true, status: response.status, message: data.message };
    }
  } catch (error) {
    throw new Error('Failed to connect to the server:', error.message);
  }
};

const fetchCurrentSession = async () => {
  const fetchOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  };

  try {
    const response = await fetch('http://localhost:3000/users/session', fetchOptions);

    if (!response.ok) {
      return null;
    }

    const sessionData = await response.json();

    return sessionData;
  } catch (error) {
    throw new Error('Failed to connect to the server:', error.message);
  }
};

export {
  fetchManifests,
  fetchItems,
  uploadManifest,
  editMaterialDocument,
  deleteManifests,
  login,
  logOut,
  createNewUser,
  fetchCurrentSession,
};
