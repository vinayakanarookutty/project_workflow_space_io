'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useMutation } from '@apollo/client';
import { DELETE_DESIGN_XML } from 'client/app/api/design/mutations';

const OptionsRenderer = (props: any) => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [deleteDesignXml, { data, loading, error }] = useMutation(DELETE_DESIGN_XML);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    console.log('Edit clicked for:', props.data.workflowId);
    const objectToPass = { id: props.data.workflowId, code: props.data.xmlCode };
    router.push(`/designer/editWorkflow?data=${encodeURIComponent(JSON.stringify(objectToPass))}`);
    handleClose();
  };

  const handleDelete = async() => {
    console.log('Edit clicked for:', props.data.workflowId);
    const result = await deleteDesignXml({
        variables: {
          id: props.data.workflowId,
        }
      })
      if(result){
        alert("Deleted Succesfully")
        router.push('/designer');
      }
    
    handleClose();
  };

  // ... rest of your OptionsRenderer code ...

  return (
    <div>
      <Button onClick={handleClick}>Options</Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleEdit}>Open Launchpad</MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      
      </Menu>
    </div>
  );
};

export default OptionsRenderer;