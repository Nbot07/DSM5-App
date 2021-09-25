import { useParams } from "react-router";
import EditChart from "./edit-chart/edit-chart";

const Build = () => {
    const { name } = useParams();
    return ( 
        <>
        <h2>Build Page for { name } Tree</h2>
            <EditChart treeName={name}/>
        </>
     );
}
 
export default Build;