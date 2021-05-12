import React, { useState } from 'react';
import { Switch, Route } from 'react-router';
import BackTrackingVisualizer from './BackTracking/components/BackTrackingVisualizer';
import GraphVisualizer from './Graph/components/GraphVisualizer';
import GraphAdvancedVisualizer from './GraphAdvanced/components/GraphAdvancedVisualizer';
import Navigation from './Navigation/Navigation';
import RecursionVisualizer from './Recursion/components/RecursionVisualizer';
import SearchingVisualizer from './Searching/components/SearchingVisualizer';
import SortingVisualizer from './Sorting/components/SortingVisualizer';
function App() {
  return (
    <div>
      <Switch>
        <Route path="/" exact component={Navigation}></Route>
        <Route path="/sorting" component={SortingVisualizer}></Route>
        <Route path="/searching" component={SearchingVisualizer}></Route>
        <Route path="/graph" component={GraphVisualizer}></Route>
        <Route path="/backtracking" component={BackTrackingVisualizer}></Route>
        <Route path="/recursion" component={RecursionVisualizer}></Route>
        <Route
          path="/advanced-graph"
          component={GraphAdvancedVisualizer}
        ></Route>
      </Switch>
    </div>
  );
}

export default App;
