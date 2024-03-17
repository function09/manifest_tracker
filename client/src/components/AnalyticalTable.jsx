import "@ui5/webcomponents-icons/dist/AllIcons.js";
import { useEffect, useState } from "react"
import {AnalyticalTable, FlexBox, Button, FileUploader, Dialog} from "@ui5/webcomponents-react"
import { NoManifestDialog } from "./Dialogs";

export default function DocumentTable() {
    const [data, setData] = useState([])
    const [message, setMessage] = useState("")
    const [isEmpty, setIsEmpty] = useState(true)
    const [error, setError] = useState(null)

    useEffect(()=> {
        const fetchManifests = async () => {
            try {
              const response = await fetch('http://localhost:3000/api/v1/manifests');
          
              if (!response.ok) {
                const message = `An error has occured: ${response.status}`;
                throw new Error(message);
              }
          
              const manifests = await response.json();
              const result = manifests.message;

              if(typeof result === "string"){
                setData([])
                setMessage(result)
              } else{
                setData(result)
                setIsEmpty(false)
              }
            } catch (error) {
              setError(error)
            }
            
          };
          fetchManifests()
    }, [])
    // const fetchData = async () =>{
    //     try{
    //         // rename this later
    //         const result = await fetchManifests()

    //         if(typeof result === "string"){
    //             setData([])
    //             setMessage(result)
    //         } else{
    //             setData(result)
    //             setIsEmpty(false)
    //         }

    //     }catch(error){
    //         setError(error)
    //     }
    // }

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
                            <Button icon= "activity-items"/>
                        </FlexBox>
                    )
                }
            }
    ]

    return (
        <>
         <>
            {error && <Dialog open={true} 
                    headerText="Error" 
                    footer={
                    <Button>Close</Button>
                    }>
                    {error.message}
                    </Dialog>}
            {!error && isEmpty ? (
                <NoManifestDialog message={message}/>
            ) : (
                <>
                    <AnalyticalTable columns={tableColumns} data={data}/>
                    <FileUploader hideInput>
                        <Button>Upload single file</Button>
                    </FileUploader>
                </>
            )}
        </>
        </>
    )
}