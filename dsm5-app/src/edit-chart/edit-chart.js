import React, { useRef, useState } from "react";
import JSONDigger from "json-digger";
import { v4 as uuidv4 } from "uuid";
import OrganizationChart from "../components/ChartContainer";
import "./edit-chart.css";
import axios from "axios";
import { useParams } from "react-router";

var api = "http://localhost:8081"
const EditChart = () => {
  const { name } = useParams();
  const orgchart = useRef();
  axios
  .get(`${api}/tree/`+name)
  .then((response) => initItems(response.data))
  .catch((error) => {
    console.error(error);
  });

  const initItems = (tree) => {
    console.log("tree.root = " + tree.root)
      if (tree.root === null){}
      else{
        var myNode = tree.root
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

  const datasource = {}
  // const datasource = {
  //   id: "n1",
  //   name: "Lao Lao",
  //   title: "general manager",
  //   children: [
  //     { id: "n2", name: "Bo Miao", title: "department manager" },
  //     {
  //       id: "n3",
  //       name: "Su Miao",
  //       title: "department manager",
  //       children: [
  //         { id: "n4", name: "Tie Hua", title: "senior engineer" },
  //         {
  //           id: "n5",
  //           name: "Hei Hei",
  //           title: "senior engineer",
  //           children: [
  //             { id: "n6", name: "Dan Dan", title: "engineer" },
  //             { id: "n7", name: "Xiang Xiang", title: "engineer" }
  //           ]
  //         },
  //         { id: "n8", name: "Pang Pang", title: "senior engineer" }
  //       ]
  //     },
  //     { id: "n9", name: "Hong Miao", title: "department manager" },
  //     {
  //       id: "n10",
  //       name: "Chun Miao",
  //       title: "department manager",
  //       children: [{ id: "n11", name: "Yue Yue", title: "senior engineer" }]
  //     }
  //   ]
  // }


  const [ds, setDS] = useState(datasource);
  const dsDigger = new JSONDigger(ds, "id", "children");

  const [selectedNodes, setSelectedNodes] = useState(new Set());
  const [newNodes, setNewNodes] = useState([{ name: "", title: "" }]);
  const [isEditMode, setIsEditMode] = useState(true);
  const [isMultipleSelect, setIsMultipleSelect] = useState(false);

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
      console.log(response)
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
