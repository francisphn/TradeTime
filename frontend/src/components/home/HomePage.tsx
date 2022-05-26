import {Link} from "react-router-dom";

const HomePage = () => {
    return (
        <div>
            <h1>Welcome!</h1>
            <Link to={"/register"}>Register</Link>
        </div>
    )
}

export default HomePage;