import React from 'react';
import AvatarContainer from './components/avatar/AvatarContainer';

const dummyState = {
  avatars: [
    { "src": "assets/images/avatar1.png", "label": "Avatar 1", "id": 1 },
    { "src": "assets/images/avatar2.png", "label": "Avatar 2", "id": 2 },
    { "src": "assets/images/avatar3.png", "label": "Avatar 3", "id": 3 },
    { "src": "assets/images/avatar4.png", "label": "Avatar 4", "id": 4 },
    { "src": "assets/images/avatar5.png", "label": "Avatar 5", "id": 5 },
    { "src": "assets/images/avatar6.png", "label": "Avatar 6", "id": 6 },
  ]
}

class App extends React.Component {
  render() {
    return (
      <main>
        <AvatarContainer avatars={dummyState.avatars} />
      </main>
    );
  }
}


export default App;
