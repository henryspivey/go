import React from "react";
import "./App.css";
import "semantic-ui-css/semantic.min.css";
import { Grid } from "semantic-ui-react";
import SurveyApp from "./SurveyApp";
import Survey from "./Survey";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

function NotFound() {
  return (
    <div>
      <h1>Sorry, can’t find that.</h1>
    </div>
  );
}

function App() {
  return (
    <Grid padded>
      <Grid.Row>
        <Grid.Column>
          <Router>
            <Switch>
              <Route exact path="/" component={SurveyApp} />
              <Route exact path="/survey/:id" component={Survey} />
              <Route component={NotFound} />
            </Switch>
          </Router>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}

export default App;
