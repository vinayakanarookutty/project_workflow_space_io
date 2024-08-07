import dynamic from 'next/dynamic'

const EditWorkflow = dynamic(() => import('../../component/editWorkflow/editWorkflow'), { ssr: false })

export default EditWorkflow