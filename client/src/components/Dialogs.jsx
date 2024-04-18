import ItemsTable from './ItemsTable';
import { Dialog, Button, Form, FormItem, Input, List, Text, StandardListItem } from '@ui5/webcomponents-react';
import { useState } from 'react';
import { login } from '../networkRequests/fetchRequests';
import '@ui5/webcomponents/dist/features/InputElementsFormSupport.js';

function ErrorDialog({ errorMessage, errorStatus, errorDialogOpen, setErrorDialogOpen }) {
  function closeErrorDialog() {
    setErrorDialogOpen(false);
  }
  return (
    <Dialog
      open={errorDialogOpen}
      headerText={`Error: ${errorStatus}`}
      footer={<Button onClick={closeErrorDialog}>Close</Button>}
    >
      <List>
        {errorMessage && Array.isArray(errorMessage) ? (
          errorMessage.map((error, index) => <StandardListItem key={index}>{error}</StandardListItem>)
        ) : (
          <StandardListItem>
            {typeof errorMessage === 'string' ? errorMessage : 'An unknown error occurred.'}
          </StandardListItem>
        )}
      </List>
      {/* {errorMessage} */}
    </Dialog>
  );
}

function ItemsDialog({ isOpen, setIsOpen, itemData, header }) {
  function closeItemDialog() {
    setIsOpen(false);
  }

  return (
    <Dialog
      open={isOpen}
      headerText={`Document Number: ${header}`}
      footer={<Button onClick={closeItemDialog}>Close</Button>}
    >
      <ItemsTable data={itemData} header={header} />
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

export { ErrorDialog, ItemsDialog, LoginDialog };
