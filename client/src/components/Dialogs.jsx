import { Dialog, FileUploader, Button } from "@ui5/webcomponents-react"


function NoManifestDialog({message}){


    return(
        <>
        <Dialog open={true} headerText={message}>
            <FileUploader hideInput>
            <Button>
                Upload single file
            </Button>
            </FileUploader>
            </Dialog>
            </>
    )
}

export {NoManifestDialog}