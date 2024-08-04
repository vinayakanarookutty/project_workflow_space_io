"use client";
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import BPMNDiagram from '../../component/bpmn/bpmn';
import { useMutation } from '@apollo/client';

import { CREATE_DESIGN } from 'client/app/api/design/mutations';
const bpmnXML = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="Process_1" isExecutable="false">
    <bpmn:startEvent id="StartEvent_1" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
        <dc:Bounds x="173" y="102" width="36" height="36" />
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;

// Mock data for dropdowns
const categories = ['Category 1', 'Category 2', 'Category 3'];
const forms = ['Form 1', 'Form 2', 'Form 3'];
const projects = ['Project 1', 'Project 2', 'Project 3', 'Project 4'];

export default function CreateWorkFlow() {
 
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [bpmnModeler, setBpmnModeler] = useState<any>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const router = useRouter();
  
  interface FormData {
    created: string; // ISO string representation of a date
    xmlCode: string;
    workflowName: string;
    description: string;
    workflowId:string;
    category: string;
    processMap: string;
    formSelection: string;
    addToProject: string[]; // Array of strings
  }
  
 
  const [formData, setFormData] = useState<FormData>({
    created: new Date().toISOString(), // Sets the current timestamp
    xmlCode: '',
    workflowName: '',
    workflowId:'',
    description: '',
    category: '',
    processMap: 'form',
    formSelection: '',
    addToProject: []
  });

  useEffect(() => {
    console.log('Component mounted');
  }, []);
  
  useEffect(() => {
    console.log('bpmnModeler changed:', bpmnModeler);
  }, [bpmnModeler]);

  const [createDesign, { data, error, loading }] = useMutation(CREATE_DESIGN);
  
  const handlePublish = useCallback(async () => {
    console.log('Publish button clicked');
    console.log('bpmnModeler in handlePublish:', bpmnModeler);
    
    if (bpmnModeler && typeof bpmnModeler.getXML === 'function') {
      try {
        console.log('About to call getXML');
        const result = await bpmnModeler.getXML();
        console.log('Raw result from getXML:', result);
        
        let xml;
        if (typeof result === 'string') {
          xml = result;
        } else if (result && typeof result === 'object') {
          xml = result.xml;
        }
        
        console.log('Extracted XML:', xml);
        
        if (!xml) {
          throw new Error('Failed to extract XML from the modeler');
        }
        const input = {
          created: formData.created,
          xmlCode: xml,  // Ensure you are using the XML string retrieved
          workflowName: formData.workflowName,
          description: formData.description,
          workflowId:"",
          category: formData.category,
          processMap: formData.processMap,
          formSelection: formData.formSelection,
          addToProject: formData.addToProject,
        };
        console.log("Input",input)
  
        // Call the mutation
        const response = await createDesign({ variables: { input } });
  
        if (response.errors) {
          console.error('GraphQL errors:', response.errors);
          alert('Failed to save diagram due to GraphQL errors.');
        } else {
          alert('Diagram saved successfully!');
          router.push('/designer');
        }
      } catch (error) {
        console.error('Error saving diagram:', error);
        alert('Failed to save diagram. Please try again.');
      }
    } else {
      console.error('BPMN modeler is not available or getXML is not a function');
      alert('The diagram is not ready yet. Please try again in a moment.');
    }
  }, [bpmnModeler, formData, createDesign, router]);

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Form submitted:', formData);
    setFormSubmitted(true);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  return (
    <div style={{ paddingLeft: "2%", paddingTop: "2%" }}>
      {!formSubmitted ? (
        <form onSubmit={handleFormSubmit}>
          <TextField
            name="workflowName"
            label="Workflow Name (#)"
            value={formData.workflowName}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            name="description"
            label="Description"
            value={formData.description}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            multiline
            rows={4}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={formData.category}
              label="Category"
              onChange={handleInputChange}
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>{category}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl component="fieldset" margin="normal">
            <FormLabel component="legend">Process Map</FormLabel>
            <RadioGroup
              name="processMap"
              value={formData.processMap}
              onChange={handleInputChange}
            >
              <FormControlLabel value="form" control={<Radio />} label="Form" />
              <FormControlLabel value="document" control={<Radio />} label="Document" />
            </RadioGroup>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <Autocomplete
              options={forms}
              renderInput={(params) => <TextField {...params} label="Form Selection" />}
              onChange={(event, newValue) => {
                setFormData(prevData => ({
                  ...prevData,
                  formSelection: newValue as string
                }));
              }}
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <Autocomplete
              multiple
              options={projects}
              renderInput={(params) => <TextField {...params} label="Add to Project" />}
              renderTags={(value: string[], getTagProps) =>
                value.map((option: string, index: number) => (
                  <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                ))
              }
              onChange={(event, newValue) => {
                setFormData(prevData => ({
                  ...prevData,
                  addToProject: newValue
                }));
              }}
            />
          </FormControl>
          <Button type="submit" variant="contained" color="primary" style={{ marginTop: '20px' }}>
            Create Workflow
          </Button>
        </form>
      ) : (
        <>
          <div style={{ display: "flex", gap: "2%" }}>
            <h3 style={{ marginTop: "1%" }}>Create a Diagram</h3>
            <Button
              sx={{ height: "100%", marginLeft: "50%" }}
              variant="outlined"
              onClick={handlePublish}
            >
              Publish
            </Button>
            <div>
              <Button
                variant="outlined"
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              >
                Option
              </Button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
                <MenuItem onClick={handleClose}>Logout</MenuItem>
              </Menu>
            </div>
            <Button sx={{ height: "100%" }} variant="outlined">Close</Button>
          </div>
          
          <BPMNDiagram bpmnXML={bpmnXML} setModeler={setBpmnModeler} />
        </>
      )}
    </div>
  );
}
