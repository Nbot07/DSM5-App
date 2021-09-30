import { useParams } from "react-router";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "./Api";

const MyNode = () => {

    const [root, setRoot] = useState({});
    const { treeName } = useParams();

    useEffect(() => {
        axios.get(api+"/tree/"+treeName)
        .then(response => {
          setRoot(response.data.root)
        })
        .catch(error => console.log(error))
    }, [])

    return ( 
        <>
        <h1>Node Page for node #{ root.name }</h1>
        <h2>Click view to move to a child node</h2>
        <ul>
        {root.children && root.children.map(child => (
          <li key={child.id}>
              {child.name + " "}
            <Link to= {"/node/"+child.id}>
              view
            </Link>
          </li>
        ))}
        </ul>
        <p>{ root.title }</p>
        </>
     );
}
 
export default MyNode;