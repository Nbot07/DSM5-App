import React, { useRef, useState, useEffect } from "react";
import JSONDigger from "json-digger";
import { v4 as uuidv4 } from "uuid";
import OrganizationChart from "../components/ChartContainer";
import "./edit-chart.css";
import axios from "axios";
import api from "../Api";

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
        if (!tree.root){
          console.log("The root node is "+tree.root)
          console.log(ds)
          console.log(ds.id)
        }
        else{
          var myNode = tree.root
          console.log("The root node is ")
          console.log(tree.root)
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
      // console.log("onNameChange(e.target.value, index) (" +
      // e.target.value + 
      // ", " + index + 
      // ")")
    newNodes[index].name = e.target.value;
    setNewNodes([...newNodes]);
  };

  const onTitleChange = (e, index) => {
    // console.log("onTitleChange(e.target.value, index) (" +
    //   e.target.value + 
    //   ", " + index + 
    //   ")")
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
      if (newNodes.length === 0){
        setNewNodes([{ name: "", title: "" }])
        return newNodes
      }
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
    if (typeof ds.id === "undefined") return;
    if ([...selectedNodes].length === 0 ) return;
    const nodes = getNewNodes()
    const parentId = [...selectedNodes][0].id
    console.log(parentId)
    //nodes.forEach(newNode => console.log("getNewNodes() name = "+ newNode.name + ", title = "+ newNode.title))
    await dsDigger.addChildren(parentId, nodes)
    setDS({ ...dsDigger.ds })

    axios.post(api+"/node/"+parentId, nodes)
    .then(response => {
      console.log("successfully saved child nodes") 
      console.log(response)
      //refresh to get database ids
      window.location.reload()
    })
    .catch(error => console.log(error))
  }

  const getParentId = (childId) => {
    console.log("childId = " +childId)
    var queue = [ds]
    while(queue.length > 0){
      const children = queue[0].children
      console.log("children = "+queue[0].children.name)
      queue.push(...children)
      //children.forEach(child => queue.push(child))
      console.log("children.length = "+children.length)
      for (let i = 0; i < children.length; i++){
        console.log("checking child "+children[i].id)
        if (children[i].id === childId) {return queue[0].id}
      }
      queue.shift()
    }
    return -1;
  }

  const addSiblingNodes = async () => {

    console.log("adding SiblingNodes")
    if (typeof ds.id === "undefined") return;
    if ([...selectedNodes].length === 0 ) return;
    const child = [...selectedNodes][0]
    const childId = child.id
    if (getParentId(childId) === -1) return;
    const newNodes = getNewNodes()

    await dsDigger.addSiblings(childId, newNodes);
    setDS({ ...dsDigger.ds });
    console.log({ ...dsDigger.ds })

    console.log("the parent of "+childId +" is "+ getParentId(childId))

    axios.post(api+"/node/"+getParentId(childId), newNodes)
    .then(response => {
      console.log("successfully saved sibling nodes") 
      console.log(response)
      // refresh to get database ids
      window.location.reload()
    })
    .catch(error => console.log(error))
  };

  const addRootNode = () => {

    console.log("adding RootNode")
    console.log(typeof ds.id)
    if (typeof ds.id !== "undefined") return;
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
      .then(() => {console.log("set root of "+ treeName+ "to Node "+ response.data)
        //refresh to get database ids
        window.location.reload()}
      )
      .catch(error => console.log(error))
      console.log("saved root node")
    })
    .catch(error => console.log(error))
  };

  const remove = async () => {

    console.log("calling remove")
    if (typeof ds.id === "undefined") return;
    if ([...selectedNodes].length === 0 ) return;
    console.log(selectedNodes )
    console.log(ds)
    console.log(ds.children)
    if (!ds) return;
    if (ds.children.length !== 0){
      var root = null
      selectedNodes.forEach(node => {
        if (node.id === ds.id) root = node;
      });

      if (root){
        //await dsDigger.removeNodes(root.id)
        setDS({})
        axios.delete(api+"/tree/root/"+treeName)
        .then(console.log("removed root node of "+treeName+" tree"))
        .catch(error => console.log(error))
      }else{
        await dsDigger.removeNodes([...selectedNodes].map(node => node.id));
        setDS({ ...dsDigger.ds });
        selectedNodes.forEach(node => {
          axios.delete(api+"/node/"+node.id)
          .then(console.log("removed nodes "+node.id))
          .catch(error => console.log(error))
      })}
    }else{
      setDS({})
      axios.delete(api+"/tree/root/"+treeName)
      .then(console.log("removed root node of "+treeName+" tree"))
      .catch(error => console.log(error))
    }

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
                    placeholder="description"
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
        draggable={true}
      />
    </div>
  );
};

export default EditChart;
