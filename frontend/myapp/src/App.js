import './App.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Begin from './files/Begin';
import RegisterTourist from './files/registerTourist';
import RegisterTourGuide from './files/RegisterTourGuide';
import RegisterSeller from './files/registerSeller';
import LoginTourist from './files/loginTourist';
import RegisterAdvertiser from './files/RegisterAdvertiser';
import LoginAdvertiser from './files/loginAdvertiser';
import LoginTourGuide from './files/loginTourGuide';
import HomePageAdvertiser from './files/HomePageAdvertiser'; // Import HomePageAdvertiser component
import LoginSeller from './files/loginSeller';
import Login from './files/login';
import LoginAdmin from './files/loginAdmin';
import LoginTourismGovernor from './files/loginTourismGovernor';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Begin />} />  {/* Set Begin.jsx as the default page */}
          <Route path="/addTourist" element={<RegisterTourist />} />
          <Route path="/addUnregisteredTourGuide" element={<RegisterTourGuide />} />
          <Route path="/addUnregisteredSeller" element={<RegisterSeller />} />
          <Route path="/loginTourist" element={<LoginTourist />} />
          <Route path="/loginAdvertiser" element={<LoginAdvertiser />} />
          <Route path="/loginTourGuide" element={<LoginTourGuide />} />
          <Route path="/homepageAdvertiser" element={<HomePageAdvertiser />} /> {/* Add HomePageAdvertiser route */}
          <Route path="/addUnregisteredAdvertiser" element={<RegisterAdvertiser />} />
          <Route path="/loginSeller" element={<LoginSeller/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/loginAdmin" element={<LoginAdmin/>}/>
          <Route path="/loginTourismGovernor" element={<LoginTourismGovernor/>}/>

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
