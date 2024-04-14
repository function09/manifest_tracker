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
  login,
} from '../networkRequests/fetchRequests';
import FileUpload from './FileUpload';

export default function DocumentTable({ data, setData, loginSession, handleFileUpload }) {
  // NEED TO HANDLE ERRORS ON ALL COMPONENTS, DISPLAY ITEM DATA,UPDATE, AND DELETE FUNCTIONS
  // const [data, setData] = useState([]);
  // const [message, setMessage] = useState('');
  // const [isEmpty, setIsEmpty] = useState(true);
  // const [display, setDisplay] = useState(false);
  // const [isOpen, setIsOpen] = useState(false);
  // const [error, setError] = useState(null);
  const [UUID, setUUID] = useState(null);
  // const [docNumber, setDocNumber] = useState(null);
  // const [items, setItems] = useState([]);
  const [editingRowId, setEditingRowId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const editValueRef = useRef('');

  // // Change this to displayError and it's dependencies
  // function displayDialog() {
  //   if (display === true) setDisplay(false);
  // }

  async function displayData() {
    try {
      if (loginSession) {
        const data = await fetchManifests();
        setData(data);
      } else {
        setData([]);
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

  // function toggleEditMode(UUID, initialValue) {
  //   setEditingRowId(UUID);
  //   setUUID(UUID);
  //   editValueRef.current = initialValue;
  // }

  function handleInputChange(event) {
    editValueRef.current = event.target.value;
  }

  // function saveChanges() {
  //   editMaterialDocument(UUID, editValueRef.current);
  //   setEditingRowId(null);
  // }

  // Handle validation errors
  async function saveChanges() {
    // Make newtwork request to save changes to material doc number
    try {
      const response = await editMaterialDocument(UUID, editValueRef.current);

      if (Response.status === 422) {
        const errorData = await response.json();
        console.log('Validation errors:', errorData.message);
      }

      const newData = data.map((item) => {
        if (item.UUID === editingRowId) {
          return { ...item, materialDocNumber: editValueRef.current };
        }
        return item;
      });

      // Update data array with modified data
      setData(newData);

      // Reset editing state
      setEditingRowId(null);
    } catch (error) {
      console.log(error);
    }

    // Update the data array with the new material doc number

    // // Update the state with the new data
    // onUpdate(newData);
  }

  // function displayItems(UUID) {
  //   setUUID(UUID);
  //   setIsOpen(true);
  //   fetchItems(UUID, setDocNumber, setItems, setError);
  // }

  // function closeItemDisplay() {
  //   setIsOpen(false);
  // }

  // useEffect(() => {
  //   fetchManifests(setData, setMessage, setDisplay, setIsEmpty, setError);
  // }, []);

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
        // console.log(original);
        // function handleDisplayItems(UUID) {
        //   displayItems(UUID);
        // }

        // function handleDelete(UUID) {
        //   onDelete(UUID);
        // }
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
                <Button icon="delete" />
                <Button icon="activity-items" />)
              </>
            )}
          </FlexBox>
        );
        // return (
        //   <FlexBox>
        //     {editingRowId === UUID ? (
        //       <Button icon="save" onClick={saveChanges} />
        //     ) : (
        //       <>
        //         <Button
        //           icon="edit"
        //           onClick={() => {
        //             toggleEditMode(UUID);
        //           }}
        //         />
        //         <Button
        //           icon="delete"
        //           onClick={() => {
        //             handleDelete(UUID);
        //           }}
        //         />
        //         <Button icon="activity-items" onClick={() => handleDisplayItems(UUID)} />
        //       </>
        //     )}
        //   </FlexBox>
        // );
      },
    },
  ];

  return (
    // When same file uploaded twice, it doesnt display the error until refresh
    <>
      {/* <ItemsDialog isOpen={isOpen} setIsOpen={closeItemDisplay} itemData={items} docNumber={docNumber} /> */}
      {loginSession && (
        <>
          <AnalyticalTable columns={tableColumns} data={data} />
          <FileUpload handleFileUpload={handleFileUpload} />
        </>
      )}

      {/* <FileUploader
        onChange={(event) => uploadManifest(event, setMessage, setDisplay, setIsEmpty, setError, setData)}
        hideInput
      >
        <Button>Upload single file</Button>
      </FileUploader> */}
    </>
  );
}
