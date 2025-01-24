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
} from "react-bootstrap";
import OrderComp from "../../../components/utils/OrderComp";
import MakeOrdersCompleted from "../../../components/dashboard/delivery/MakeOrdersCompleted";
import { Link } from "react-router-dom";
import Icon from "../../../components/utils/Icon";

export const statuses = ["In Delivery", "Delivered"];

const DeliveryOrders = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = useRecoilState(ordersState);
  const [filteredStatus, setFilteredStatus] = useState("In Delivery");
  const [checkedOrders, setCheckedOrders] = useState<any>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showOrdersDialog, setShowOrdersDialog] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      const query = `?status=${
        filteredStatus === "In Delivery" ? "pending" : "delivered"
      }`;
      const response = await authAxios(
        true,
        ApiEndpoints.getDeliveryOrders(query)
      );
      setOrders(response?.data?.data?.orders || []); // Handle empty data
    };
    fetchOrders();
  }, [filteredStatus]);

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
      const allCancelledOrders = orders
        .filter((order) => ["inDelivery"].includes(order.status as string))
        .map((order) => order._id);
      setCheckedOrders(allCancelledOrders);
    } else {
      setCheckedOrders([]); // Deselect all
    }
  };

  const renderControlButtons = () => (
    <Row className="mb-3">
      <Col xs={1} sm={1} lg={1} className="p-0 w-fit">
        <Form.Check style={{ visibility: "hidden" }} />
      </Col>
      <Col xs={11} className="flex-1">
        <Row>
          <Col sm={12} className="mt-3">
            <ButtonGroup className="mb-3 d-flex justify-content-center flex-wrap">
              {statuses.map((status) => (
                <Button
                  key={status}
                  className={
                    filteredStatus === status
                      ? "main-btn-dark"
                      : "outline-main-btn"
                  }
                  onClick={() => {
                    setFilteredStatus(status);
                  }}
                >
                  {t(`deliveryOrder.${status}`)}
                </Button>
              ))}
            </ButtonGroup>
          </Col>
        </Row>
      </Col>
    </Row>
  );

  const renderNoOrdersMessage = () => (
    <div className="text-center">{t("deliveryOrder.noOrdersForStatus")}</div>
  );

  const renderOrders = () => (
    <Accordion defaultActiveKey="">
      {orders.map((order, index) => (
        <Row key={index}>
          <Col xs={1} className="p-0 w-fit">
            <Form.Check
              className="mt-2"
              disabled={order.status != "inDelivery"}
              type="checkbox"
              onChange={() => handleCheck(order._id)}
              checked={checkedOrders.includes(order._id)}
            />
          </Col>
          <Col xs={1} className="w-fit mt-2">
            <a
              href={`/chat/${order?.user}`}
              className="btn outline-main-btn-dark pt-0"
              title={t("deliveryOrder.connectWithReceiver")}
            >
              <Icon icon="tabler:message" />
            </a>
          </Col>
          <Col xs={10} className="flex-1">
            <OrderComp order={order} index={index} />
          </Col>
        </Row>
      ))}
    </Accordion>
  );

  return (
    <div className="container">
      {(() => {
        const hasPending = orders.some((or) => or.status === "inDelivery");
        return hasPending ? (
          <Row className="mt-3">
            <Col xs={1} sm={1} lg={1} className="p-0 w-fit">
              <Form.Check style={{ visibility: "hidden" }} />
            </Col>
            <Col xs={11} className="flex-1">
              <Button variant="warning" onClick={handleSelectAll}>
                {selectAll && checkedOrders.length
                  ? t("deliveryOrder.deselectAll")
                  : t("deliveryOrder.selectAll")}
              </Button>
              {checkedOrders.length ? (
                <Button
                  onClick={() => {
                    setShowOrdersDialog(true);
                  }}
                  variant="success"
                >
                  {t("deliveryOrder.makeOrdersDelivered")}
                </Button>
              ) : null}
            </Col>
          </Row>
        ) : null;
      })()}

      {renderControlButtons()}
      {orders.length === 0 ? renderNoOrdersMessage() : renderOrders()}

      {checkedOrders.length ? (
        <MakeOrdersCompleted
          show={showOrdersDialog}
          setShow={setShowOrdersDialog}
          ordersIds={checkedOrders}
          setOrdersIds={setCheckedOrders}
        />
      ) : null}
    </div>
  );
};

export default DeliveryOrders;
