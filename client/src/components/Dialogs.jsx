import { Dialog, FileUploader, Button } from "@ui5/webcomponents-react"


function ManifestDialog({display, message, upload}){

    // Consider conditional renders of the dialog, e.g if you have an error dont include an upload button
    return(
        <>
        <Dialog open={display} headerText="Message">
            <FileUploader hideInput onChange={upload}>
                {message}
            <Button>
                Upload single file
            </Button>
            </FileUploader>
            </Dialog>
            </>
    )
}

export {ManifestDialog}