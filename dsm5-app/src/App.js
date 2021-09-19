import './App.css';
import React from 'react';
import axios from "axios";

// var express = require('express')
// var cors = require('cors')

// var app = express()

// //app.use(cors())

var api = "http://localhost:8081"
class DSM5App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { items: [], text: '' };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this)
    axios
      .get(`${api}/tree`)
      .then((response) => this.initItems(response.data))
      .catch((error) => {
        console.error(error);
      });
  }

  initItems(data){
    data.forEach(tree => {
      const newItem = {
        text: tree.name,
        id: Date.now()
      }

      this.setState(state => ({
      items: state.items.concat(newItem),
      text: ''
    }))
      
    });
  }

  render() {
    return (
      <div>
        <h3>Trees</h3>
        <TreeList items={this.state.items} />
        <form>
          <label htmlFor="new-todo">
            Type in tree name
          </label>
          <input
            id="new-todo"
            onChange={this.handleChange}
            value={this.state.text}
          />
          <button onClick={this.handleSubmit}>
            Create Tree #{this.state.items.length + 1}
          </button>
          <button onClick={this.handleDelete}>
            Delete Tree
          </button>
        </form>
      </div>
    );
  }

  handleChange(e) {
    this.setState({ text: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.text.length === 0) {
      return;
    }
    const newItem = {
      text: this.state.text,
      id: Date.now()
    };
    this.setState(state => ({
      items: state.items.concat(newItem),
      text: ''
    }));

    axios.post(api + "/tree", {
      name:newItem.text
    })
    .then(resp => {
        console.log(resp.data);
        console.log("tree saved succesfully")
    })
    .catch(error => {
        console.log("error failed to save tree")
    })
  }

  handleDelete(e){
    e.preventDefault()
    var text = this.state.text
    axios.delete(api + "/tree/"+text,)
    .then(resp => {
      console.log(resp.data);
      console.log("tree deleted succesfully")
    })
    .catch(error => {
        console.log("error failed to delete tree")
    })
    window.location.reload();
  }
}

class TreeList extends React.Component {
  render() {
    return (
      <ul>
        {this.props.items.map(item => (
          <li key={item.id}>
            <a href= {api+"/tree/"+item.text}>
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    );
  }
}

function App() {
  return (
    <DSM5App />
  );
}

export default App;
