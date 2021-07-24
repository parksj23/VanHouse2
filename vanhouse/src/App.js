import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { BrowserRouter as Router, Route } from "react-router-dom";
import PostDetail from "./components/PostDetail/PostDetail";
import Header from "./components/Header";
import UserList from "./components/UserList";
import Price from './components/Price';
import Location from './components/Location';
import Category from './components/Category';
import "./App.css";
import PostCollection from "./components/PostCollection";

function App() {
  const [filterIdx, setFilterIdx] = useState(Number(0));
  const [reset, setReset] = useState(false);
  const [filterURL, setFilterURL] = useState("");
  const [posts, setPosts] = useState([]);

  return (
    <Router>
      <div className="App">
        <Header />
        <Route exact path="/">
          <Container fluid>
            <Row id="AppMainRow">
              <Col lg={3} md={3}>
                {(filterIdx === 0 && (
                  <UserList
                    setReset={setReset}
                    setQuery={setFilterURL}
                  />
                )) ||
                  (filterIdx === 1 && (
                    <Category
                      setReset={setReset}
                      setFilterIdx={setFilterIdx}
                      setQuery={setFilterURL}
                    />
                  )) ||
                  (filterIdx === 2 && (
                    <Price
                      setReset={setReset}
                      setFilterIdx={setFilterIdx}
                      setQuery={setFilterURL}
                    />
                  )) ||
                  (filterIdx === 3 && (
                    <Location
                      setReset={setReset}
                      setFilterIdx={setFilterIdx}
                      setQuery={setFilterURL}
                    />
                  ))}
              </Col>
              <Col>
                <PostCollection
                  filterURL={filterURL}
                  setSearchFilter={(i) => {
                    setFilterIdx(i);
                    setReset(true);
                  }}
                  appPosts={posts}
                  setAppPosts={setPosts}
                  setQuery={setFilterURL}
                />
              </Col>
            </Row>
          </Container>
        </Route>
        <Route path="/post/:id">
          <PostDetail />
        </Route>
      </div>
    </Router>
  );
}

export default App;
