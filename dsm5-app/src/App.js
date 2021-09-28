import './App.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import DSM5App from './DSM5App';
import Edit from './Edit';
import MyNode from './MyNode';
import Build from './Build';
import Navbar from './Navbar';



function App() {
  return (
    <Router>
      <div>
        <Navbar/>
      <Switch>
        <div>
        <Route exact path="/">
          <DSM5App/>
        </Route>
        <Route path="/edit/:name">
          <Edit/>
        </Route>
        <Route path="/node/:id">
          <MyNode/>
        </Route>
        <Route path="/build/:name">
          <Build/>
        </Route>
        </div>
      </Switch>
      </div>
    </Router>
  );
}

export default App;
