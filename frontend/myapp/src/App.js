
import './App.css';

import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Begin from './files/Begin';
import RegisterTourist from './files/registerTourist';
import RegisterTourGuide from './files/RegisterTourGuide';


function App() {
  return (
    <div className="App">

    <BrowserRouter> 
      <Routes>
        <Route path="/" element={<Begin />} />  {/* Set Begin.jsx as the default page */}
        <Route path="/addTourist" element={<RegisterTourist/>}/>
        <Route path="/addUnregisteredTourGuide" element={<RegisterTourGuide/>}/>
       
       
      </Routes>
    </BrowserRouter>
      </div>
   
    
  );
}

export default App;
