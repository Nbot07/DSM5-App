import React, { useRef, useState, useEffect } from "react";
import JSONDigger from "json-digger";
import { v4 as uuidv4 } from "uuid";
import OrganizationChart from "../components/ChartContainer";
import "./edit-chart.css";
import axios from "axios";
import { useParams } from "react-router";

var api = "http://localhost:8081"
const EditChart = ({treeName}) => {
  const orgchart = useRef();

  const datasource = {}
  const [ds, setDS] = useState(datasource);
  const dsDigger = new JSONDigger(ds, "id", "children");

  const [selectedNodes, setSelectedNodes] = useState(new Set());
  const [newNodes, setNewNodes] = useState([{ name: "", title: "" }]);
  const [isEditMode, setIsEditMode] = useState(true);
  const [isMultipleSelect, setIsMultipleSelect] = useState(false);

  console.log("treeName = "+ treeName )
  useEffect(() => {
    axios
    .get(`${api}/tree/`+treeName)
    .then((response) => { 
      console.log("getting tree in edit-chart")
      console.log(response)
      console.log(response.data)
      initItems(response.data)
    })
    .catch((error) => {
      console.error(error);
    });
  
    
  
    const initItems = (tree) => {
      console.log("tree.root = " + tree.root)
        if (!tree.root){ console.log("The root node is "+tree.root)}
        else{
          var myNode = tree.root
          myNode.children = []
          //Object.assign(datasource, myNode)
          setDS(myNode) //causes infinite loop
          // while(myNode !== null){
          //   axios
          //   .get(api+"/node/"+myNode.id)
          //   .then((response) => {
          //     if(response.data !== null){
          //       console.log(response.data.description)
          //     }
          //     myNode = response.data
          //   })
          //   .catch((error) => {
          //     console.error(error)
          //   })
          // }
        }
    }
  }, [])

  const readSelectedNode = nodeData => {
    console.log("reding selectedNode "+nodeData)
    if (isMultipleSelect) {
      setSelectedNodes(prev => new Set(prev.add(nodeData)));
    } else {
      setSelectedNodes(new Set([nodeData]));
    }
  };

  const clearSelectedNode = () => {
    console.log("clearing selected node")
    setSelectedNodes(new Set());
  };

  const onNameChange = (e, index) => {
    console.log("onNameChange(e.target.value, index) (" +
      e.target.value + 
      ", " + index + 
      ")")
    newNodes[index].name = e.target.value;
    setNewNodes([...newNodes]);
  };

  const onTitleChange = (e, index) => {
    console.log("onTitleChange(e.target.value, index) (" +
      e.target.value + 
      ", " + index + 
      ")")
    newNodes[index].title = e.target.value;
    setNewNodes([...newNodes]);
  };

  const addNewNode = () => {
    console.log("adding newNodes")
    setNewNodes(prevNewNodes => [...prevNewNodes, { name: "", title: "" }]);
  };

  const removeNewNode = index => {
    console.log("removing newNode " + index)
    setNewNodes(prevNewNodes => {
      prevNewNodes.splice(index, 1);
      return [...prevNewNodes];
    });
  };

  const getNewNodes = () => {
    console.log("getting newNodes")
    const nodes = [];
    for (const node of newNodes) {
      nodes.push({ ...node, id: uuidv4() });
    }
    return nodes;
  };

  const addChildNodes = async () => {
    console.log("adding ChildNodes")
    await dsDigger.addChildren([...selectedNodes][0].id, getNewNodes());
    setDS({ ...dsDigger.ds });
  };

  const addSiblingNodes = async () => {
    console.log("adding SiblingNodes")
    await dsDigger.addSiblings([...selectedNodes][0].id, getNewNodes());
    setDS({ ...dsDigger.ds });
  };

  const addRootNode = () => {
    console.log("adding RootNode")
    dsDigger.addRoot(getNewNodes()[0]);
    setDS({ ...dsDigger.ds });
    console.log({...dsDigger.ds})
    console.log({...dsDigger.ds}.name)
    console.log({...dsDigger.ds}.title)
    axios
    .post(api+"/node",{name:{...dsDigger.ds}.name, "title":{...dsDigger.ds}.title })
    .then(response =>{ 
      console.log(response.data)
      axios.post(api+"/tree/"+treeName+"/"+response.data)
      .then(console.log("set root of "+ treeName+ "to Node "+ response.data))
      .catch(error => console.log(error))
      console.log("saved root node")
    })
    .catch(error => console.log(error))
  };

  const remove = async () => {
    console.log("calling remove")
    await dsDigger.removeNodes([...selectedNodes].map(node => node.id));
    setDS({ ...dsDigger.ds });
    setSelectedNodes(new Set());
  };

  const onMultipleSelectChange = e => {
    console.log("onMultipleSelectChange")
    setIsMultipleSelect(e.target.checked);
  };

  const onModeChange = e => {
    console.log("onModeChange")
    setIsEditMode(e.target.checked);
    if (e.target.checked) {
      orgchart.current.expandAllNodes();
    }
  };

  return (
    <div className="edit-chart-wrapper">
      <section className="toolbar">
        <div className="selected-nodes">
          <div>
            <h4 style={{ display: "inline-block" }}>Selected Node</h4>
            <input
              style={{ marginLeft: "1rem" }}
              id="cb-multiple-select"
              type="checkbox"
              checked={isMultipleSelect}
              onChange={onMultipleSelectChange}
            />
            <label htmlFor="cb-multiple-select">Multiple Select</label>
          </div>
          <ul>
            {Array.from(selectedNodes).map(node => (
              <li key={node.id}>
                {node.name} - {node.title}
              </li>
            ))}
          </ul>
        </div>
        <div className="new-nodes">
          <h4>New Nodes</h4>
          <ul>
            {newNodes &&
              newNodes.map((node, index) => (
                <li key={index}>
                  <input
                    type="text"
                    placeholder="name"
                    value={node.name}
                    onChange={e => onNameChange(e, index)}
                  />
                  <input
                    type="text"
                    placeholder="title"
                    value={node.title}
                    onChange={e => onTitleChange(e, index)}
                  />
                  {newNodes.length === 1 || index === newNodes.length - 1 ? (
                    <button disabled={!isEditMode} onClick={addNewNode}>
                      +
                    </button>
                  ) : (
                    <button
                      disabled={!isEditMode}
                      onClick={() => removeNewNode(index)}
                    >
                      -
                    </button>
                  )}
                </li>
              ))}
          </ul>
        </div>
        <div className="action-buttons">
          <button disabled={!isEditMode} onClick={addChildNodes}>
            Add Child Nodes
          </button>
          <button disabled={!isEditMode} onClick={addSiblingNodes}>
            Add Sibling Nodes
          </button>
          <button disabled={!isEditMode} onClick={addRootNode}>
            Add Root Node
          </button>
          <button disabled={!isEditMode} onClick={remove}>
            Remove Nodes
          </button>
          <input
            style={{ marginLeft: "1rem" }}
            id="cb-mode"
            type="checkbox"
            checked={isEditMode}
            onChange={onModeChange}
          />
          <label htmlFor="cb-mode">Edit Mode</label>
        </div>
      </section>
      <OrganizationChart
        ref={orgchart}
        datasource={ds}
        collapsible={!isEditMode}
        multipleSelect={isMultipleSelect}
        onClickNode={readSelectedNode}
        onClickChart={clearSelectedNode}
      />
    </div>
  );
};

export default EditChart;
