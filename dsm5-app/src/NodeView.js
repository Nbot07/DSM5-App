import { useParams } from "react-router";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "./Api";

const NodeView = () => {
    const [node, setNode] = useState({})
    const { id } = useParams();

    useEffect(() => {
        axios.get(api+"/node/"+id)
        .then(response => {
          setNode(response.data)
        })
        .catch(error => console.log(error))
    }, [])

    return ( 
        <>
        <h1>Node Page for node #{ node.name }</h1>
        <h2>Click view to move to a child node</h2>
        <ul>
        {node.children && node.children.map(child => (
          <li key={child.id}>
              {child.name + " "}
            <a href={"/node/"+child.id}>
              view
            </a>
          </li>
        ))}
        </ul>
        <p>{ node.title }</p>
        </>
     );
}
 
export default NodeView;