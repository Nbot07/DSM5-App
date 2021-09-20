import { useParams } from "react-router";
import EditChart from "./edit-chart/edit-chart";

const Edit = () => {
    const { name } = useParams();
    return ( 
        <>
        <h2>Edit Page for { name } Tree</h2>
            <EditChart/>
        </>
     );
}
 
export default Edit;