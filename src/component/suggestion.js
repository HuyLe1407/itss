import 'bootstrap/dist/css/bootstrap.min.css'
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { dummyData } from '../data/suggestProduct'
import React, {useEffect, useState} from 'react'
import { auth } from '../firebase'
import { Col, Container, Row } from 'react-bootstrap'

export default function SuggestProduct() {
  const navigate = useNavigate()
  const location = useLocation()
  const [currentPage, setCurrentPage] = useState(1)
  const [postPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [pageNumber, setPageNumber] = useState([])
  const [dataProduct, setDataProduct] = useState([])
  let data = []
  if (location.state?.minAgeSuggest) {
    data = dummyData.filter((data) => data.minAgeSuggest >= location.state.minAgeSuggest)
  } else data = dummyData

  useEffect(() => {
    //Check user is logined
    auth.onAuthStateChanged((user) => {
      if (user !== null) {
      } else {
        navigate('/login')
      }
    })
  })
  useEffect(()=>{
    const pageNumber1 = []
    for (let i = 1; i <= Math.ceil(dataProduct.length / postPerPage); i++) {
      pageNumber1.push(i)
    }
    setPageNumber(pageNumber1);
  },[dataProduct])
  useEffect(()=>{
    let dataRcv = data
        .filter((val) => {
          if (searchTerm == '') {
            return val
          } else if (val.name.toLowerCase().includes(searchTerm.toLowerCase())) {
            return val
          }
        });
    setDataProduct(dataRcv);
  },[searchTerm])
  //get currentPost
  const indexofLast = currentPage * postPerPage
  const indexofFirst = indexofLast - postPerPage
  const currentPosts = dataProduct.slice(indexofFirst, indexofLast)
  const paginate = (pageNumber) => setCurrentPage(pageNumber)
  return (
    <div className="d-flex flex-column shadow-lg p-3 m-auto mt-5" style={{ maxWidth: '1200px' }}>
      <h1 className="text-center">おすすめ商品</h1>
      <input
          type="text"
          placeholder="検索 ...."
          onChange={(event) => {
            setSearchTerm(event.target.value)
          }}
      />
      <Container>
        <Row className="d-flex align-items-center mt-4">
          {currentPosts.map((product) => (
            <Col key={product.id} md={12} lg={6} className="d-flex align-items-center mb-4">
              <img src={product.image} alt="product" />
              <div className="d-flex flex-column" style={{ marginLeft: '16px' }}>
                <h2>{product.name}</h2>
                <h4>{product.price} $</h4>
                <p>Category: {product.type}</p>
              </div>
            </Col>
          ))}
        </Row>
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
      </Container>
    </div>
  )
}
