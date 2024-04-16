import { AnalyticalTable } from '@ui5/webcomponents-react';

function ItemsTable({ data }) {
  const tableColumns = [
    { Header: 'Material_Batch', accessor: 'materialAndBatch', headerTooltip: 'Material and batch ID' },
    { Header: 'Description', accessor: 'description', headerTooltip: 'Item description' },
    { Header: 'Quantity', accessor: 'itemQuantity', headerTooltip: 'Item quantity' },
  ];

  return <AnalyticalTable columns={tableColumns} data={data} />;
}

export default ItemsTable;
