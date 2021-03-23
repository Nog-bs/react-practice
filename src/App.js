import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Home from "./Home";
import About from "./About";
import { UserContext } from "./UserContext";

const App = () => {
    return (
        <Router>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/about">About</Link>
                    </li>
                </ul>
            </nav>
            <UserContext.Provider value="bonjour">
                <Route path="/about" component={About} />
                <Route path="/" exact component={Home} />
            </UserContext.Provider>
        </Router>
    );
};

export default App;
