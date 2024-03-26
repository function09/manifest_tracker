import { Dialog, FileUploader, Button, AnalyticalTable } from '@ui5/webcomponents-react';

function ManifestDialog({ display, setDisplay, message, upload }) {
  return (
    //Display this as a banner as opposed to a dialog
    <Dialog open={display} headerText="Message" footer={<Button onClick={setDisplay}>Close</Button>}>
      <FileUploader hideInput onChange={upload}>
        {message}
      </FileUploader>
    </Dialog>
  );
}

function ItemsDialog({ isOpen, setIsOpen }) {
  return (
    <Dialog open={isOpen} headerText="Items" footer={<Button onClick={setIsOpen}>Close</Button>}>
      <AnalyticalTable
        columns={[
          {
            Header: 'Material_Batch',
            accessor: 'materialAndBatch',
            headerTooltip: 'Material and batch ID',
          },
          {
            Header: 'Description',
            accessor: 'description',
            headerTooltip: 'Item description',
          },
          {
            Header: 'Quantity',
            accessor: 'itemQuantity',
            headerTooltip: 'Item quantity',
          },
        ]}
      />
    </Dialog>
  );
}

export { ManifestDialog, ItemsDialog };
