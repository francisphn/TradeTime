// Import React
import React from 'react';

// Import CSS
import './App.css';

// Import React Router
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";

// Import components
import NotFound from "./components/home/NotFound";          // Page not found

import Login from "./components/users/Login";
import HomePage from "./components/home/HomePage";
import SignUp from "./components/users/SignUp";
import Title from "./components/Title";
import User from "./components/users/User";
import CreateAuction from "./components/auctions/CreateAuction";

import Auctions from "./components/auctions/Auctions"
import EditUser from "./components/users/EditUser";
import Auction from "./components/auctions/Auction";

function App() {
  return (
      <div className="App">
        <Title/>
        <Router>
          <div>
            <Routes>

                // Homepage for app
                <Route path="home" element={<Auctions/>}/>

                <Route path={"404"} element={<NotFound/>}/>

                // User registration
                <Route path="register" element={<SignUp/>}/>

                // Page not found
                <Route path="" element={<Auctions/>}/>

                // User login
                <Route path={"login"} element={<Login/>} />

                // User ID
                <Route path="/users/:id" element={<User/>}/>

                // User ID
                <Route path="/users/manage" element={<User/>}/>

                // Auction
                <Route path="/auctions/:id" element={<Auction/>}/>

                // User create auction
                <Route path="/auctions/create" element={<CreateAuction/>}/>

                // All Auctions
                <Route path={"/auctions"} element={<Auctions/>} />

                // User edit their own profile
                <Route path="/users/edit" element={<EditUser/>}/>

              {/*<Route path="users" element = {<Users/>}/>*/}


            </Routes>
          </div>
        </Router>

      </div>
  );
}

export default App;
