const fetchManifests = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/v1/manifests');

    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    }

    const manifests = await response.json();
    const manifestData = manifests.message;

    return manifestData;
  } catch (error) {
    console.log('Network error:', error);
  }
};

export default fetchManifests;
