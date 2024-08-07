'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import BPMNDiagram from 'client/app/component/bpmn/bpmn'
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { UPDATE_DESIGN_XML } from 'client/app/api/design/mutations';
import { Button } from '@mui/material';
interface WorkflowData {
  id: string;
  code: string;
}

export default function EditWorkflow() {
    const router = useRouter();
  const searchParams = useSearchParams()
  const [workflowData, setWorkflowData] = useState<WorkflowData | null>(null)
  const [modeler, setModeler] = useState<any>(null)
  const [updateDesignXml, { data, loading, error }] = useMutation(UPDATE_DESIGN_XML);
  useEffect(() => {
    const data = searchParams.get('data')
    if (data) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(data)) as WorkflowData
        setWorkflowData(parsedData)
      } catch (error) {
        console.error('Failed to parse workflow data:', error)
      }
    }
  }, [searchParams])

  const handleSave = async () => {
    if (modeler) {
      try {
        const  xml  = await modeler.getXML();
        // Here you would typically send this XML to your backend
        console.log('Saved XML:', xml)
        // Update the workflowData state with the new XML
        setWorkflowData(prevData => prevData ? {...prevData, code: xml} : null)
        const result = await updateDesignXml({
            variables: {
              workflowId: workflowData?.id,
              input: {
                xmlCode: xml
              }
            }
          }).then(()=>{
            alert("Updated Succesfully")
            router.push('/designer');
          });
      } catch (err:any) {
        console.error('Error saving diagram:', err)
      }
    }
  }

  if (!workflowData) {
    return <div>Loading...</div>
  }

  return (
    <div>
        <div style={{display:"flex",gap:"62%"}}>
        <h1>Edit Workflow </h1>
        <Button style={{height:"10%",marginTop:"2%"}} variant="outlined" onClick={handleSave}>Save Changes</Button>
        </div>
     
      <BPMNDiagram 
        bpmnXML={workflowData.code} 
        setModeler={setModeler}
      />
      
     
    </div>
  )
}