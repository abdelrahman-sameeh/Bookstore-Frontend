import { Outlet } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import MainNavbarApp from "../navbar/MainNavbar";
import ChattingSidebar from "./ChattingSidebar";

const ChattingLayout = () => {
  return (
    <div
      className="dashboard-layout"
    >
      <MainNavbarApp />
      <Container fluid>
        <Row>
          <ChattingSidebar />
          {/* Main Content */}
          <Col lg={3}></Col>
          <Col xs={12} lg={9} className="p-3">
            <main>
              <Outlet />
            </main>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ChattingLayout;
