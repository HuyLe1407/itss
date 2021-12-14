import 'bootstrap/dist/css/bootstrap.min.css'
import { useNavigate, useLocation } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { auth, db } from '../firebase'
import { Col, Container, Row } from 'react-bootstrap'

const postPerPage = 6

export default function SuggestProduct() {
  const navigate = useNavigate()
  const location = useLocation()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [pageNumber, setPageNumber] = useState([])
  const [dataProduct, setDataProduct] = useState([])
  const [dataProductID, setDataProductID] = useState([])
  const [renderData, setRenderData] = useState([])

  useEffect(() => {
    const productsData = []
    const productMapData = []
    db.collection('products')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          productsData.push({ ...doc.data(), key: doc.id })
        })
        setDataProduct(productsData)
      })
    db.collection('productSuggestions')
        .where("CustomerID","==",location.state.ID)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            console.log(doc.data().ProductID);
            productMapData.push(doc.data().ProductID);
          })
          setDataProductID(productMapData);

        })

  }, [])

  useEffect(() => {
    if (dataProductID.length>0) {
      console.log(dataProductID)
      setRenderData(dataProduct.filter((data) => dataProductID.includes(data.key)))
    } else setRenderData(dataProduct)
    console.log("121",dataProductID,dataProduct,renderData)
  }, [dataProduct,dataProductID])

  useEffect(() => {
    //Check user is logined
    auth.onAuthStateChanged((user) => {
      if (user !== null) {
      } else {
        navigate('/login')
      }
    })
  })

  useEffect(() => {
    const pageNumber1 = []
    for (let i = 1; i <= Math.ceil(renderData.length / postPerPage); i++) {
      pageNumber1.push(i)
    }
    setPageNumber(pageNumber1)
  }, [renderData])

  useEffect(() => {
    let dataRcv = dataProduct.filter((val) => {
      if (searchTerm === '') {
        return val
      } else if (val.productName.toLowerCase().includes(searchTerm.toLowerCase())) {
        return val
      }
    })
    setRenderData(dataRcv)
  }, [searchTerm])

  //get currentPost
  const indexofLast = currentPage * postPerPage
  const indexofFirst = indexofLast - postPerPage
  const currentPosts = renderData.slice(indexofFirst, indexofLast)
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  return (
    <div className="d-flex flex-column shadow-lg p-3 m-auto mt-5" style={{ maxWidth: '1200px' }}>
      <h1 className="text-center">{location.state.Name}さんためのおすすめ商品のリストはこちら
      </h1>
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
            <Col key={product.key} md={12} lg={6} className="d-flex align-items-center mb-4">
              <img src={product.image} alt="product" />
              <div className="d-flex flex-column" style={{ marginLeft: '16px' }}>
                <h2>{product.productName}</h2>
                <h4>{product.productPrice} $</h4>
                <p>Category: {product.productNumber}</p>
              </div>
            </Col>
          ))}
        </Row>
        <nav>
          <ul className="pagination justify-content-center">
            {pageNumber.map((number) => (
              <li key={number} className="page-item">
                <button onClick={() => paginate(number)} className="page-link">
                  {number}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </div>
  )
}
