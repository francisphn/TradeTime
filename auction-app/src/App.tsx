// Import React
import React from 'react';

// Import CSS
import './App.css';

// Import React Router
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";

// Import components
import NotFound from "./components/home/NotFound";          // Page not found
import Registration from "./components/users/Registration"; // User Registration

function App() {
  return (
      <div className="App">

        <Router>
          <div>
            <Routes>

                // Homepage for app
                <Route path="home" />

                // User registration
                <Route path="register" element={<Registration/>}/>

                // Page not found
                <Route path="" element={<NotFound/>}/>


              {/*<Route path="users" element = {<Users/>}/>*/}
              {/*<Route path="/users/:id" element={<User/>}/>*/}

            </Routes>
          </div>
        </Router>

      </div>
  );
}

export default App;
