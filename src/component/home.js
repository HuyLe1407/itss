import 'bootstrap/dist/css/bootstrap.min.css'
import React, { useState, useEffect } from 'react'
import { Navbar, Table } from 'react-bootstrap'
import { auth, db } from '../firebase'
import { Link, useNavigate } from 'react-router-dom'
import { MdArticle } from 'react-icons/md'
import {dataOrder, dataUsers} from "./Data";
export default function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchStartAge, setSearchStartDate] = useState('')
  const [searchStartOrder, setSearchStartOrder] = useState('')
  const [searchEndAge, setSearchEndDate] = useState('')
  const [searchEndOrder, setSearchEndOrder] = useState('')
  const [searchGender, setSearchGender] = useState('')
  const [searchAge, setSearchAge] = useState('')
  const [currentPage, setcurrentPage] = useState(1)
  const [postPerPage] = useState(10)
  const [users, setUsers] = useState([])
  const [productsBuy, setProductsBuy] = useState([])
  const [dataProduct, setDataProduct] = useState([])
  const [pageNumber, setPageNumber] = useState([])
    const options = [
       '全部','男性', '女性'
    ];
    const defaultOption = options[0];
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
    const getProducts = []
      setUsers(dataUsers)
      setProductsBuy(dataOrder)
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
      dataRcv = dataRcv
          .filter((val) => {
              if (searchGender === '') {
                  return val
              } else if (val.Gender == searchGender) {
                  return val
              }
          });
      dataRcv = dataRcv
          .filter((val) => {
              if (searchStartAge === '' && searchEndAge === '') {
                  return val
              } else if (searchStartAge== '' && searchEndAge!='') {
                  console.log(parseInt(val.Age))
                  if(parseInt(val.Age)<=parseInt(searchEndAge)) {
                      return val
                  }
              }else if (searchStartAge!='' && searchEndAge== '') {
                  if(parseInt(searchStartAge)<=parseInt(val.Age)) {
                      return val
                  }
              }else if (searchStartAge!= '' && searchEndAge!='') {
                  if(parseInt(searchStartAge)<=parseInt(val.Age)&&parseInt(val.Age)<=parseInt(searchEndAge)) {
                      return val
                  }
              }
          });
      dataRcv = dataRcv
          .filter((val) => {
              if (searchStartOrder === '' && searchEndOrder === '') {
                  return val
              } else if (searchStartOrder== '' && searchEndOrder!='') {
                  let dataBuy = 0;
                  productsBuy.map(i=>{
                      if(val.ID == i.CustomerId)
                          dataBuy = dataBuy + parseInt(i.Quantily)
                  })
                  if(dataBuy<=parseInt(searchEndOrder)) {
                      return val
                  }
              }else if (searchStartOrder!='' && searchEndOrder== '') {

                  let dataBuy = 0;
                  productsBuy.map(i=>{
                      if(val.ID == i.CustomerId) {
                          dataBuy = dataBuy + parseInt(i.Quantily)
                      }
                  })
                          if(parseInt(searchStartOrder)<=dataBuy) {
                              return val
                          }


              }else if (searchStartOrder!= '' && searchEndOrder!='') {
                  let dataBuy = 0;
                  productsBuy.map(i=>{
                      if(val.ID == i.CustomerId)
                          dataBuy = dataBuy + parseInt(i.Quantily)
                  })
                  if(parseInt(searchStartOrder)<=dataBuy&&dataBuy<=parseInt(searchEndOrder)) {
                      return val
                  }
              }
          });
    setDataProduct(dataRcv);
  },[searchTerm,searchAge,searchGender,users,searchStartAge,searchEndAge,searchStartOrder,searchEndOrder])
  //get currentPost
  const indexofLast = currentPage * postPerPage
  const indexofFirst = indexofLast - postPerPage
  const currentPosts = dataProduct.slice(indexofFirst, indexofLast)
  const paginate = (pageNumber) => setcurrentPage(pageNumber)
  return (
    <div className="home">
      <Navbar />
        <div style={{display:'flex',flexDirection:'row'}}>
            <div style={{alignItems:'center',justifyContent:'center',display:'flex',marginTop:18,marginRight:5,fontWeight:'bold',fontSize:20}}>Name</div>
              <input style={{width:'10%',marginRight:10}}
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
            <div style={{alignItems:'center',justifyContent:'center',display:'flex',marginTop:18,marginRight:5,fontWeight:'bold',fontSize:20}}>Order From</div>
            <input style={{width:'10%',marginRight:10}}
                   type="text"
                   placeholder="検索 ...."
                   onChange={(event) => {
                       setSearchStartOrder(event.target.value)
                   }}
            />
            <div style={{alignItems:'center',justifyContent:'center',display:'flex',marginTop:18,marginRight:5,fontWeight:'bold',fontSize:20}}>To</div>
            <input style={{width:'10%',marginRight:10}}
                   type="text"
                   placeholder="検索 ...."
                   onChange={(event) => {
                       setSearchEndOrder(event.target.value)
                   }}
            />
        </div>
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
                <td>{item['Phone Number']}</td>
                <td style={{}}>
                  <button onClick={() => navigate('/suggestion', { state: { minAgeSuggest: item.Age,Name:item.Name,ID:item.ID,Gender:item.Gender } })}>
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
              <a onClick={() => paginate(number)} className="page-link" style={currentPage == number?{position:'initial',color:'red'}:{position:'initial'}}>
                {number}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
