import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import "./footer.css";
import GitHubLogo from "./Icons/GitHub-Mark-32px.png";
import GmailLogo from "./Icons/Gmail-icon-31px.png";

export default function Footer() {
  return (
    <Container id="footer" className="py-3" fluid>
      <Row>
        <Col>
          <a href="https://github.com/TheRaizer/PathFinding-Algorithms">
            <img
              src={GitHubLogo}
              alt="unavailable"
              className="logo"
              title="github repository"
            />
          </a>
        </Col>
        <Col>
          <a href="mailto:aidan.fu000@gmail.com">
            <img
              src={GmailLogo}
              alt="unavailable"
              className="logo"
              title="send email"
            />
          </a>
        </Col>
      </Row>
    </Container>
  );
}
