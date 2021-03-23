import React, { useContext } from "react";
import { UserContext } from "./UserContext";

const About = () => {
    const msg = useContext(UserContext);
    return (
        <div>
            <h1>About</h1>
            <p>{msg}</p>
        </div>
    );
};

export default About;
