import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  CartesianGrid,
  Legend,
  Pie,
  Cell,
  Bar,
  BarChart
} from "recharts";
import moment from "moment";
import numeral from "numeral";
import cubejs from "@cubejs-client/core";
import Chart from "./chart.js";
import { auth } from '../firebase';
import { useNavigate } from "react-router-dom";
import { dataOrder, dataProducts, dataUsers } from "./Data";
import _ from 'lodash';

const cubejsApi = cubejs(process.env.REACT_APP_CUBEJS_TOKEN, {
  apiUrl: process.env.REACT_APP_API_URL
});
const numberFormatter = (item) => numeral(item).format("0,0");
const dateFormatter = (item, index) => moment(index + 1, 'M').format('MMM');

const renderSingleValue = (data) => (
  <h1 height={300}>{numberFormatter(data)}</h1>
);

export default function Products() {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [gender, setGender] = useState([]);
  const [ordersInMonth, setOrderInMonth] = useState([]);
  const [tags, setNumberTags] = useState([]);
  const [min, setMin] = useState('0');
  const [max, setMax] = useState('55');
  const [gen, setGen] = useState('all');
  const navigate = useNavigate();
  const COLORS = ['#0088FE', '#00C49F'];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  useEffect(() => {
    setUsers(dataUsers)
    setProducts(dataProducts)
    setOrders(dataOrder)
  }, [])
  useEffect(() => {
    const tempGender = [{ name: 'Male', value: 0 },
    { name: 'Female', value: 0 }];
    dataUsers.forEach((doc) => {
      if (doc.Gender === 'male') {
        tempGender[0].value++;
      } else {
        tempGender[1].value++;
      }

    })
    setGender(tempGender)
  }, [users])
  useEffect(() => {
    const months = [{ name: 'Jan', month: '1', quantity: 0 }, { name: 'Feb', month: '2', quantity: 0 }, { name: 'Mar', month: '3', quantity: 0 }, { name: 'Apr', month: '4', quantity: 0 },
    { name: 'May', month: '5', quantity: 0 }, { name: 'Jun', month: '6', quantity: 0 }, { name: 'Jul', month: '7', quantity: 0 },
    { name: 'Aug', month: '8', quantity: 0 }, { name: 'Sep', month: '9', quantity: 0 }, { name: 'Oct', month: '10', quantity: 0 },
    { name: 'Nov', month: '11', quantity: 0 }, { name: 'Dec', month: '12', quantity: 0 }]
    orders.forEach((order) => {
      const index = order['BuyDate'].split('/')[0];
      months[`${index - 1}`].quantity += 1;
    })
    setOrderInMonth(months);
  }, [orders])
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
    let tempTag = [{ name: 'boy1518', quantity: 0 }, { name: 'boy1520', quantity: 0 }, { name: 'girl1015', quantity: 0 }, { name: 'girl1020', quantity: 0 },
    { name: 'girl1520', quantity: 0 }, { name: 'men2030', quantity: 0 }, { name: 'men2040', quantity: 0 },
    { name: 'men2050', quantity: 0 }, { name: 'men3040', quantity: 0 }, { name: 'men4050', quantity: 0 },
    { name: 'women1530', quantity: 0 }, { name: 'women1820', quantity: 0 }, { name: 'women1825', quantity: 0 },
    { name: 'women1830', quantity: 0 }, { name: 'women2030', quantity: 0 }, { name: 'women2040', quantity: 0 },
    { name: 'women2550', quantity: 0 }, { name: 'women3040', quantity: 0 }, { name: 'women3050', quantity: 0 },
    { name: 'women1520', quantity: 0 }
    ]
    let userTmp = [];
    if (gen !== 'all') { userTmp = users.filter((ele) => ele['Gender'] === gen) }
    else { userTmp = users }
    const userTemp = userTmp.filter((ele) =>
      parseInt(max) >= parseInt(ele['Age']) && parseInt(ele['Age']) >= parseInt(min)
    ).map(ele => ele['ID']);
    const buyedProductID = orders.filter((ele) => userTemp.includes(ele['CustomerId'])).map(ele => {
      return {
        ID: ele['BuyedProductID'],
        quantity: ele['Quantily'],
      }
    });
    console.log()
    const tagTemp = buyedProductID.map((item) => {
      const index = products.findIndex(ele => ele['ID'] === item['ID']);
      return {
        name: products[index]['Tag'],
        quantity: item.quantity,
      }
    })
    tagTemp.forEach((ele) => {
      const i = tempTag.findIndex((e) => e.name === ele.name);
      tempTag[i].quantity += parseInt(ele.quantity);
    })
    tempTag = _.orderBy(tempTag, ['quantity'], ['desc'])
    setNumberTags(tempTag);
  }, [min, max, gen, users, orders, products])

  const handleMinChange = (event) => {
    setMin(event.target.value);
  }

  const handleMaxChange = (event) => {
    setMax(event.target.value);
  }

  const handleGenChange = (event) => {
    setGen(event.target.value);
  }

  return (
    <Container fluid className="pt-3">
      <Row>
        <Col sm="4">
          <Chart
            cubejsApi={cubejsApi}
            title="Total Users"
            query={{ measures: ["Users.count"] }}
            render={() =>
              renderSingleValue(users.length, "Users.count")
            }
          />
        </Col>
        <Col sm="4">
          <Chart
            cubejsApi={cubejsApi}
            title="Total Orders"
            query={{ measures: ["Orders.count"] }}
            render={() =>
              renderSingleValue(orders.length, "Users.count")
            }
          />
        </Col>
        <Col sm="4">
          <Chart
            cubejsApi={cubejsApi}
            title="Products"
            query={{
              measures: ["Products.count"],
            }}
            render={() =>
              renderSingleValue(products.length, "Orders.count")
            }
          />
        </Col>
      </Row>
      <br />
      <br />
      <Row>
        <Col sm="6" className="left-container">
          <Chart
            cubejsApi={cubejsApi}
            title="New Users Over Time"
            query={{
              measures: ["Users.count"],
              timeDimensions: [
                {
                  dimension: "Users.createdAt",
                  dateRange: ["2019-01-01", "2019-12-31"],
                  granularity: "month"
                }
              ]
            }}
            render={(resultSet) => (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={resultSet.chartPivot()}>
                  <XAxis dataKey="category" tickFormatter={dateFormatter} />
                  <YAxis tickFormatter={numberFormatter} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="Users.count"
                    name="Users"
                    stroke="rgb(106, 110, 229)"
                    fill="#8884d8"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          />
        </Col>
        <Col sm="6" className="orders-chart">
          <div className="pie-header">
            <h5>New Orders Over Time</h5>
          </div>
          <BarChart
            width={760}
            height={290}
            data={ordersInMonth}
            margin={{
              top: 5,
              right: 10,
              left: 0,
              bottom: 10
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="quantity" fill="#8884d8" />
          </BarChart>
        </Col>
      </Row>
      <br />
      <br />
      <Row className="gender-row">
        <Col sm="6" className="pie-chart">
          <div className="pie-header">
            <h5>Gender Percentage</h5>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart width="100%" height={250}>
              <Pie data={gender}
                cx="50%"
                cy="50%"
                labelLine={false}
                dataKey="value"
                label={renderCustomizedLabel}>
                {gender.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <Row className="pb-2 label-group">
            <Col className="center-block" align="center">
              <div >
                <div className="male">
                  <span>Male</span>
                </div>
              </div>
            </Col>
            <Col className="center-block" align="center">
              <div>
                <div className="female">
                  <span>Female</span>
                </div>
              </div>
            </Col>
          </Row>
        </Col>
        <Col sm="6" className="tags-chart">
          <div className="pie-header">
            <h5>Number by Tags</h5>
          </div>
          <Row className="pb-2 label-group">
            <Col className="center-block" align="center">
              <div >
                <div className="gender-select">
                  <select onChange={handleGenChange}>
                    <option value="all">All</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>
            </Col>
            <Col className="center-block" align="center">
              <div>
                <form className="age-form">
                  <label>
                    Min Age:
                    <input type="text" name="min" onChange={handleMinChange} defaultValue="0" />
                  </label>
                  <label>
                    Max Age:
                    <input type="text" name="max" onChange={handleMaxChange} defaultValue="55" />
                  </label>
                </form>
              </div>
            </Col>
            <BarChart
              width={750}
              height={290}
              data={tags}
              margin={{
                top: 5,
                right: 0,
                left: 0,
                bottom: 10
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="quantity" fill="#8884d8" />
            </BarChart>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
