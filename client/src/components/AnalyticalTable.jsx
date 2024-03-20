import "@ui5/webcomponents-icons/dist/AllIcons.js";
import { useEffect, useState } from "react"
import {AnalyticalTable, FlexBox, Button, FileUploader, Dialog} from "@ui5/webcomponents-react"
import { NoManifestDialog } from "./Dialogs";

export default function DocumentTable() {
    const [data, setData] = useState([])
    const [message, setMessage] = useState("")
    const [isEmpty, setIsEmpty] = useState(true)
    const [error, setError] = useState(null)

    // Add a loading modal to display as requests are being sent and processed by server
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

    useEffect(()=> {
          fetchManifests()
    }, [])

    
    /*
    Select the file, create a new form data object, 
    use the form data object to send the file to the server for processing
    */
    const uploadManifest = async (event)=>{
        const file = event.target.files[0]

        if(!file) return 

        const formData = new FormData()
        
        // consider changing "file" to "manifest" in both server-side and client
        formData.append("file", file)

        const fetchOptions = {
            method: "POST",
            body: formData,
        }

        try{
            const response = await fetch("http://localhost:3000/api/v1/manifests/upload", fetchOptions)

            if(!response.ok){
                const message = `An error has occured: ${response.status}`;
                throw new Error(message);
            }

            fetchManifests()
        }catch(error){
            setError(error)
        }     
    }

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
                <NoManifestDialog message={message} upload={uploadManifest}/>
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