import { useParams } from "react-router";

const MyNode = () => {
    const { id } = useParams();
    return ( 
        <h1>Node Page for node #{ id }</h1>
     );
}
 
export default MyNode;