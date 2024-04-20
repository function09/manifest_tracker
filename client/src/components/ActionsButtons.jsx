import { Button } from '@ui5/webcomponents-react';
import { fetchItems, editMaterialDocument, deleteManifests } from '../networkRequests/fetchRequests';

function EditButton({ setEditingRowId, setUUID, UUID }) {
  function toggleEditMode(UUID) {
    setEditingRowId(UUID);
    setUUID(UUID);
  }
  return (
    <Button
      icon="edit"
      tooltip="Edit material document"
      onClick={() => {
        toggleEditMode(UUID);
      }}
    />
  );
}

function SaveButton({
  UUID,
  editValueRef,
  manifestData,
  editingRowId,
  setEditingRowId,
  setManifestData,
  setErrorStatus,
  setErrorMessage,
  openErrorDialog,
}) {
  // Handle validation errors
  async function saveChanges() {
    // Make newtwork request to save changes to material doc number
    try {
      const response = await editMaterialDocument(UUID, editValueRef.current);

      if (!response.success) {
        setErrorStatus(response.status);
        setErrorMessage(response.message);
        openErrorDialog();
      } else {
        const newData = manifestData.map((item) => {
          if (item.UUID === editingRowId) {
            return { ...item, materialDocNumber: editValueRef.current };
          }
          return item;
        });

        // Update data array with modified data
        setManifestData(newData);

        // Reset editing state
        setEditingRowId(null);
      }
    } catch (error) {
      console.log(error);
    }
  }
  return <Button icon="save" onClick={saveChanges} />;
}

function DeleteButton({ UUID, setManifestData, setErrorStatus, setErrorMessage, openErrorDialog }) {
  async function handleDelete(UUID) {
    try {
      const response = await deleteManifests(UUID);
      if (!response.success) {
        setErrorStatus(response.status);
        setErrorMessage(response.message);
        openErrorDialog();
      } else {
        setManifestData((prevData) => prevData.filter((item) => item.UUID !== UUID));
        return response;
      }
    } catch (error) {
      console.log('An error occurred:', error);
    }
  }
  return (
    <Button
      icon="delete"
      tooltip="Delete document"
      onClick={() => {
        handleDelete(UUID);
      }}
    />
  );
}

function DisplayItemsButton({
  UUID,
  openItemsDialog,
  setItemData,
  setHeader,
  setErrorStatus,
  setErrorMessage,
  openErrorDialog,
}) {
  // Display the doc number as the header before finalizing
  async function displayItems(UUID) {
    openItemsDialog();
    try {
      const result = await fetchItems(UUID);
      const items = await result.data.items;
      const documentNumber = await result.data.documentNumber;

      if (!result.success) {
        console.log('error here');
        setErrorStatus(result.status);
        setErrorMessage(result.message);
        openErrorDialog();
      } else {
        setItemData(items);
        setHeader(documentNumber);
      }
    } catch (error) {
      setErrorMessage(error.message);
      openErrorDialog();
    }
  }

  return (
    <Button
      icon="activity-items"
      tooltip="View items"
      onClick={() => {
        displayItems(UUID);
      }}
    />
  );
}
export { EditButton, SaveButton, DeleteButton, DisplayItemsButton };
