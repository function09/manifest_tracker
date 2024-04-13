import { Dialog, FileUploader, Button, AnalyticalTable, Form, FormItem, Input } from '@ui5/webcomponents-react';
import { useEffect, useState } from 'react';
import { login } from '../networkRequests/fetchRequests';
import '@ui5/webcomponents/dist/features/InputElementsFormSupport.js';

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
  const [error, setError] = useState(null);

  async function handleLogin(event) {
    event.preventDefault();
    // Reset state when a user logs in for username, password
    try {
      const data = await login(username, password);

      if (!data.username) {
        setError(data.message);
      } else {
        onClose();
        onLogin(data.username);
        setUsername('');
        setPassword('');
      }
    } catch (error) {
      setError(error);
    }
  }

  return (
    <Dialog
      open={isOpen}
      headerText="Login" /*Set a footer to include a sign-up feature THERE IS A BUG WHERE IF ESCAPE IS PRESSED THE DIALOG STATE DOES NOT CHANGE*/
    >
      <Form onSubmit={handleLogin}>
        <FormItem label="Username">
          <Input
            type="Text"
            value={username}
            onChange={(event) => {
              setUsername(event.currentTarget.value);
            }}
          />
        </FormItem>
        <FormItem label="Password">
          <Input
            type="Password"
            value={password}
            onChange={(event) => {
              setPassword(event.currentTarget.value);
            }}
          />
        </FormItem>
        <Button type="Submit">Log in</Button>
      </Form>
    </Dialog>
  );
}

export { ManifestDialog, ItemsDialog, LoginDialog };
