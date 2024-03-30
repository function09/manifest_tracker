import '@ui5/webcomponents-icons/dist/AllIcons.js';
import { useEffect, useState, useRef } from 'react';
import { AnalyticalTable, FlexBox, Button, FileUploader, Input } from '@ui5/webcomponents-react';
import { ItemsDialog, ManifestDialog } from './Dialogs';
import {
  fetchManifests,
  fetchItems,
  uploadManifest,
  deleteManifests,
  editMaterialDocument,
} from '../networkRequests/fetchRequests';

export default function DocumentTable() {
  const [data, setData] = useState([]);
  const [message, setMessage] = useState('');
  const [isEmpty, setIsEmpty] = useState(true);
  const [display, setDisplay] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(null);
  const [UUID, setUUID] = useState(null);
  const [docNumber, setDocNumber] = useState(null);
  const [items, setItems] = useState([]);
  const [editingRowId, setEditingRowId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const editValueRef = useRef('');

  // Change this to displayError and it's dependencies
  function displayDialog() {
    if (display === true) setDisplay(false);
  }

  function toggleEditMode(UUID, initialValue) {
    setEditingRowId(UUID);
    setUUID(UUID);
    editValueRef.current = initialValue;
  }

  function handleInputChange(event) {
    editValueRef.current = event.target.value;
  }

  function saveChanges() {
    editMaterialDocument(UUID, editValueRef.current, setData, setMessage, setDisplay, setIsEmpty, setError);
    setEditingRowId(null);
  }

  function displayItems(UUID) {
    setUUID(UUID);
    setIsOpen(true);
    fetchItems(UUID, setDocNumber, setItems, setError);
  }

  function closeItemDisplay() {
    setIsOpen(false);
  }

  useEffect(() => {
    fetchManifests(setData, setMessage, setDisplay, setIsEmpty, setError);
  }, []);

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
      Cell: ({ row }) => {
        const { UUID, materialDocNumber } = row.original;

        return editingRowId === UUID ? (
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
      Cell: ({ row }) => {
        const { UUID, materialDocument } = row.original;

        function handleDisplayItems(UUID) {
          displayItems(UUID);
        }

        return (
          <FlexBox>
            {editingRowId === UUID ? (
              <Button icon="save" onClick={saveChanges} />
            ) : (
              <>
                <Button icon="edit" onClick={() => toggleEditMode(UUID, materialDocument)} />
                <Button
                  icon="delete"
                  onClick={() => {
                    deleteManifests(UUID, setData, setMessage, setDisplay, setIsEmpty, setError);
                  }}
                />
                <Button icon="activity-items" onClick={() => handleDisplayItems(UUID)} />
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
      <ManifestDialog
        display={display}
        setDisplay={displayDialog}
        message={message}
        upload={(event) => uploadManifest(event, setMessage, setDisplay, setIsEmpty, setError, setData)}
      />
      <ItemsDialog isOpen={isOpen} setIsOpen={closeItemDisplay} itemData={items} docNumber={docNumber} />
      <AnalyticalTable columns={tableColumns} data={data} />
      <FileUploader
        onChange={(event) => uploadManifest(event, setMessage, setDisplay, setIsEmpty, setError, setData)}
        hideInput
      >
        <Button>Upload single file</Button>
      </FileUploader>
    </>
  );
}
