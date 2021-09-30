import { Link } from "react-router-dom";

const TreeList = ({items}) => {
  return ( 
      <ul>
      {items.map(item => (
        <li key={item.id}>
            {item.text + " "}
          <Link to= {"/root/"+item.text}>
            view{" "}
          </Link>
              |
          <Link to= {"/build/"+item.text}>
              {" "}build
          </Link>
        </li>
      ))}
    </ul>
    );
}
 
export default TreeList;