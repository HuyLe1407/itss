import React, {Component, Fragment, useState} from 'react'
import {Link, useNavigate} from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import {Button, Form, Modal} from "react-bootstrap";
function ForgotPassword(){
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [mess, setMess] = useState('');
    const [show, setShow] = useState(false);
    const handlePasswordReset = async (e) => {
    e.preventDefault();
        try {
            const auth = getAuth();
            console.log(auth,email);
            await sendPasswordResetEmail(auth, email) .then(() => {
                setMess('Password reset email sent successfully')

            })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    setMess(error.message);
                    // ..
                });


        } catch (error) {

        }
        setShow(true);
    }
    return (
            <div>
                <Modal show={show} onHide={()=>{setShow(false);navigate('/login')}}>
                    <Modal.Header closeButton>
                        <Modal.Title></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h3 className="text-center">{mess}</h3>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={()=>{setShow(false);navigate('/login')}}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Form className="mt-4 container p-3 mx-auto shadow-lg d-flex flex-column border border-3" style={{ maxWidth: '450px' }} onSubmit={handlePasswordReset}>
                    <h1 className="text-center">Forgot Password</h1>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email: </Form.Label>
                        <Form.Control type="email" placeholder="Write your email ..." onChange={e => setEmail(e.target.value)} required />
                    </Form.Group>
                    <Button className="text-center" variant="primary" type="submit">
                        Send
                    </Button>
                    <p className="text-center">
                        <Link to='/login'>login</Link>
                        
                    </p>
                </Form>
            </div>
        )
}
export default ForgotPassword;
