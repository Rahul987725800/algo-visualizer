import React, { useState } from 'react';
import BackTrackingVisualizer from './BackTracking/components/BackTrackingVisualizer';
import GraphVisualizer from './Graph/components/GraphVisualizer';
import RecursionVisualizer from './Recursion/components/RecursionVisualizer';
import SearchingVisualizer from './Searching/components/SearchingVisualizer';
import SortingVisualizer from './Sorting/components/SortingVisualizer';

function App() {
  const [activeVisualizer, setActiveVisualizer] = useState('recursion');
  const visualizer = () => {
    switch (activeVisualizer) {
      case 'sorting':
        return <SortingVisualizer />;
      case 'searching':
        return <SearchingVisualizer />;
      case 'graph':
        return <GraphVisualizer />;
      case 'backtrack':
        return <BackTrackingVisualizer />;
      case 'recursion':
        return <RecursionVisualizer />;
      default:
        return <div></div>;
    }
  };
  return (
    <div>
      <div onClick={() => setActiveVisualizer('sorting')}>
        Sorting Algorithms
      </div>
      <div onClick={() => setActiveVisualizer('searching')}>
        Searching Algorithms
      </div>
      <div onClick={() => setActiveVisualizer('graph')}>Graph Algorithms</div>
      <div onClick={() => setActiveVisualizer('backtrack')}>
        BackTracking Algorithms
      </div>
      <div onClick={() => setActiveVisualizer('recursion')}>
        Recursion Algorithms
      </div>
      {visualizer()}
    </div>
  );
}

export default App;
