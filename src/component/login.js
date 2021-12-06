import { useState } from "react";
import { auth } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function LogIn() {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [mess, setMess] = useState('');
    const [show, setShow] = useState(false);
    const navigate = useNavigate();
    //Handle login firebase
    const AuthLogIn = async(e)=>{
        e.preventDefault();
        try{
            await auth.signInWithEmailAndPassword(email, pass);
            navigate('/home');
        }
        catch{
            setMess('Login failed!');
        }
        setShow(true);
    }
    return (
        <div>
            <Modal show={show} onHide={()=>setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h3 className="text-center">{mess}</h3>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={()=>setShow(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <Form className="mt-4 container p-3 mx-auto shadow-lg d-flex flex-column border border-3" style={{ maxWidth: '450px' }} onSubmit={AuthLogIn}>
                <h1 className="text-center">Log In</h1>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email: </Form.Label>
                    <Form.Control type="email" placeholder="Write your email ..." onChange={e => setEmail(e.target.value)} required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password: </Form.Label>
                    <Form.Control type="password" placeholder="Write your password ..." onChange={e => setPass(e.target.value)} required />
                </Form.Group>
                <Button className="text-center" variant="primary" type="submit">
                    Log in
                </Button>
                {/*<p className="text-center">*/}
                {/*    Create account? <Link to='/signup'>Sign up</Link>*/}
                {/*</p>*/}
                <p className="text-center">
                     <Link to='/forgot'>Forgot password?</Link>
                </p>
            </Form>
        </div>
    );
}
export default LogIn;
