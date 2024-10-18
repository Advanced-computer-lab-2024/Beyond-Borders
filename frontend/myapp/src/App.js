
import './App.css';

import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Begin from './files/Begin';

function App() {
  return (
    <div className="App">

<BrowserRouter> 
<Routes>
        <Route path="/" element={<Begin />} />  {/* Set Begin.jsx as the default page */}
       
      </Routes>
      </BrowserRouter>
      </div>
   
    
  );
}

export default App;
