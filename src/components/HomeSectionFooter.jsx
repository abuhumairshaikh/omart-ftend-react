import React from 'react';
import { Container, Row, Col, ListGroup } from 'react-bootstrap';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { FaCcVisa, FaCcMastercard, FaCcDiscover, FaCcPaypal } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4">
      <Container>
        <Row>
          <Col md={4} className="mb-3">
            <h5>About Open Mart</h5>
            <ListGroup variant="flush">
              <ListGroup.Item className="bg-dark text-white border-0">
                <a href="/contact-us" className="text-white text-decoration-none">Contact Us</a>
              </ListGroup.Item>
              <ListGroup.Item className="bg-dark text-white border-0">
                <a href="/about-us" className="text-white text-decoration-none">About Us</a>
              </ListGroup.Item>
              <ListGroup.Item className="bg-dark text-white border-0">
                <a href="/careers" className="text-white text-decoration-none">Careers</a>
              </ListGroup.Item>
              <ListGroup.Item className="bg-dark text-white border-0">
                <a href="/information" className="text-white text-decoration-none">Information</a>
              </ListGroup.Item>
            </ListGroup>
          </Col>

          <Col md={4} className="mb-3">
            <h5>Help</h5>
            <ListGroup variant="flush">
              <ListGroup.Item className="bg-dark text-white border-0">
                <a href="/customer-policy" className="text-white text-decoration-none">Customer Policy</a>
              </ListGroup.Item>
              <ListGroup.Item className="bg-dark text-white border-0">
                <a href="/return-policy" className="text-white text-decoration-none">Return Policy</a>
              </ListGroup.Item>
              <ListGroup.Item className="bg-dark text-white border-0">
                <a href="/faq" className="text-white text-decoration-none">FAQ</a>
              </ListGroup.Item>
            </ListGroup>
          </Col>

          <Col md={4} className="mb-3">
            <h5>Contact Us</h5>
            <p>Email: <a href="mailto:support@openmart.com" className="text-white">support@openmart.com</a></p>
            <p>Address: 123 Open Mart Lane, City, Country</p>
            <div className="d-flex gap-2">
              <a href="https://facebook.com" className="text-white" aria-label="Facebook"><FaFacebook /></a>
              <a href="https://twitter.com" className="text-white" aria-label="Twitter"><FaTwitter /></a>
              <a href="https://instagram.com" className="text-white" aria-label="Instagram"><FaInstagram /></a>
              <a href="https://linkedin.com" className="text-white" aria-label="LinkedIn"><FaLinkedin /></a>
            </div>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col className="text-center">
            <p>&copy; Open Mart 2024</p>
            <a href="/become-a-seller" className="text-white text-decoration-none mx-3">Become a Seller</a>
            <a href="/advertise" className="text-white text-decoration-none mx-3">Advertise</a>
            <a href="/help-centre" className="text-white text-decoration-none mx-3">Help Centre</a>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col className="text-center">
            <div className="d-flex justify-content-center gap-2">
              <FaCcVisa className="text-white" aria-label="Visa" />
              <FaCcMastercard className="text-white" aria-label="MasterCard" />
              <FaCcDiscover className="text-white" aria-label="Discover" />
              <FaCcPaypal className="text-white" aria-label="PayPal" />
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
