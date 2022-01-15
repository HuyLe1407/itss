import 'bootstrap/dist/css/bootstrap.min.css'
import { useNavigate, useLocation } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { auth, db } from '../firebase'
import { Col, Container, Row } from 'react-bootstrap'
import {categoryName, dataProducts, dataTag} from "./Data";

const postPerPage = 6

export default function TotalProduct() {
    const navigate = useNavigate()
    const location = useLocation()
    const [currentPage, setCurrentPage] = useState(1)
    const [searchTerm, setSearchTerm] = useState('')
    const [searchCategory, setSearchCategory] = useState('')
    const [pageNumber, setPageNumber] = useState([])
    const [searchStartAge, setSearchStartDate] = useState('')
    const [searchEndAge, setSearchEndDate] = useState('')
    const [dataProduct, setDataProduct] = useState([])
    const [searchGender, setSearchGender] = useState('')
    const [renderData, setRenderData] = useState([])
    const [category, setCategory] = useState({})
    const [tag, getTag] = useState([])
    useEffect(() => {
        const productsData = []
        setDataProduct(dataProducts);
        getTag(dataTag);
        setCategory(categoryName);
    }, [])

    useEffect(() => {
         setRenderData(dataProduct)
    }, [dataProduct])

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
            if (searchTerm == '') {
                return val
            } else if (val.ProductEnglishName.toLowerCase().includes(searchTerm.toLowerCase())) {
                return val
            }
        })
        dataRcv = dataRcv
            .filter((val) => {
                if (searchGender === '') {
                    return val
                } else if (searchGender== getTagName(val.Tag).Gender) {
                    return val
                }
            });
        dataRcv = dataRcv
            .filter((val) => {
                if (searchStartAge === '' && searchEndAge === '') {
                    return val
                } else if (searchStartAge== '' && searchEndAge!='') {
                    if(getTagName(val.Tag).MinAge<=parseInt(searchEndAge)) {
                        return val
                    }
                }else if (searchStartAge!='' && searchEndAge== '') {
                    if(parseInt(searchStartAge)<=getTagName(val.Tag).MaxAge) {
                        return val
                    }
                }else if (searchStartAge!= '' && searchEndAge!='') {
                    if(parseInt(searchStartAge)<=getTagName(val.Tag).MaxAge&&getTagName(val.Tag).MinAge<=parseInt(searchEndAge)) {
                        return val
                    }
                }
            });
        setRenderData(dataRcv)
    }, [searchTerm,searchStartAge,searchEndAge,searchGender])

    //get currentPost
    const indexofLast = currentPage * postPerPage
    const indexofFirst = indexofLast - postPerPage
    const currentPosts = renderData.slice(indexofFirst, indexofLast)
    const paginate = (pageNumber) => setCurrentPage(pageNumber)
    const getTagName=(tagName)=>{
        let data = {};
        tag.map(i=>{
            if(tagName == i.TagName){
                data = i
            }
        })
        console.log(data)
        return data;
    }
    return (
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
                <div style={{alignItems:'center',justifyContent:'center',display:'flex',marginTop:18,marginRight:5,fontWeight:'bold',fontSize:20}}>Gender</div>
                <select style={{marginTop:19,width:'10%',marginRight:10}} value={searchGender} onChange={(e)=>{setSearchGender(e.target.value)}}>
                    <option value="">全部</option>
                    <option value="male">男性</option>
                    <option value="female">女性</option>
                </select>
                <div style={{alignItems:'center',justifyContent:'center',display:'flex',marginTop:18,marginRight:5,fontWeight:'bold',fontSize:20}}>Age From</div>
                <input style={{width:'10%',marginRight:10}}
                       type="text"
                       placeholder="検索 ...."
                       onChange={(event) => {
                           setSearchStartDate(event.target.value)
                       }}
                />
                <div style={{alignItems:'center',justifyContent:'center',display:'flex',marginTop:18,marginRight:5,fontWeight:'bold',fontSize:20}}>To</div>
                <input style={{width:'10%',marginRight:10}}
                       type="text"
                       placeholder="検索 ...."
                       onChange={(event) => {
                           setSearchEndDate(event.target.value)
                       }}
                />
            </div>
            <Container>
                <Row className="d-flex align-items-center mt-4">
                    {currentPosts.map((product) => (
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
    )
}
