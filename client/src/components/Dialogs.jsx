import { Dialog, FileUploader, Button } from "@ui5/webcomponents-react"


function NoManifestDialog({message, upload}){


    return(
        <>
        <Dialog open={true} headerText={message}>
            <FileUploader hideInput onChange={upload} >
            <Button>
                Upload single file
            </Button>
            </FileUploader>
            </Dialog>
            </>
    )
}

export {NoManifestDialog}