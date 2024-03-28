import '@ui5/webcomponents-icons/dist/AllIcons.js';
import { useEffect, useState } from 'react';
import { AnalyticalTable, FlexBox, Button, FileUploader } from '@ui5/webcomponents-react';
import { ItemsDialog, ManifestDialog } from './Dialogs';
import { fetchManifests, fetchItems, uploadManifest, deleteManifests } from '../networkRequests/fetchRequests';

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

  // Change this to displayError and it's dependencies
  function displayDialog() {
    if (display === true) setDisplay(false);
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
      accessor: 'materialDocument',
      headerTooltip: 'Material Document',
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
        const { UUID } = row.original;

        function handleDisplayItems(UUID) {
          displayItems(UUID);
        }

        return (
          <FlexBox>
            <Button icon="edit" />
            <Button
              icon="delete"
              onClick={() => {
                deleteManifests(UUID, setData, setMessage, setDisplay, setIsEmpty, setError);
              }}
            />
            <Button icon="activity-items" onClick={() => handleDisplayItems(UUID)} />
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
