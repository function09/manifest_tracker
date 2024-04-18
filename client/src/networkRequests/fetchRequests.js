// Add a loading modal to display as requests are being sent and processed by server
//Also try to break these down and prevent repetition
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

    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    }

    const result = await response.json();
    const data = await result.data;

    //   Fix the message that displays
    return data;
  } catch (error) {
    console.log(error);
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

    if (!response.ok) {
      throw new Error('failed to fetch:', response.status);
    }

    const data = await response.json();
    // Don't need anything but the document number,items, and UUID fix this in the API
    return data;
  } catch (error) {
    console.log(error);
  }
};

const uploadManifest = async (event) => {
  /*
    Select the file, create a new form data object, 
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
    return { success: false, status: error.status, message: error.statusText };
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
    return { success: false, status: error.status, message: error.statusText };
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

    if (!response.ok) {
      console.log('Error occured:', response.status);
    }

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
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

    if (!response.ok) {
      const errorData = await response.json();
      return errorData;
    }
    return await response.json();
  } catch (error) {
    console.log(error);
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

    if (!response.ok) {
      throw new Error('Error during logout');
    }
    return response.json();
  } catch (error) {
    console.log(error);
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
    console.log(error);
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
  fetchCurrentSession,
};
