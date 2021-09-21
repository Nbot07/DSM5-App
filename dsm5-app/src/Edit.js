import { useParams } from "react-router";
import DragDropChart from "./drag-drop-chart/drag-drop-chart";


const Edit = () => {
    const { name } = useParams();
    return ( 
        <>
        <h2>Edit Page for { name } Tree</h2>
        <h3>Click and drag to rearrange Tree</h3>
            <DragDropChart/>
        </>
     );
}
 
export default Edit;