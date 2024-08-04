"use client"

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import TextField from '@mui/material/TextField';
import { Box } from '../component/styles/box';
import Button from '@mui/material/Button';
import { useQuery } from '@apollo/client';
import Link from 'next/link';
import { GET_DESIGN } from '../api/design/queries';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import Menu from '@mui/material/Menu';
import { useRouter } from 'next/router';
import MenuItem from '@mui/material/MenuItem';
import OptionsRenderer from '../component/editModalBpmp/OptionsRenderer';

const BPMNDiagram = dynamic(() => import('../component/bpmn/bpmn'), {
  ssr: false
});

interface RowData {
  workflowName: string;
  category: string;
  created: string;
  description: string;
  processMap: string;
  formSelection: string[];
  addToProject: string[];
  workflowId: string;
  xmlCode: string;
}

const arrayRenderer = (params: { value: string[] }) => {
  return params.value ? params.value.join(', ') : '';
};

const dateRenderer = (params: { value: string }) => {
  return params.value ? new Date(params.value).toLocaleString() : '';
};

export default function Designer() {
  const { data, loading, error } = useQuery(GET_DESIGN);
  const router = useRouter();

  const serialNumberRenderer = (params: any) => {
    return params.node.rowIndex + 1;
  };

  const [columnDefs] = useState<ColDef<RowData>[]>([
    { 
      headerName: 'S.No', 
      cellRenderer: serialNumberRenderer,
      width: 80,
      sortable: false,
      filter: false
    },
    { field: 'workflowName', headerName: 'Workflow Name', sortable: true, filter: true },
    { field: 'category', sortable: true, filter: true },
    { field: 'created', headerName: 'Created Date', sortable: true, filter: true, cellRenderer: dateRenderer },
    { field: 'description', sortable: true, filter: true },
    { field: 'processMap', headerName: 'Process Map', sortable: true, filter: true },
    { field: 'formSelection', headerName: 'Form Selection', sortable: true, filter: true, cellRenderer: arrayRenderer },
    { field: 'addToProject', headerName: 'Added To Projects', sortable: true, filter: true, cellRenderer: arrayRenderer },
    {
      headerName: 'Options',
      cellRenderer: 'optionsRenderer',
      sortable: false,
      filter: false,
      width: 120
    }
  ]);

  const [rowData, setRowData] = useState<RowData[]>([]);

  useEffect(() => {
    if (data && data.getDesigns) {
      setRowData(data.getDesigns);
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Box style={{paddingLeft:"2%", paddingTop:"2%"}}>
      <h1>Work Flow List</h1>
      <Box style={{display:"flex", gap:"2%", marginBottom: "20px"}}>
        <TextField 
          sx={{width:"75%"}} 
          id="search" 
          label="Search" 
          variant="outlined"  
        />
        <Button variant="outlined">Import</Button>
        <Link href="/designer/createWorkflow">
          <Button sx={{height:"100%"}} variant="outlined">+WorkFlow</Button>
        </Link>
      </Box>

      <div className="ag-theme-alpine" style={{height: 600, width: '100%'}}>
        <AgGridReact<RowData>
          columnDefs={columnDefs}
          rowData={rowData}
          pagination={true}
          paginationPageSize={10}
          domLayout='autoHeight'
          frameworkComponents={{
            optionsRenderer: OptionsRenderer
          }}
        />
      </div>
    </Box>
  );
}