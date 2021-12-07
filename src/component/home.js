import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

export default function Home(){
    return(
        <div className="d-flex flex-column shadow-lg p-3 m-auto mt-5" style={{maxWidth:'500px'}}>
            <h1 className="text-center">Please select an option: </h1>
            <Link className="btn btn-info m-1" to='/login'>Log In</Link>
            <Link className="btn btn-primary m-1" to='/signup'>Sign Up</Link>
        </div>
    );
}