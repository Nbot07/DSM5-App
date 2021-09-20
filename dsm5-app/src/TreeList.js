import { Link } from "react-router-dom";

const TreeList = ({items}) => {
    return ( 
        <ul>
        {items.map(item => (
          <li key={item.id}>
            <Link to= {"/Edit/"+item.text}>
              {item.text}
            </Link>
          </li>
        ))}
      </ul>
     );
}
 
export default TreeList;