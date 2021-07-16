import React, { useRef, useState, useEffect } from "react";
import {
  Alert,
  Carousel,
  Container,
  Row,
  Col,
  ListGroup,
  ListGroupItem,
  Button,
  Modal,
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import "../../styles/postdetail.css";
import ReactMapGL, { Marker } from "react-map-gl";
import Report from "./Report";
import EditPost from "./EditPost";
import userLogo from "../../assets/user.svg";
// import thumbUp from "../assets/thumb-up.svg";
import thumbDown from "../../assets/thumb-down.svg";
import upVote from "../../assets/thumbup-voted.svg";
// import downVote from "../assets/thumbdown-voted.svg";
import LoadingSpinner from "../LoadingSpinner";
import getErrorString from "../../utils";

export default function PostDetail() {
  const mapToken =
    "pk.eyJ1IjoiaWR1bm5vY29kaW5nOTUiLCJhIjoiY2tlMTFiMDh4NDF4cTJ5bWgxbDUxb2M5ciJ9.-L_x_0HZGSXFMRdactrn-Q";

  const { id } = useParams();
  const [user, setUser] = useState();
  const [post, setPost] = useState();
  const [schedule, setSchedule] = useState([]);
  const [comments, setComments] = useState();
  const [postLoaded, setPostLoaded] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [displayError, setDisplayError] = useState(false);
  const [errorMsg, setErrorMsg] = useState();
  const [coords, setCoords] = useState({
    latitude: 49.2827,
    longitude: -123.1207,
  });
  const [property, setProperty] = useState({
    width: "100%",
    height: "100%",
    latitude: 49.2827,
    longitude: -123.1207,
    zoom: 11,
    mapboxApiAccessToken: mapToken,
  });

  // Get Post info and latitute&longtitude of the property
  useEffect(async () => {
    let postData;
    try {
      const postResponse = await fetch(`http://localhost:4000/post/${id}`);
      postData = await postResponse.json();
      setPost(postData.postInfo);
      setComments(postData.comments);
      setSchedule(postData.availableDates);
      setPostLoaded(true);
    } catch (err) {
      getErrorString(err).then((errText) => {
        setErrorMsg(errText);
        setDisplayError(true);
      });
    }

    try {
      const coordsResponse = await fetch(
        `http://localhost:4000/post/${id}/coords?location=${postData.postInfo.postalCode}`
      );
      const data = await coordsResponse.json();
      setProperty({
        width: "100%",
        height: "100%",
        latitude: Number(data.latitude),
        longitude: Number(data.longitude),
        zoom: 11,
        mapboxApiAccessToken: mapToken,
      });
      setCoords({
        latitude: Number(data.latitude),
        longitude: Number(data.longitude),
      });
      setMapLoaded(true);
    } catch (err) {
      getErrorString(err).then((errText) => {
        setErrorMsg(errText);
        setDisplayError(true);
      });
    }

    try {
      const response = await fetch(
        "http://localhost:4000/login-router/account",
        {
          credentials: "include",
        }
      );
      if (!response.ok) {
        return;
      }
      const data = await response.json();
      setUser({ userId: data.userId, username: data.firstName });
    } catch (err) {
      setUser();
      console.log("Error while fetch user ", err);
    }
  }, []);

  // Comment function
  const commentRef = useRef();
  const addComment = (event) => {
    event.preventDefault();
    const { value } = commentRef.current;
    if (value === "") {
      setDisplayError(true);
      setErrorMsg("Comment cannot be empty");
      return;
    }
    if (!user) {
      setDisplayError(true);
      setErrorMsg("Please login first");
      return;
    }
    const form = new FormData();
    form.append("newComment", value);
    form.append("userId", user.userId);
    form.append("username", user.username);
    fetch(`http://localhost:4000/post/${post.id}/comment`, {
      method: "POST",
      body: form,
    })
      .then((response) => response.json())
      .then((data) => {
        setComments([
          ...comments,
          {
            _id: data._id,
            username: user.username,
            text: data.comment.text,
            date: data.today,
          },
        ]);
        commentRef.current.value = "";
      })
      .catch((err) => console.log("Error while commenting ", err));
  };

  // Maps post images to carousel items.
  // Note: It should be okay to use idx as a key because images are static for each post
  const carouselItems = post?.images.map((image, idx) => {
    const keyId = idx + 1;
    return (
      <Carousel.Item key={keyId}>
        <img
          className="d-block w-100 post-detail-thumbnail"
          src={image}
          alt="thumbnail"
        />
      </Carousel.Item>
    );
  });

  // Schedule Hooks
  const [displaySchedule, setDisplaySchedule] = useState(false);
  const selectedDate = [
    { id: 0, date: "Sat Jan 1 2021" },
    { id: 1, date: "Thur Feb 2 2021" },
    { id: 2, date: "Wed Mar 3 2021" },
  ];

  // Report function hooks
  const [displayReport, setDisplayReport] = useState(false);

  // Full info hooks
  const [showFullInfo, setShowFullInfo] = useState(false);

  // Edit post hooks
  const [displayEditModal, setDisplayEditModal] = useState(false);

  return (
    <>
      <Container fluid>
        <Row>
          {/* Error Message  */}
          {displayError && (
            <Alert
              id="postdetail_error_alert"
              variant="danger"
              onClose={() => setDisplayError(false)}
              dismissible>
              <Alert.Heading>Oops!</Alert.Heading>
              <p>{errorMsg}</p>
            </Alert>
          )}

          <Col xs={12}>
            {postLoaded ? (
              <Carousel>{carouselItems}</Carousel>
            ) : (
              <LoadingSpinner />
            )}
          </Col>

          <Col xs={12}>
            <span className="post-rate">
              <img
                className="thumb"
                id="thumbup-icon"
                src={upVote}
                alt="thumb-up"
              />
              <span className="review-count" id="thumbup-count">
                {post?.upvote}
              </span>
              <img
                className="thumb"
                id="thumbdown-icon"
                src={thumbDown}
                alt="thumb-down"
              />
              <span className="review-count" id="thumbdown-count">
                {post?.downvote}
              </span>
            </span>

            <Button
              id="homeTourBtn"
              variant="info"
              onClick={() => setDisplaySchedule(true)}>
              Book a home tour!
            </Button>

            <Button
              onClick={() => setDisplayEditModal(true)}
              id="editPost--btn">
              Edit Post
            </Button>

            <Button
              variant="warning"
              id="reportBtn"
              onClick={() => setDisplayReport(true)}>
              Report
            </Button>
            <Button variant="danger" id="deleteBtn">
              Delete
            </Button>
          </Col>

          <Col xs={12} md={6}>
            {postLoaded ? (
              <ListGroup>
                <ListGroupItem>Address: {post.address}</ListGroupItem>
                <ListGroupItem>
                  Price: ${post.price} {post.paymentPeriod}
                </ListGroupItem>
                {post.email !== "" && (
                  <ListGroupItem>Email: {post.email}</ListGroupItem>
                )}
                <ListGroupItem>
                  {post.pets ? "Pets friendly" : "No pets"}
                </ListGroupItem>
                <ListGroupItem>
                  {post.utilities ? "Utility included" : "Utility not included"}
                </ListGroupItem>
                <ListGroupItem>
                  {post.laundry ? "Ensuite laundry" : "No ensuite laundry"}
                </ListGroupItem>
                <ListGroupItem>
                  {post.furnished ? "Furnished" : "Unfurnished"}
                </ListGroupItem>
                <Button
                  id="viewFullInfoBtn"
                  onClick={() => setShowFullInfo(true)}
                  variant="success">
                  View More
                </Button>
              </ListGroup>
            ) : (
              <LoadingSpinner />
            )}
          </Col>

          <Col xs={12} md={6}>
            {mapLoaded ? (
              <ReactMapGL
                {...property}
                onViewportChange={(view) => setProperty(view)}>
                <Marker latitude={coords.latitude} longitude={coords.longitude}>
                  <span id="marker"></span>
                </Marker>
              </ReactMapGL>
            ) : (
              <LoadingSpinner />
            )}
          </Col>

          <Col id="comment">
            <h4 className="text-center">Comment</h4>
            {postLoaded ? (
              comments.map((e) => (
                <div className="comment__block" key={e._id}>
                  <span className="commnet_userinfo">
                    <img
                      className="comment__img"
                      src={userLogo}
                      width="40"
                      alt="user_img"
                    />
                  </span>
                  <span className="comment--rightBlock">
                    <p className="comment--user">
                      <span className="comment--username">{e.username}</span>{" "}
                      &#8226; {e.date}
                    </p>
                    <p className="comment__content">{e.text}</p>
                  </span>
                </div>
              ))
            ) : (
              <LoadingSpinner />
            )}
            <div className="comment__input">
              <form onSubmit={addComment}>
                <textarea
                  ref={commentRef}
                  name="newComment"
                  placeholder="Leave a comment!"></textarea>
                <Button type="submit">Submit</Button>
              </form>
            </div>
          </Col>

          {/* Schedule Modal */}
          {postLoaded && (
            <Modal
              show={displaySchedule}
              onHide={() => setDisplaySchedule(false)}
              centered>
              <Modal.Header closeButton>
                <Modal.Title>You can contact the landlord on</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <ListGroup id="date-list-group">
                  {schedule.map((object) => (
                    <span className="date-list-item" key={object.id}>
                      <ListGroup.Item variant="primary">
                        {object.date}
                      </ListGroup.Item>
                    </span>
                  ))}
                </ListGroup>
              </Modal.Body>
            </Modal>
          )}

          {/* Report Modal */}
          <Report
            displayReport={displayReport}
            setDisplayReport={setDisplayReport}
          />

          {/* Full info modal */}
          {postLoaded && (
            <Modal
              show={showFullInfo}
              onHide={() => setShowFullInfo(false)}
              centered>
              <Modal.Header closeButton>
                <Modal.Title>Full info</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <ListGroup>
                  <ListGroupItem>Address: {post.address}</ListGroupItem>
                  <ListGroupItem>
                    Price: ${post.price} {post.paymentPeriod}
                  </ListGroupItem>
                  {post.email !== "" && (
                    <ListGroupItem>Email: {post.email}</ListGroupItem>
                  )}
                  <ListGroupItem>
                    Lease Length: {post.leaseLength}
                  </ListGroupItem>
                  <ListGroupItem>
                    {post.pets ? "Pets friendly" : "No pets"}
                  </ListGroupItem>
                  <ListGroupItem>
                    {post.utilities
                      ? "Utility included"
                      : "Utility not included"}
                  </ListGroupItem>
                  <ListGroupItem>
                    {post.laundry ? "Ensuite laundry" : "No ensuite laundry"}
                  </ListGroupItem>
                  <ListGroupItem>
                    {post.furnished ? "Furnished" : "Not furnished"}
                  </ListGroupItem>
                  <ListGroupItem>Bedroom: {post.bedrooms}</ListGroupItem>
                  <ListGroupItem>Bathroom: {post.bathrooms}</ListGroupItem>
                  <ListGroupItem>Square feet: {post.sqft}</ListGroupItem>
                </ListGroup>
              </Modal.Body>
            </Modal>
          )}

          <EditPost
            show={displayEditModal}
            setDisplay={setDisplayEditModal}
            post={post}
            setPost={setPost}
          />
        </Row>
      </Container>
    </>
  );
}
