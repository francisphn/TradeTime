// Import React
import React from 'react';

// Import CSS
import './App.css';

// Import React Router
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";

// Import components
import NotFound from "./components/home/NotFound";          // Page not found
import Registration from "./components/users/Registration";
import Login from "./components/users/Login";
import HomePage from "./components/home/HomePage";
import SignUp from "./components/users/SignUp"; // User Registration

function App() {
  return (
      <div className="App">

        <Router>
          <div>
            <Routes>

                // Homepage for app
                <Route path="home" element={<HomePage/>}/>

                <Route path={"404"} element={<NotFound/>}/>

                // User registration
                <Route path="register" element={<SignUp/>}/>

                // Page not found
                <Route path="" element={<HomePage/>}/>

                // User login
                <Route path={"login"} element={<Login/>} />


              {/*<Route path="users" element = {<Users/>}/>*/}
              {/*<Route path="/users/:id" element={<User/>}/>*/}

            </Routes>
          </div>
        </Router>

      </div>
  );
}

export default App;
