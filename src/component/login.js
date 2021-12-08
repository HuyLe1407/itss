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
            setMess('ログインに失敗しました！ もう一度やり直してください。');
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
                        クローズ
                    </Button>
                </Modal.Footer>
            </Modal>
            <Form className="mt-4 container p-3 mx-auto shadow-lg d-flex flex-column border border-3" style={{ maxWidth: '450px' }} onSubmit={AuthLogIn}>
                <h1 className="text-center">ログイン</h1>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>メール: </Form.Label>
                    <Form.Control type="email" placeholder="メールを入力してください" onChange={e => setEmail(e.target.value)} required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>パスワード: </Form.Label>
                    <Form.Control type="password" placeholder="パスワードを入力してください" onChange={e => setPass(e.target.value)} required />
                </Form.Group>
                <Button className="text-center" variant="primary" type="submit">
                    ログイン
                </Button>
                {/*<p className="text-center">*/}
                {/*    Create account? <Link to='/signup'>Sign up</Link>*/}
                {/*</p>*/}
                <p className="text-center">
                     <Link to='/forgot'>パスワードを忘れた？</Link>
                </p>
            </Form>
        </div>
    );
}
export default LogIn;
