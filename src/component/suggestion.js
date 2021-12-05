import 'bootstrap/dist/css/bootstrap.min.css'
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { dummyData } from '../data/suggestProduct'
import { useEffect } from 'react'
import { auth } from '../firebase'
import { Col, Container, Row } from 'react-bootstrap'

export default function SuggestProduct() {
  const navigate = useNavigate()
  const location = useLocation()

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

  return (
    <div className="d-flex flex-column shadow-lg p-3 m-auto mt-5" style={{ maxWidth: '1200px' }}>
      <h1 className="text-center">Suggest Product</h1>
      <Container>
        <Row className="d-flex align-items-center mt-4">
          {data.map((product) => (
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
      </Container>
    </div>
  )
}
