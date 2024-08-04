import React, { useEffect, useRef } from 'react';
import Modeler from 'bpmn-js/lib/Modeler';
import Canvas from 'diagram-js/lib/core/Canvas';
interface BPMNDiagramProps {
  bpmnXML: string;
  setModeler: React.Dispatch<React.SetStateAction<any>>;
}

const BPMNDiagram: React.FC<BPMNDiagramProps> = ({ bpmnXML, setModeler }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('BPMNDiagram mounted');
    if (!containerRef.current) {
      console.log('containerRef.current is null');
      return;
    }

    console.log('Creating new Modeler');
    const modeler = new Modeler({
      container: containerRef.current
    });

    const displayDiagram = async () => {
      try {
        console.log('Importing XML');
        await modeler.importXML(bpmnXML);
        const canvas:Canvas = modeler.get('canvas');
        canvas.zoom('fit-viewport');
        console.log('XML imported successfully');
      } catch (err) {
        console.error('Error displaying BPMN diagram', err);
      }
    };

    displayDiagram();

    setModeler({
      getXML: async () => {
        console.log('getXML called');
        const { xml } = await modeler.saveXML({ format: true });
        return xml;
      }
    });

    return () => {
      console.log('Destroying modeler');
      modeler.destroy();
    };
  }, [bpmnXML, setModeler]);

  return <div ref={containerRef} style={{ width: '100%', height: '500px' }} />;
};

export default BPMNDiagram;