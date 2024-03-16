import {AnalyticalTable, FlexBox, Button} from "@ui5/webcomponents-react"

export default function DocumentTable() {

    const tableColumns = [
            {
                Header: 'Document Number',
                accessor: 'documentNumber',
                headerTooltip: 'Document Number'
            },
            {
                Header: 'Material Document',
                accessor: 'materialDocument',
                headerTooltip: 'Material Document'
            },
            {
                Header: 'Sending Warehouse',
                accessor: 'sendingWarehouse',
                headerTooltip: 'Sending Warehouse'
            },
            {
                Header: 'Departure Date',
                accessor: 'departureDate',
                headerTooltip: 'Departure Date'
            },
            {
                Header: 'Arrival Date',
                accessor: 'arrivalDate',
                headerTooltip: 'Arrival Date'
            },
            {
                Header: 'Actions',
                accessor: '.',
                headerTooltip: 'actions',
                Cell: () => {
                    return(
                        <FlexBox>
                            <Button icon="edit"/>
                            <Button icon="delete"/>
                            <Button icon= "activity-items" />
                        </FlexBox>
                    )
                }
            }
    ]

    return (
        <AnalyticalTable columns={tableColumns}/>
    )
}