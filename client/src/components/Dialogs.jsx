import { Dialog, FileUploader, Button, AnalyticalTable, Form, FormItem, Input } from '@ui5/webcomponents-react';
import { useState } from 'react';
import { login } from '../networkRequests/fetchRequests';

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

function ItemsDialog({ isOpen, setIsOpen, itemData, docNumber }) {
  return (
    <Dialog
      open={isOpen}
      headerText={`Document Number: ${docNumber}`}
      footer={<Button onClick={setIsOpen}>Close</Button>}
    >
      <AnalyticalTable
        data={itemData}
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

function LoginDialog({ isOpen, onClose, onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin() {
    await login(username, password);
    onClose();
    onLogin();
  }

  return (
    <Dialog open={isOpen} headerText="Login" /*Set a footer to include a sign-up feature*/>
      <Form>
        <FormItem label="Username">
          <Input
            type="Text"
            value={username}
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
        </FormItem>
        <FormItem label="Password">
          <Input
            type="Password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
        </FormItem>
      </Form>
      <Button onClick={handleLogin}>Log in</Button>
    </Dialog>
  );
}

export { ManifestDialog, ItemsDialog, LoginDialog };
