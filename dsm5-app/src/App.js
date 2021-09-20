import './App.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import DSM5App from './DSM5App';
import Edit from './Edit';
import MyNode from './MyNode';



function App() {
  return (
    <Router>
      <div>
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
        </div>
      </Switch>
      </div>
    </Router>
  );
}

export default App;
