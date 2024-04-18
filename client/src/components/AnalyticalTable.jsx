import '@ui5/webcomponents-icons/dist/AllIcons.js';
import { useEffect, useState, useRef } from 'react';
import { AnalyticalTable, FlexBox, Input, Text } from '@ui5/webcomponents-react';
import { fetchManifests } from '../networkRequests/fetchRequests';
import FileUpload from './FileUpload';
import { DeleteButton, DisplayItemsButton, EditButton, SaveButton } from './ActionsButtons';

export default function DocumentTable({
  manifestData,
  setManifestData,
  loginSession,
  openItemsDialog,
  setUUID,
  setItemData,
  setHeader,
  setErrorStatus,
  setErrorMessage,
  openErrorDialog,
}) {
  // NEED TO HANDLE ERRORS ON ALL COMPONENTS, DISPLAY ITEM DATA,UPDATE, AND DELETE FUNCTIONS
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

  useEffect(() => {
    displayData();
  }, [loginSession]);

  function handleInputChange(event) {
    editValueRef.current = event.target.value;
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
          <Text>{materialDocNumber}</Text>
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

        return (
          <FlexBox>
            {editingRowId === UUID ? (
              <SaveButton
                UUID={UUID}
                editValueRef={editValueRef}
                manifestData={manifestData}
                editingRowId={editingRowId}
                setEditingRowId={setEditingRowId}
                setManifestData={setManifestData}
                setErrorStatus={setErrorStatus}
                setErrorMessage={setErrorMessage}
                openErrorDialog={openErrorDialog}
              />
            ) : (
              <>
                <EditButton setEditingRowId={setEditingRowId} setUUID={setUUID} UUID={UUID} />
                <DeleteButton UUID={UUID} setManifestData={setManifestData} />
                <DisplayItemsButton
                  UUID={UUID}
                  openItemsDialog={openItemsDialog}
                  setItemData={setItemData}
                  setHeader={setHeader}
                />
              </>
            )}
          </FlexBox>
        );
      },
    },
  ];

  return (
    <>
      <AnalyticalTable columns={tableColumns} data={manifestData} />
    </>
  );
}
