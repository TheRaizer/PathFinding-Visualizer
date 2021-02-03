import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import "./header.css";

function Header() {
  return (
    <Container id="header" className="py-5" fluid>
      <Row>
        <Col>Ctrl Click: set start cell</Col>
        <Col>Alt Click: set end cell</Col>
      </Row>
    </Container>
  );
}

export default Header;
