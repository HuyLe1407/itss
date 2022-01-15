import 'bootstrap/dist/css/bootstrap.min.css'
import { useNavigate, useLocation } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { auth, db } from '../firebase'
import {Carousel, Col, Container, Row} from 'react-bootstrap'
import {categoryName, dataProducts, dataTag} from "./Data";

const postPerPage = 4
const postPerPageTotal = 6
export default function SuggestProduct() {
  const navigate = useNavigate()
  const location = useLocation()
  const [currentPage, setCurrentPage] = useState(1)
  const [currentPageTotal, setCurrentPageTotal] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchCategory, setSearchCategory] = useState('')
  const [pageNumber, setPageNumber] = useState([])
  const [pageNumberTotal, setPageNumberTotal] = useState([])
  const [dataProduct, setDataProduct] = useState([])
  const [category, setCategory] = useState({})
  const [renderData, setRenderData] = useState([])
  const [renderDataTotal, setRenderDataTotal] = useState([])
  const [tag, getTag] = useState([])

  useEffect(() => {
        setDataProduct(dataProducts)
      setCategory(categoryName)
    const tagData = []

          getTag(dataTag)
  }, [])

  useEffect(() => {
    if (tag.length>0) {
      setRenderData(dataProduct.filter((data) =>checkData(data)))
    } else setRenderData(dataProduct)
  }, [dataProduct,tag])
    useEffect(() => {
        setRenderDataTotal(dataProduct)
    }, [dataProduct])
 const checkData = (data) =>{
    let check = false
   tag.map(i=>{
     if(i.TagName == data.Tag){
       console.log(parseInt(location.state.minAgeSuggest),parseInt(i.MinAge) ,parseInt(i.MaxAge),location.state.Gender,i.Gender )
       if(parseInt(location.state.minAgeSuggest)>=parseInt(i.MinAge) && parseInt(location.state.minAgeSuggest) <=  parseInt(i.MaxAge) && location.state.Gender == i.Gender ){
         check = true;
       }
     }
   })
   return check
 }
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
        const pageNumber1 = []
        for (let i = 1; i <= Math.ceil(renderData.length / postPerPage); i++) {
            pageNumber1.push(i)
        }
        setPageNumberTotal(pageNumber1)
    }, [renderDataTotal])
  useEffect(() => {
      console.log("searchTerm",searchTerm)
    let dataRcv = dataProduct.filter((val) => {
      if (searchTerm === '') {
        return val
      } else if (val.ProductEnglishName.toLowerCase().includes(searchTerm.toLowerCase())) {
        return val
      }
    })
    dataRcv = dataRcv.filter((val) => {
      if (searchCategory == '') {
        return val
      } else if (val.Tag == searchCategory) {
        return val
      }
    })
    setRenderDataTotal(dataRcv)
  }, [searchTerm,searchCategory])

  //get currentPost
  const indexofLast = currentPage * postPerPage
  const indexofFirst = indexofLast - postPerPage
  const currentPosts = renderData.slice(indexofFirst, indexofLast)
    const indexofLastTotal = currentPageTotal * postPerPageTotal
    const indexofFirstTotal = indexofLastTotal - postPerPageTotal
    const currentPostsTotal = renderDataTotal.slice(indexofFirstTotal, indexofLastTotal)
  const paginate = (pageNumber) => setCurrentPage(pageNumber)
  const paginateTotal = (pageNumber) => setCurrentPageTotal(pageNumber)

  return (
      <div>
          {/*<Carousel className="d-flex mt-5" style={{ maxWidth: '1200px' }}>*/}
          {/*    <Carousel.Item interval={1000}>*/}
          {/*        <img*/}
          {/*            className="d-block w-100"*/}
          {/*            src="1.jpg"*/}
          {/*            alt="First slide"*/}
          {/*        />*/}
          {/*        <Carousel.Caption>*/}
          {/*            <h3>First slide label</h3>*/}
          {/*            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>*/}
          {/*        </Carousel.Caption>*/}
          {/*    </Carousel.Item>*/}
          {/*    <Carousel.Item interval={500}>*/}
          {/*        <img*/}
          {/*            className="d-block w-100"*/}
          {/*            src="holder.js/800x400?text=Second slide&bg=282c34"*/}
          {/*            alt="Second slide"*/}
          {/*        />*/}
          {/*        <Carousel.Caption>*/}
          {/*            <h3>Second slide label</h3>*/}
          {/*            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>*/}
          {/*        </Carousel.Caption>*/}
          {/*    </Carousel.Item>*/}
          {/*    <Carousel.Item>*/}
          {/*        <img*/}
          {/*            className="d-block w-100"*/}
          {/*            src="holder.js/800x400?text=Third slide&bg=20232a"*/}
          {/*            alt="Third slide"*/}
          {/*        />*/}
          {/*        <Carousel.Caption>*/}
          {/*            <h3>Third slide label</h3>*/}
          {/*            <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>*/}
          {/*        </Carousel.Caption>*/}
          {/*    </Carousel.Item>*/}
          {/*</Carousel>*/}
    <div className="d-flex flex-column shadow-lg p-3 m-auto mt-5" style={{ maxWidth: '1200px' }}>
      <h1 className="text-center">{location.state.Name}さんためのおすすめ商品のリストはこちら
      </h1>
      <Container>
        <Row className="d-flex align-items-center mt-4">
          {currentPosts.map((product) => (
            <Col key={product.key}  style={{backgroundColor:'#c2c2c2',width:'20%',marginRight:10,display:'flex',flexDirection:'row'}}>
              <img src={product.Image} alt="product"  style={{width:'60%',padding:10}}/>
              <div style={{padding:10}}>
                <h5>{product.ProductEnglishName}</h5>
                <h8>{product.productPrice} 千円</h8>
                <h8>Category: {category[product.productNumber]}</h8>
              </div>
            </Col>
          ))}
        </Row>
        <nav>
          <ul className="d-flex pagination justify-content-center">
            {pageNumber.map((number) => (
              <li key={number} className="page-item">
                <button onClick={() => paginate(number)} className="page-link" style={currentPage == number?{position:'initial',color:'red'}:{position:'initial'}}>
                  {number}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </div>
          <div className="d-flex flex-column shadow-lg p-3 m-auto mt-5" style={{ maxWidth: '1200px' }}>
              <h1 className="text-center">すべての製品</h1>
              <div style={{display:'flex',flexDirection:'row'}}>
                  <div style={{alignItems:'center',justifyContent:'center',display:'flex',marginTop:18,marginRight:5,fontWeight:'bold',fontSize:20}}>Name</div>
                  <input
                      style={{marginRight:10}}
                      type="text"
                      placeholder="検索 ...."
                      onChange={(event) => {
                        setSearchTerm(event.target.value)
                      }}
                  />
                  {/*<div style={{alignItems:'center',justifyContent:'center',display:'flex',marginTop:18,marginRight:5,fontWeight:'bold',fontSize:20}}>Tag</div>*/}
                  {/*<select style={{marginTop:19,width:'30%',marginRight:10}} value={searchCategory} onChange={(e)=>{setSearchCategory(e.target.value)}}>*/}
                  {/*  <option value="">全部</option>*/}
                  {/*  {*/}
                  {/*    tag.map(i=>{*/}
                  {/*      return <option value={i.TagName}>{i.TagName}</option>*/}
                  {/*    })*/}
                  {/*  }*/}

                  {/*</select>*/}
              </div>
              <Container>
                  <Row className="d-flex align-items-center mt-4">
                      {currentPostsTotal.map((product) => (
                          <Col key={product.key} md={12} lg={6} className="d-flex align-items-center mb-4">
                              <img src={product.Image} alt="product" />
                              <div className="d-flex flex-column" style={{ marginLeft: '16px' }}>
                                  <h2>{product.ProductEnglishName}</h2>
                                  <h4>{product.productPrice} 千円</h4>
                                  <p>Category: {category[product.productNumber]}</p>
                              </div>
                          </Col>
                      ))}
                  </Row>
                  <nav>
                      <ul className="pagination justify-content-center">
                          {pageNumberTotal.map((number) => (
                              <li key={number} className="page-item">
                                  <button onClick={() => paginateTotal(number)} className="page-link" style={currentPageTotal == number?{position:'initial',color:'red'}:{position:'initial'}}>
                                      {number}
                                  </button>
                              </li>
                          ))}
                      </ul>
                  </nav>
              </Container>
          </div>
      </div>
  )
}
