import { useRecoilState } from "recoil";
import { useEffect, useState } from "react";
import authAxios from "../../../api/authAxios";
import { ApiEndpoints } from "../../../api/ApiEndpoints";
import {
  Container,
  Accordion,
  ButtonGroup,
  Button,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { ordersState } from "../../../recoil/ordersAtom";
import OrderComp from "../../../components/utils/OrderComp";
import Icon from "../../../components/utils/Icon";
import DeleteCancelledOrders from "../../../components/dashboard/user/orders/DeleteCancelledOrders";

export const statuses = [
  "all",
  "pending",
  "inProgress",
  "inDelivery",
  "completed",
  "cancelled",
];

const UserOrders = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = useRecoilState(ordersState);
  const [filteredStatus, setFilteredStatus] = useState("all");
  const [checkedOrders, setCheckedOrders] = useState<any>([]);
  const [selectAll, setSelectAll] = useState(false); // State for the select all feature
  const [showDeleteCancelledOrder, setShowDeleteCancelledOrder] =
    useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await authAxios(true, ApiEndpoints.getDeleteUserOrders);
      setOrders(response?.data?.data?.orders || []); // Handle empty data
    };
    fetchOrders();
  }, []);

  // Filter orders based on selected status
  const filteredOrders =
    filteredStatus === "all"
      ? orders
      : orders.filter((order) => order.status === filteredStatus);

  // Handle selection of cancelled orders
  const handleCheck = (orderId: any) => {
    setCheckedOrders((prevCheckedOrders: any) =>
      prevCheckedOrders.includes(orderId)
        ? prevCheckedOrders.filter((id: any) => id !== orderId) // Remove order if unchecked
        : [...prevCheckedOrders, orderId]
    );
  };

  // Toggle select all for cancelled orders
  const handleSelectAll = () => {
    setSelectAll((prevSelectAll) => !prevSelectAll);
    if (!selectAll) {
      const allCancelledOrders = filteredOrders
        .filter((order) =>
          ["cancelled", "completed"].includes(order.status as string)
        )
        .map((order) => order._id);
      setCheckedOrders(allCancelledOrders);
    } else {
      setCheckedOrders([]); // Deselect all
    }
  };

  const handleDeleteChecked = () => {
    setShowDeleteCancelledOrder(true);
  };

  const renderStatusFilter = () => (
    <Row>
      <Col xs={1} sm={1} lg={1} className="p-0 w-fit">
        <Form.Check
          style={{
            visibility: "hidden",
          }}
        />
      </Col>
      <Col xs={11} className="flex-1">
        <ButtonGroup className="mb-3 d-flex justify-content-center flex-wrap">
          {statuses.map((status) => (
            <Button
              key={status}
              className={`${
                filteredStatus === status ? "main-btn" : "outline-main-btn"
              }`}
              onClick={() => setFilteredStatus(status)}
            >
              {t(`orderComp.${status}`)}
            </Button>
          ))}
        </ButtonGroup>
      </Col>
    </Row>
  );

  const renderNoOrdersMessage = () => (
    <div className="text-center">{t("userOrder.noOrdersForStatus")}</div>
  );

  const renderOrders = () => (
    <Accordion defaultActiveKey="">
      {filteredOrders.map((order, index) => (
        <Row key={index}>
          <Col xs={1} sm={1} lg={1} className="p-0 w-fit">
            <Form.Check
              className="mt-2"
              disabled={
                !["cancelled", "completed"].includes(order.status as string)
              }
              type="checkbox"
              onChange={() => handleCheck(order._id)}
              checked={checkedOrders.includes(order._id)}
            />
          </Col>
          <Col xs={11} className="flex-1">
            <OrderComp order={order} index={index} />
          </Col>
        </Row>
      ))}
    </Accordion>
  );

  return (
    <Container className="mt-3">
      <div className="d-flex gap-5">
        <h2 className="text-center mb-3">{t("userOrder.title")}</h2>
        <div>
          {(() => {
            // Check if there is at least one cancelled or completed order
            const hasOneCancelledOrCompletedOrder = orders.some((or) =>
              ["cancelled", "completed"].includes(or.status as string)
            );

            // Check if there is at least one cancelled order
            const hasOneCancelledOrder = orders.some(
              (or) => or.status === "cancelled"
            );

            // Check if there is at least one completed order
            const hasOneCompletedOrder = orders.some(
              (or) => or.status === "completed"
            );

            return (
              <>
                {/* Show the button based on the filteredStatus */}
                {filteredStatus === "all" &&
                  hasOneCancelledOrCompletedOrder && (
                    <Button
                    className="mb-3 main-btn-dark"
                      onClick={handleSelectAll}
                    >
                      {selectAll && checkedOrders.length
                        ? t("userOrder.deselectAll")
                        : t("userOrder.selectAll")}
                    </Button>
                  )}

                {/* Additional conditions for specific status */}
                {filteredStatus === "cancelled" && hasOneCancelledOrder && (
                  <Button
                    className="mb-3 main-btn-dark"
                    onClick={handleSelectAll}
                  >
                    {selectAll && checkedOrders.length
                      ? t("userOrder.deselectAll")
                      : t("userOrder.selectCancelled")}
                  </Button>
                )}

                {filteredStatus === "completed" && hasOneCompletedOrder && (
                  <Button
                    className="mb-3 main-btn-dark"
                    onClick={handleSelectAll}
                  >
                    {selectAll && checkedOrders.length
                      ? t("userOrder.deselectAll")
                      : t("userOrder.selectCompleted")}
                  </Button>
                )}
              </>
            );
          })()}
          {checkedOrders.length > 0 && (
            <Button
              variant="outline-danger"
              className="mb-3"
              onClick={handleDeleteChecked}
              title={t("userOrder.deleteAll")}
            >
              <Icon className="fs-5" icon="ph:trash" />
            </Button>
          )}
        </div>
      </div>

      {checkedOrders.length > 0 && (
        <DeleteCancelledOrders
          show={showDeleteCancelledOrder}
          setShow={setShowDeleteCancelledOrder}
          cancelledOrders={checkedOrders}
          setCancelledOrders={setCheckedOrders}
        />
      )}

      {renderStatusFilter()}
      {filteredOrders.length === 0 ? renderNoOrdersMessage() : renderOrders()}
    </Container>
  );
};

export default UserOrders;
