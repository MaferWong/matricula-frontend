import './App.css';
import { ContainerMain } from './components/container/container';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Login } from './components/container/login/login';

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
        <Route exact path="/login" component={Login} />
        <Route path="/containers" component={ContainerMain} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
