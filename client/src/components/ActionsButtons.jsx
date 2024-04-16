import { useState } from 'react';
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
      onClick={() => {
        toggleEditMode(UUID);
      }}
    />
  );
}

function SaveButton({ UUID, editValueRef, manifestData, editingRowId, setEditingRowId, setManifestData }) {
  // Handle validation errors
  async function saveChanges() {
    // Make newtwork request to save changes to material doc number
    try {
      const response = await editMaterialDocument(UUID, editValueRef.current);

      if (Response.status === 422) {
        const errorData = await response.json();
        console.log('Validation errors:', errorData.message);
      }

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
    } catch (error) {
      console.log(error);
    }
  }
  return <Button icon="save" onClick={saveChanges} />;
}

function DeleteButton({ UUID, setManifestData }) {
  async function handleDelete(UUID) {
    try {
      const response = await deleteManifests(UUID);

      setManifestData((prevData) => prevData.filter((item) => item.UUID !== UUID));
      return response;
    } catch (error) {
      console.log('An error occurred:', error);
    }
  }
  return (
    <Button
      icon="delete"
      onClick={() => {
        handleDelete(UUID);
      }}
    />
  );
}

function DisplayItemsButton({ UUID, openItemsDialog, setItemData }) {
  // Display the doc number as the header before finalizing
  async function displayItems(UUID) {
    openItemsDialog();
    try {
      const result = await fetchItems(UUID);
      const items = await result.data.items;
      console.log(items);
      setItemData(items);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Button
      icon="activity-items"
      onClick={() => {
        displayItems(UUID);
      }}
    />
  );
}
export { EditButton, SaveButton, DeleteButton, DisplayItemsButton };
