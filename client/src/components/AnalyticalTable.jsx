import '@ui5/webcomponents-icons/dist/AllIcons.js';
import { useEffect, useState, useRef } from 'react';
import { AnalyticalTable, FlexBox, Button, Input } from '@ui5/webcomponents-react';
import { ItemsDialog } from './Dialogs';
import { fetchManifests, fetchItems, deleteManifests, editMaterialDocument } from '../networkRequests/fetchRequests';
import FileUpload from './FileUpload';

export default function DocumentTable({ manifestData, setManifestData, loginSession, handleFileUpload }) {
  // NEED TO HANDLE ERRORS ON ALL COMPONENTS, DISPLAY ITEM DATA,UPDATE, AND DELETE FUNCTIONS
  const [itemData, setItemData] = useState([]);

  const [isOpen, setIsOpen] = useState(false);
  const [UUID, setUUID] = useState(null);
  const [editingRowId, setEditingRowId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const editValueRef = useRef('');

  async function displayData() {
    try {
      if (loginSession) {
        const data = await fetchManifests();
        setManifestData(data);
      } else {
        setManifestData([]);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function openItemsDialog() {
    setIsOpen(true);
  }

  function closeItemDialog() {
    setIsOpen(false);
  }

  async function displayItems(UUID) {
    openItemsDialog();
    try {
      const result = await fetchItems(UUID);
      const items = await result.data.items;
      if (loginSession) {
        setItemData(items);
      } else {
        setItemData([]);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    displayData();
  }, [loginSession]);

  function toggleEditMode(UUID) {
    setEditingRowId(UUID);
    setUUID(UUID);
  }

  function handleInputChange(event) {
    editValueRef.current = event.target.value;
  }

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

  const tableColumns = [
    {
      Header: 'Document Number',
      accessor: 'documentNumber',
      headerTooltip: 'Document Number',
    },
    {
      Header: 'Material Document',
      accessor: 'materialDocNumber',
      headerTooltip: 'Material Document',
      Cell: (props) => {
        const { original } = props.row;
        const { UUID, materialDocNumber } = original;

        const isEditing = editingRowId === UUID;

        return isEditing ? (
          <Input type="Text" value={editValue} onChange={handleInputChange} />
        ) : (
          <span>{materialDocNumber}</span>
        );
      },
    },
    {
      Header: 'Sending Warehouse',
      accessor: 'sendingWarehouse',
      headerTooltip: 'Sending Warehouse',
    },
    {
      Header: 'Departure Date',
      accessor: 'departureDate',
      headerTooltip: 'Departure Date',
    },
    {
      Header: 'Arrival Date',
      accessor: 'arrivalDate',
      headerTooltip: 'Arrival Date',
    },
    {
      Header: 'Actions',
      accessor: '.',
      headerTooltip: 'actions',
      Cell: (props) => {
        const { original } = props.row;
        const { UUID } = original;

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
          <FlexBox>
            {editingRowId === UUID ? (
              <Button icon="save" onClick={saveChanges} />
            ) : (
              <>
                <Button
                  icon="edit"
                  onClick={() => {
                    toggleEditMode(UUID);
                  }}
                />
                <Button
                  icon="delete"
                  onClick={() => {
                    handleDelete(UUID);
                  }}
                />
                <Button
                  icon="activity-items"
                  onClick={() => {
                    displayItems(UUID);
                  }}
                />
              </>
            )}
          </FlexBox>
        );
      },
    },
  ];

  return (
    // When same file uploaded twice, it doesnt display the error until refresh
    <>
      {loginSession && (
        <>
          <AnalyticalTable columns={tableColumns} data={manifestData} />
          <FileUpload handleFileUpload={handleFileUpload} />
          <ItemsDialog isOpen={isOpen} closeDialog={closeItemDialog} data={itemData} />
        </>
      )}
    </>
  );
}
