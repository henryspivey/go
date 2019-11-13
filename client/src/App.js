import React from "react";
import "./App.css";
import 'semantic-ui-css/semantic.min.css';
import { Container, Grid } from "semantic-ui-react";
import SurveyApp from "./SurveyApp";
import Survey from './Survey';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
function App() {
  return (    
    <Grid padded>
    	<Grid.Row>
    	<Grid.Column>	      
        <Router>
	        <Switch>
	          <Route path='/' exact component={SurveyApp} />
	          <Route path='/survey/:id' exact component={Survey} />
	        </Switch>
      	</Router>  
      </Grid.Column>	    
      </Grid.Row>      
    </Grid>    
  );
}

export default App;
