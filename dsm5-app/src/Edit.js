import { useParams } from "react-router";

const Edit = () => {
    const { name } = useParams();
    return ( 
        <h1>Edit Page for { name }</h1>
     );
}
 
export default Edit;