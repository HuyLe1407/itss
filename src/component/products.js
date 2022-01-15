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
import { db, auth } from '../firebase';
import { useNavigate } from "react-router-dom";
import {dataOrder, dataProducts, dataUsers} from "./Data";

const cubejsApi = cubejs(process.env.REACT_APP_CUBEJS_TOKEN, {
  apiUrl: process.env.REACT_APP_API_URL
});
const numberFormatter = (item) => numeral(item).format("0,0");
const dateFormatter = (item, index) => moment(index + 1, 'M').format('MM');

const renderSingleValue = (data) => (
  <h1 height={300}>{numberFormatter(data)}</h1>
);

export default function Products() {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tempOrders, setTempOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [gender, setGender] = useState([]);
  const [ordersInMonth, setOrderInMonth] = useState([]);
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
    const temp = [];
    const tempProducts = [];
        setUsers(dataUsers)
        setProducts(dataProducts)
    const tempOrder = [];
        setOrders(dataOrder)
  }, [])
  useEffect(() => {
    const temp = [];
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
    const months = [{ month: '1', quantity: 0 }, { month: '2', quantity: 0 }, { month: '3', quantity: 0 }, { month: '4', quantity: 0 },
    { month: '5', quantity: 0 }, { month: '6', quantity: 0 }, { month: '7', quantity: 0 },
    { month: '8', quantity: 0 }, { month: '9', quantity: 0 }, { month: '10', quantity: 0 },
    { month: '11', quantity: 0 }, { month: '12', quantity: 0 }]
    orders.forEach((order) => {
      const index = order['BuyDate'].split('/')[0];
      months[`${index - 1}`].quantity += 1;
    })
    console.log(months);
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
        <Col sm="6">
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
                    fill="rgba(106, 110, 229, .16)"
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
            width={700}
            height={290}
            data={ordersInMonth}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 10
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
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
              <Pie data={gender} dataKey="value" label={renderCustomizedLabel}>
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
                  <select>
                    <option value="female">All</option>
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
                    Min:
                    <input type="text" name="min" />
                  </label>
                  <label>
                    Max:
                    <input type="text" name="max" />
                  </label>
                </form>
              </div>
            </Col>
            <Col>
              <input type="submit" className="submit-button" value="Submit" />
            </Col>
            <BarChart
              width={700}
              height={290}
              data={ordersInMonth}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 10
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
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
