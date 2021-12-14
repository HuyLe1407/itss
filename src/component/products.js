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
  Pie,
  Cell,
} from "recharts";
import moment from "moment";
import numeral from "numeral";
import cubejs from "@cubejs-client/core";
import Chart from "./chart.js";
import { db, auth } from '../firebase';
import { useNavigate } from "react-router-dom";

const cubejsApi = cubejs(process.env.REACT_APP_CUBEJS_TOKEN, {
  apiUrl: process.env.REACT_APP_API_URL
});
const numberFormatter = (item) => numeral(item).format("0,0");
const dateFormatter = (item, index) => moment(index+1, 'M').format("MMM YY");;

const renderSingleValue = (data) => (
  <h1 height={300}>{numberFormatter(data)}</h1>
);

export default function Products() {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [gender, setGender] = useState([]);
  const navigate = useNavigate();
  const COLORS = ['#0088FE', '#00C49F'];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN) + 7;
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${gender[index].name}, ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  useEffect(() => {
    const temp = [];
    const tempOrder = [];
    const tempProducts = [];
    const tempGender = [{ name: 'Male', value: 0 },
    { name: 'Female', value: 0 }];
    db.collection('users')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          temp.push({ ...doc.data(), key: doc.id })
          if (doc.data().Gender === 'male') {
            tempGender[0].value++;
          } else {
            tempGender[1].value++;
          }

        })
        setUsers(temp)
        setGender(tempGender)
      })
    db.collection('customersBuy')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          tempOrder.push({ ...doc.data(), key: doc.id })
        })
        setOrders(tempOrder)
      })
    db.collection('products')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          tempProducts.push({ ...doc.data(), key: doc.id })
        })
        setProducts(tempProducts)
      })
  }, [])

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
                  <Tooltip labelFormatter={dateFormatter} />
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
        </Col>
      </Row>
    </Container>
  );
}
