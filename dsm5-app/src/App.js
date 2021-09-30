import './App.css';
import { Switch, Route} from 'react-router-dom'
import DSM5App from './DSM5App';
import RootNodeView from './RootNodeView';
import Build from './Build';
import Navbar from './Navbar';
import NodeView from './NodeView';

function App() {
  return (
    
      <div>
        <Navbar/>
      <Switch>
        <div>
        <Route exact path="/">
          <DSM5App/>
        </Route>
        <Route path="/node/:id" component={NodeView}/>
        <Route path="/root/:treeName">
          <RootNodeView/>
        </Route>
        <Route path="/build/:name">
          <Build/>
        </Route>
        </div>
      </Switch>
      </div>
    
  );
}

export default App;
