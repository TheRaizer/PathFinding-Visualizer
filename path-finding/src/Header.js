import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import "./header.css";

function Header() {
  return (
    <Container id="header" className="py-5" fluid>
      <Row>
        <Col>Shift Hover: make cell walkable</Col>
        <Col>Ctrl Hover: make cell unwalkable</Col>
        <Col>Click: set start cell</Col>
        <Col>Alt Click: set end cell</Col>
      </Row>
    </Container>
  );
}

export default Header;
