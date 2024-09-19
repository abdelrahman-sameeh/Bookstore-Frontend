import { Outlet } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import DashboardSidebar from "../components/layout/DashboardSidebar";
import MainNavbarApp from "../components/utils/MainNavbar";

const DashboardLayout = () => {
  return (
    <div className="dashboard-layout page">
      <MainNavbarApp />
      <Container fluid>
        <Row>
          {/* Sidebar */}
          <DashboardSidebar />
          {/* Main Content */}
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

export default DashboardLayout;
