import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1>DSM5-App</h1>
      <div className="links">
        <Link to="/">Home</Link>
      </div>
    </nav>
  );
}
 
export default Navbar;