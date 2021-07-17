import React, { useRef } from "react";
import PropTypes from "prop-types";
import { Form, Modal, Col, Row, Button } from "react-bootstrap";

export default function EditPost({ show, setDisplay, post, setPost }) {
  const formRef = useRef();

  const editPost = async (event) => {
    event.preventDefault();
    const form = formRef.current;
    const {
      title,
      email,
      phone,
      address,
      postalCode,
      price,
      paymentPeriod,
      leaseLength,
      bedrooms,
      bathrooms,
      sqft,
      utilities,
      pets,
      laundry,
      furnished,
    } = form;
    const formData = new FormData();
    formData.append("title", title.value);
    formData.append("email", email.value);
    formData.append("phone", phone.value);
    formData.append("price", price.value);
    formData.append("address", address.value);
    formData.append("postalCode", postalCode.value);
    formData.append("paymentPeriod", paymentPeriod.value);
    formData.append("leaseLength", leaseLength.value);
    formData.append("bedrooms", bedrooms.value);
    formData.append("bathrooms", bathrooms.value);
    formData.append("sqft", sqft.value);
    formData.append("utilities", utilities.checked);
    formData.append("pets", pets.checked);
    formData.append("laundry", laundry.checked);
    formData.append("furnished", furnished.checked);

    const reponse = await fetch(`http://localhost:4000/post/${post.id}/edit`, {
      method: "put",
      body: formData,
    });
    const updatedPost = await reponse.json();
    setPost(updatedPost);
    setDisplay(false);
  };

  return (
    <Modal show={show} onHide={() => setDisplay(false)}>
      <Form onSubmit={editPost} ref={formRef}>
        <Modal.Header>
          <Modal.Title>Edit Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group as={Col} controlId="formTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              placeholder="Title"
              defaultValue={post?.title}
              name="title"
            />
          </Form.Group>

          <Row>
            <Form.Group as={Col} controlId="formEmail">
              <Form.Label>Email address *</Form.Label>
              <Form.Control
                required
                type="email"
                placeholder="Enter email"
                defaultValue={post?.email}
                name="email"
              />
            </Form.Group>

            <Form.Group as={Col} controlId="formPhone">
              <Form.Label>Phone number</Form.Label>
              <Form.Control
                type="tel"
                pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                placeholder="123-456-7890"
                defaultValue={post?.phone}
                name="phone"
              />
            </Form.Group>
          </Row>

          <Row>
            <Form.Group as={Col} controlId="formAddress">
              <Form.Label>Address *</Form.Label>
              <Form.Control
                required
                placeholder="1961 East Mall"
                defaultValue={post?.address}
                name="address"
              />
            </Form.Group>
            <Form.Group as={Col} controlId="form">
              <Form.Label>Postal Code *</Form.Label>
              <Form.Control
                required
                placeholder="A1B 2C3"
                pattern="[A-Z][0-9][A-Z][ ]?[0-9][A-Z][0-9]"
                defaultValue={post?.postalCode}
                name="postalCode"
              />
            </Form.Group>
          </Row>

          <Row>
            <Form.Group as={Col} controlId="formPrice">
              <Form.Label>Price *</Form.Label>
              <Form.Control
                required
                type="number"
                min="0"
                placeholder="1000"
                defaultValue={post?.price}
                name="price"
              />
            </Form.Group>

            <Form.Group as={Col} controlId="formPricePeriod">
              <Form.Label> Payment period </Form.Label>
              <Form.Control
                as="select"
                defaultValue={post?.paymentPeriod}
                name="paymentPeriod">
                <option>daily</option>
                <option>weekly</option>
                <option>monthly</option>
              </Form.Control>
            </Form.Group>
            <Form.Group as={Col} controlId="formLease">
              <Form.Label>Lease length</Form.Label>
              <Form.Control
                as="select"
                defaultValue={post?.leaseLength}
                name="leaseLength">
                <option>no lease</option>
                <option>6 months</option>
                <option>1 year</option>
              </Form.Control>
            </Form.Group>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="formBedrooms">
                <Form.Label>Bedrooms</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  placeholder="1"
                  defaultValue={post?.bedrooms}
                  name="bedrooms"
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="formBathrooms">
                <Form.Label>Bathrooms</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  placeholder="1"
                  defaultValue={post?.bathrooms}
                  name="bathrooms"
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="formSqft">
                <Form.Label>Square ft</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  placeholder="500"
                  defaultValue={post?.sqft}
                  name="sqft"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="formUtilities">
                <Form.Check
                  type="checkbox"
                  label="Utilities included"
                  defaultChecked={post?.utilities}
                  name="utilities"
                />
              </Form.Group>

              <Form.Group controlId="formPets">
                <Form.Check
                  type="checkbox"
                  label="Pets allowed"
                  defaultChecked={post?.pets}
                  name="pets"
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="formLaundry">
                <Form.Check
                  type="checkbox"
                  label="In suite laundry"
                  defaultChecked={post?.laundry}
                  name="laundry"
                />
              </Form.Group>
              <Form.Group controlId="formFurnished">
                <Form.Check
                  type="checkbox"
                  label="Furnished"
                  defaultChecked={post?.furnished}
                  name="furnished"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group as={Col} controlId="formImages">
            <Form.File
              id="uploadImagesButton"
              multiple
              label="Upload image(s)"
              accept=".jpg, .jpeg, .png, .tiff"
            />
          </Form.Group>

          <Form.Text className="text-muted">* required fields</Form.Text>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDisplay(false)}>
            Close
          </Button>
          <Button variant="primary" type="submit">
            Continue
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

EditPost.propTypes = {
  show: PropTypes.bool.isRequired,
  setDisplay: PropTypes.func.isRequired,
  post: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    address: PropTypes.string,
    postalCode: PropTypes.string,
    price: PropTypes.string,
    paymentPeriod: PropTypes.string,
    bedrooms: PropTypes.string,
    bathrooms: PropTypes.string,
    sqft: PropTypes.string,
    leaseLength: PropTypes.string,
    pets: PropTypes.bool,
    utilities: PropTypes.bool,
    laundry: PropTypes.bool,
    furnished: PropTypes.bool,
  }),
  setPost: PropTypes.func.isRequired,
};