import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import { ordersState } from "../../../recoil/ordersAtom";
import authAxios from "../../../api/authAxios";
import { ApiEndpoints } from "../../../api/ApiEndpoints";
import {
  Accordion,
  Button,
  ButtonGroup,
  Col,
  Form,
  Row,
  Pagination,
} from "react-bootstrap";
import OrderComp from "../../../components/utils/OrderComp";
import { statuses } from "../User/UserOrders";
import LoadingButton from "../../../components/utils/LoadingButton";
import MakeOrdersInDeliveryStatusDialog from "../../../components/dashboard/admin/order/MakeOrdersInDeliveryStatusDialog";

const AdminOrders = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = useRecoilState(ordersState);
  const [filteredStatus, setFilteredStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(10); // Default items per page
  const [checkedOrders, setCheckedOrders] = useState<any>([]);
  const [selectAll, setSelectAll] = useState(false); // State for the select all feature
  const [showMakeOrderInDeliveryDialog, setShowMakeOrderInDeliveryDialog] =
    useState(false);

  const handleCheck = (orderId: string) => {
    setCheckedOrders((prevCheckedOrders: any) =>
      prevCheckedOrders.includes(orderId)
        ? prevCheckedOrders.filter((id: any) => id !== orderId)
        : [...prevCheckedOrders, orderId]
    );
  };

  // Toggle select all for cancelled orders
  const handleSelectAll = () => {
    setSelectAll((prevSelectAll) => !prevSelectAll);
    if (!selectAll) {
      const allCancelledOrders = orders
        .filter((order) => ["inProgress"].includes(order.status as string))
        .map((order) => order._id);
      setCheckedOrders(allCancelledOrders);
    } else {
      setCheckedOrders([]); // Deselect all
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      let query = `?page=${currentPage}&limit=${resultsPerPage}`; // Include limit
      if (filteredStatus && filteredStatus !== "all") {
        query += `&status=${filteredStatus}`;
      }
      const response = await authAxios(
        true,
        ApiEndpoints.getDeleteAdminOrders(query)
      );
      setOrders(response?.data?.data?.orders);
      setTotalPages(response?.data?.pagination?.pages || 1);
    };
    fetchOrders();
  }, [filteredStatus, currentPage, resultsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleResultsPerPageChange = (e: any) => {
    setResultsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const renderResultsPerPageSelect = () => (
    <Row className="mb-3">
      <Col xs={1} sm={1} lg={1} className="p-0 w-fit">
        <Form.Check style={{ visibility: "hidden" }} />
      </Col>
      <Col xs={11} className="flex-1">
        <Row>
          <Col sm={12} md={3}>
            <Form.Group className="w-100" controlId="resultsPerPageSelect">
              <Form.Label>{t("adminOrder.resultsPerPage")}</Form.Label>
              <Form.Select
                className="alt-theme w-100"
                value={resultsPerPage}
                onChange={handleResultsPerPageChange}
              >
                {[2, 5, 10, 15, 20].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col sm={12} md={9} className="mt-3">
            <ButtonGroup className="mb-3 d-flex justify-content-center flex-wrap">
              {statuses.map((status) => (
                <Button
                  key={status}
                  variant={
                    filteredStatus === status ? "primary" : "outline-primary"
                  }
                  onClick={() => {
                    setFilteredStatus(status);
                    setCurrentPage(1);
                  }}
                >
                  {t(`orderComp.${status}`)}
                </Button>
              ))}
            </ButtonGroup>
          </Col>
        </Row>
      </Col>
    </Row>
  );

  const renderControlButtons = () => {
    return (
      <Row>
        <Col xs={1} sm={1} lg={1} className="p-0 w-fit">
          <Form.Check style={{ visibility: "hidden" }} />
        </Col>
        <Col className="d-flex gap-2">
          {(() => {
            const hasOnePendingOrInProgress = orders.some(
              (or) => or.status === "inProgress" || or.status === "pending"
            );

            return (
              hasOnePendingOrInProgress && (
                <>
                  <Button
                    variant="outline-warning"
                    className="mb-3"
                    onClick={handleSelectAll}
                  >
                    {selectAll
                      ? t("adminOrder.deselectAllInProgress")
                      : t("adminOrder.selectAllInProgress")}
                  </Button>
                  {checkedOrders.length > 0 && (
                    <LoadingButton
                      className="mb-3 w-fit"
                      onClick={() => {
                        setShowMakeOrderInDeliveryDialog(true);
                      }}
                    >
                      {t("adminOrder.makeOrdersInDelivery")}
                    </LoadingButton>
                  )}
                </>
              )
            );
          })()}
        </Col>
      </Row>
    );
  };

  const renderNoOrdersMessage = () => (
    <div className="text-center">{t("adminOrder.noOrdersForStatus")}</div>
  );

  const renderOrders = () => (
    <Accordion defaultActiveKey="">
      {orders.map((order, index) => (
        <Row key={index}>
          <Col xs={1} sm={1} lg={1} className="p-0 w-fit">
            <Form.Check
              className="mt-2"
              type="checkbox"
              disabled={order.status !== "inProgress"}
              onChange={() => handleCheck(order._id as string)}
              checked={checkedOrders.includes(order._id as string)}
            />
          </Col>
          <Col xs={11} className="flex-1">
            <OrderComp order={order} index={index} />
          </Col>
        </Row>
      ))}
    </Accordion>
  );

  const renderPagination = () => {
    const items = [];
    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => handlePageChange(number)}
        >
          {number}
        </Pagination.Item>
      );
    }

    return (
      <Pagination className="justify-content-center mt-4">
        <Pagination.Prev
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        />
        {items}
        <Pagination.Next
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    );
  };

  return (
    <div className="container">
      {renderResultsPerPageSelect()}
      {renderControlButtons()}
      {orders.length === 0 ? renderNoOrdersMessage() : renderOrders()}
      {totalPages > 1 && renderPagination()}

      {checkedOrders.length > 0 && (
        <MakeOrdersInDeliveryStatusDialog
          show={showMakeOrderInDeliveryDialog}
          setShow={setShowMakeOrderInDeliveryDialog}
          ordersIds={checkedOrders}
          setOrdersIds={setCheckedOrders}
        />
      )}
    </div>
  );
};

export default AdminOrders;
