import { Dialog, FileUploader, Button } from '@ui5/webcomponents-react';

function ManifestDialog({ display, setDisplay, message, upload }) {
  return (
    <Dialog open={display} headerText="Message" footer={<Button onClick={setDisplay}>Close</Button>}>
      <FileUploader hideInput onChange={upload}>
        {message}
      </FileUploader>
    </Dialog>
  );
}

export { ManifestDialog };
