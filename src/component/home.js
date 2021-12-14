import 'bootstrap/dist/css/bootstrap.min.css'
import React, { useState, useEffect } from 'react'
import { Navbar, Table } from 'react-bootstrap'
import { auth, db } from '../firebase'
import { Link, useNavigate } from 'react-router-dom'
import { MdArticle } from 'react-icons/md'
import {Button} from "reactstrap";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setcurrentPage] = useState(1)
  const [postPerPage] = useState(10)
  const [users, setUsers] = useState([])
  const [dataProduct, setDataProduct] = useState([])
  const [pageNumber, setPageNumber] = useState([])

  const navigate = useNavigate()
  useEffect(() => {
    //Check user is logined
    auth.onAuthStateChanged((user) => {
      if (user != null) {
      } else {
        navigate('/login')
      }
    })
  }, [])

  useEffect(() => {
    const getUserFromFB = []
    db.collection('users')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          getUserFromFB.push({ ...doc.data(), key: doc.id })
        })
        setUsers(getUserFromFB)
      })
  }, [])
  useEffect(()=>{
    const pageNumber1 = []
    for (let i = 1; i <= Math.ceil(dataProduct.length / postPerPage); i++) {
      pageNumber1.push(i)
    }
    setPageNumber(pageNumber1);
  },[dataProduct])
  useEffect(()=>{
    let dataRcv = users
        .filter((val) => {
          if (searchTerm === '') {
            return val
          } else if (val.Name.toLowerCase().includes(searchTerm.toLowerCase())) {
            return val
          }
        });
    setDataProduct(dataRcv);
  },[searchTerm,users])
  //get currentPost
  const indexofLast = currentPage * postPerPage
  const indexofFirst = indexofLast - postPerPage
  const currentPosts = dataProduct.slice(indexofFirst, indexofLast)
  const paginate = (pageNumber) => setcurrentPage(pageNumber)
  return (
    <div className="home">
      <Navbar />
      <input
        type="text"
        placeholder="検索 ...."
        onChange={(event) => {
          setSearchTerm(event.target.value)
        }}
      />
      <Table striped bordered hover>
        <thead >
          <tr >
            <td>番号</td>
            <td>名前</td>
            <td>年齢</td>
            <td>性別</td>
            <td>場所</td>
            {/*<td>メール</td>*/}
            <td>電話番号</td>
            <td>おすすめ商品を見る</td>
          </tr>
        </thead>
        <tbody>
          {currentPosts
            .map((item, key) => (
              <tr key={key}>
                <td>{key+1}</td>
                <td>
                  {item.Name}
                </td>
                <td>{item.Age}</td>
                <td>{item.Gender}</td>
                <td>{item.Address}</td>
                {/*<td>{item.mail}</td>*/}
                <td>{item.PhoneNumber}</td>
                <td style={{}}>
                  <button onClick={() => navigate('/suggestion', { state: { minAgeSuggest: item.Age,Name:item.Name,ID:item.ID } })}>
                    <MdArticle />
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
      <nav>
        <ul className="pagination justify-content-center">
          {pageNumber.map((number) => (
            <li key={number} className="page-item">
              <a onClick={() => paginate(number)} className="page-link">
                {number}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
