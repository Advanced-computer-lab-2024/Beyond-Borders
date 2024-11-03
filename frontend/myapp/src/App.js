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
import TourismGovernorDashboard from './files/TourismGovernorDashboard ';
import MuseumTG from './files/MuseumTG';
import EditMuseum from './files/editMuseum';
import EditItinerary from './files/EditItinerary';
import CreateMuseum from './files/createMuseum';
import CreateItinerary from './files/CreateItinerary';
import HomePageTourGuide from './files/HomePageTourGuide';
import TouristHomePage from './files/Tourist/TouristHomePage';
import TouristProductModal from './files/Tourist/TouristProductModal';
import TouristActivitiesModal from './files/Tourist/TouristActivitiesModal';
import TouristMuseumsModal from './files/Tourist/TouristMuseumsModal';
import TouristItineraryModal from './files/Tourist/TouristItineraryModal';
import TouristHistoricalPlacesModal from './files/Tourist/TouristHistoricalPlacesModal';
import HistoricalPlaceTG from './files/HistoricalPlaceTG';
import CreateHistoricalPlace from './files/HistoricalPlace';
import EditHistoricalPlace from './files/EditHistoricalPlace';
import SellerHomePage from './files/Seller/SellerHomePage';

import HomePageAdmin from './files/Admin/HomePageAdmin';
import AdminProductModal from './files/Admin/AdminProductModal';
import AdminTagsModal from './files/Admin/AdminTagsModal';
import AdminDeleteAccount from './files/Admin/AdminDeleteAccount';
import AdminAddAdmin from './files/Admin/AdminAddAdmin';
import AdminAddGov from './files/Admin/AdminAddGov';
import AdminAddProduct from './files/Admin/AdminAddProduct';
import AdminActivityModal from './files/Admin/AdminActivityModal';

import HomePageGuest from './files/HomePageGuest';









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
          <Route path="/TourismGovernorDashboard" element={<TourismGovernorDashboard />} /> 
          <Route path="/addUnregisteredAdvertiser" element={<RegisterAdvertiser />} />
          <Route path="/loginSeller" element={<LoginSeller/>}/>
          <Route path="/MuseumTG" element={<MuseumTG/>}/>
          <Route path="/createMuseum" element={<CreateMuseum/>}/>
          <Route path="/CreateItinerary" element={<CreateItinerary/>}/>
          <Route path="/HomePageTourGuide" element={<HomePageTourGuide/>}/>




          <Route path="/HomePageAdmin" element={<HomePageAdmin/>}/>
          <Route path="/AdminProductModal" element={<AdminProductModal/>}/>
          <Route path="/AdminTagsModal" element={<AdminTagsModal/>}/>
          <Route path="/AdminActivityModal" element={<AdminActivityModal/>}/>
          <Route path="/AdminDeleteAccount" element={<AdminDeleteAccount/>}/>
          <Route path="/AdminAddAdmin" element={<AdminAddAdmin/>}/>
          <Route path="/AdminAddGov" element={<AdminAddGov/>}/>
          <Route path="/AdminAddProduct" element={<AdminAddProduct/>}/>
         





          <Route path="/EditMuseum" element={<EditMuseum/>}/>
          <Route path="/EditItinerary" element={<EditItinerary/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/loginAdmin" element={<LoginAdmin/>}/>
          <Route path="/loginTourismGovernor" element={<LoginTourismGovernor/>}/>
          <Route path="/touristHome" element={<TouristHomePage />} />
          <Route path="/touristProducts" element={<TouristProductModal closeModal={() => {}} />} />
          <Route path="/touristActivities" element={<TouristActivitiesModal closeModal={() => {}} />} />
          <Route path="/touristMuseums" element={<TouristMuseumsModal closeModal={() => {}} />} />
          <Route path="/touristItineraries" element={<TouristItineraryModal closeModal={() => {}} />} />
          <Route path="/touristHistorical" element={<TouristHistoricalPlacesModal closeModal={() => {}} />} />
          <Route path="/HistoricalPlaceTG" element={<HistoricalPlaceTG/>} />
          <Route path="/HistoricalPlace" element={<CreateHistoricalPlace />} />

          <Route path="/EditHistoricalPlace" element={<EditHistoricalPlace/>} />
          <Route path="/HomePageSeller" element={<SellerHomePage/>} />
          

          <Route path="/homeGuest" element={<HomePageGuest />} />


          
          

         
         




        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
