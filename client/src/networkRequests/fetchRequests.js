async function fetchItems(UUID, setDocumentNumber, setItems) {
  // clean all of this up
  try {
    const response = await fetch(`http://localhost:3000/api/v1/manifests/${UUID}`);

    if (!response.ok) {
      throw new Error('failed to fetch:', response.status);
    }

    const data = await response.json();
    // Don't need anything but the document number,items, and UUID fix this in the API
    const { documentNumber, items } = await data.message;
    setDocumentNumber(documentNumber);
    setItems(items);
  } catch (error) {
    console.log(error);
  }
}

export { fetchItems };
