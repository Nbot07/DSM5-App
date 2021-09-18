import './App.css';
import React from 'react';
import axios from "axios";

// var express = require('express')
// var cors = require('cors')

// var app = express()

// //app.use(cors())

//var api = "http://localhost:8081"
class DSM5App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { items: [], text: '' };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    axios
      .get("http://localhost:8081/tree") //`${this.api}/tree`)
      .then((response) => this.setItems(response.data))
      .catch((error) => {
        console.error(error);
      });
  }

  setItems(data){
    data.forEach(tree => {console.log(tree)
      
    });
  }

  render() {
    return (
      <div>
        <h3>Trees</h3>
        <TreeList items={this.state.items} />
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="new-todo">
            Type in new tree name
          </label>
          <input
            id="new-todo"
            onChange={this.handleChange}
            value={this.state.text}
          />
          <button>
            Create Tree #{this.state.items.length + 1}
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
  }
}

class TreeList extends React.Component {
  render() {
    return (
      <ul>
        {this.props.items.map(item => (
          <li key={item.id}>{item.text}</li>
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
