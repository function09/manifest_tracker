import { FileUploader, Button } from '@ui5/webcomponents-react';
import { uploadManifest } from '../networkRequests/fetchRequests';

export default function FileUpload({ handleFileUpload }) {
  return (
    <FileUploader onChange={handleFileUpload} hideInput={true}>
      <Button>Upload single file</Button>
    </FileUploader>
  );
}
