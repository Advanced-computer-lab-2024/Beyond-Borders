
import './App.css';

import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Begin from './files/Begin';
import RegisterTourist from './files/registerTourist';
import RegisterTourGuide from './files/RegisterTourGuide';
import RegisterSeller from './files/registerSeller';
import LoginTourist from './files/loginTourist';
import RegisterAdvertiser from './files/RegisterAdvertiser';
<<<<<<< Updated upstream
import LoginAdvertiser from './files/loginAdvertiser';
=======
import LoginTourGuide from './files/loginTourGuide';
>>>>>>> Stashed changes




function App() {
  return (
    <div className="App">

    <BrowserRouter> 
      <Routes>
        <Route path="/" element={<Begin />} />  {/* Set Begin.jsx as the default page */}
        <Route path="/addTourist" element={<RegisterTourist/>}/>
        <Route path="/addUnregisteredTourGuide" element={<RegisterTourGuide/>}/>
        <Route path="/addUnregisteredSeller" element={<RegisterSeller/>}/>
        <Route path="/loginTourist" element={<LoginTourist/>}/>
<<<<<<< Updated upstream
        <Route path="/loginAdvertiser" element={<LoginAdvertiser/>}/>
=======
        <Route path="/loginTourGuide" element={<LoginTourGuide/>}/>
>>>>>>> Stashed changes

        
        
        <Route path="addUnregisteredAdvertiser" element={<RegisterAdvertiser />} /> 
       
       
      </Routes>
    </BrowserRouter>
      </div>
   
    
  );
}

export default App;
