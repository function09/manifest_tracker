import '@ui5/webcomponents-icons/dist/AllIcons.js';
import { useEffect, useState } from 'react';
import { AnalyticalTable, FlexBox, Button, FileUploader } from '@ui5/webcomponents-react';
import { ItemsDialog, ManifestDialog } from './Dialogs';
import { fetchItems } from '../networkRequests/fetchRequests';

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
    fetchItems(UUID, setDocNumber, setItems);
  }

  function closeItemDisplay() {
    setIsOpen(false);
  }

  // Add a loading modal to display as requests are being sent and processed by server
  const fetchManifests = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/v1/manifests');

      if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
      }

      const manifests = await response.json();
      //   Fix the message that displays
      const result = manifests.message;

      if (typeof result === 'string') {
        setData([]);
        setMessage(result);
        setDisplay(true);
      } else {
        setData(result);
        setIsEmpty(false);
        setDisplay(false);
      }
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    fetchManifests();
  }, []);

  /*
    Select the file, create a new form data object, 
    use the form data object to send the file to the server for processing
  */

  const uploadManifest = async (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const formData = new FormData();

    // consider changing "file" to "manifest" in both server-side and client
    formData.append('file', file);

    const fetchOptions = {
      method: 'POST',
      body: formData,
    };

    try {
      const response = await fetch('http://localhost:3000/api/v1/manifests/upload', fetchOptions);

      if (!response.ok) {
        const result = await response.json();
        const errorMessage = result.message;
        setMessage(errorMessage);
        setDisplay(true);
      } else {
        setMessage('');
        fetchManifests();
        setDisplay(false);
      }
    } catch (error) {
      setError(error);
    }
  };

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
            <Button icon="delete" />
            <Button icon="activity-items" onClick={() => handleDisplayItems(UUID)} />
          </FlexBox>
        );
      },
    },
  ];

  //   if (error) {
  //     return <ManifestDialog display={display} message={message} upload={uploadManifest} />;
  //   }

  //   if (data.length === 0) {
  //     return <ManifestDialog display={display} message={message} upload={uploadManifest} />;
  //   }

  //   if (data.length > 0 && !error) {
  //     return (
  //       <>
  //         <ManifestDialog display={display} message={message} upload={uploadManifest} />
  //         <AnalyticalTable columns={tableColumns} data={data} />
  //         <FileUploader onChange={uploadManifest} hideInput>
  //           <Button>Upload single file</Button>
  //         </FileUploader>
  //       </>
  //     );
  //   }

  return (
    // When same file uploaded twice, it doesnt display the error until refresh
    <>
      <ManifestDialog display={display} setDisplay={displayDialog} message={message} upload={uploadManifest} />
      <ItemsDialog isOpen={isOpen} setIsOpen={closeItemDisplay} itemData={items} docNumber={docNumber} />
      <AnalyticalTable columns={tableColumns} data={data} />
      <FileUploader onChange={uploadManifest} hideInput>
        <Button>Upload single file</Button>
      </FileUploader>
    </>
  );
}
