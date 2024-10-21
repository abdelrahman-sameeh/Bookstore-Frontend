import { Accordion, Badge, Card, Col, Row } from "react-bootstrap";
import { Order } from "../../interfaces/interfaces";
import { useTranslation } from "react-i18next";
import LoadingButton from "./LoadingButton";
import useLoggedInUser from "../../hooks/useLoggedInUser";
import authAxios from "../../api/authAxios";
import { ApiEndpoints } from "../../api/ApiEndpoints";
import {  useState } from "react";
import { useRecoilState } from "recoil";
import { ordersState } from "../../recoil/ordersAtom";
import notify from "./Notify";

const _getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "warning";
    case "inProgress":
      return "info";
    case "inDelivery":
      return "primary";
    case "completed":
      return "success";
    case "cancelled":
      return "danger";
    default:
      return "info";
  }
};

const OrderComp = ({ order, index }: { order: Order; index: number}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const { user } = useLoggedInUser();
  const [orders, setOrders] = useRecoilState(ordersState);

  const handleCancelOrder = async () => {
    setLoading(true);
    const response = await authAxios(
      true,
      ApiEndpoints.cancelOrder(order._id as string),
      "PATCH",
      {
        status: "cancelled",
      }
    );
    setLoading(false);
    if (response.status === 200) {
      const updatedOrders = orders.map((ord) =>
        ord._id === order._id ? { ...ord, status: "cancelled" } : ord
      );
      setOrders(updatedOrders);
      notify("order cancelled successfully");
    } else {
      notify("something went wrong", "error");
    }
    console.log(response);
  };

  return (
    <Accordion.Item
      eventKey={index.toString()}
      className="alt-bg"
      key={order._id}
      
    >
      <Accordion.Header>
        <div className="d-flex align-items-center gap-2">
          <span>#{index + 1}</span>
          <span>
            {t("orderComp.finalPrice")} :{" "}
            <span className="fw-bold">{order.finalPrice} $</span>
          </span>
          <Badge
            bg={_getStatusColor(order.status as string)}
            className="ms-auto"
          >
            {t(`orderComp.${order.status}`)}
          </Badge>
        </div>
      </Accordion.Header>
      <Accordion.Body>
        {user.role === "user" &&
        (order.status == "pending" || order.status == "inProgress") ? (
          <LoadingButton
            loading={loading}
            onClick={handleCancelOrder}
            type={"button"}
            variant="error"
            className="mb-3"
          >
            cancel order
          </LoadingButton>
        ) : null}

        <div className="d-flex flex-wrap column-gap-4 mb-3 main-text">
          {order.totalPrice != order.finalPrice ? (
            <div>
              <strong>{t("orderComp.totalPrice")}: </strong>
              <span className="fw-bold">{order.totalPrice} $</span>
            </div>
          ) : null}
          {order.discount ? (
            <div>
              <strong>{t("orderComp.discount")}: </strong>
              <span className="fw-bold">{order.discount} %</span>
            </div>
          ) : null}
          <div>
            <strong>{t("orderComp.finalPrice")}: </strong>
            <span className="fw-bold">{order.finalPrice} $</span>
          </div>

          {(() => {
            let tax = 0;
            if (order.discount && order.totalPrice && order.finalPrice) {
              const discountAmount = (+order.totalPrice * order.discount) / 100;
              tax = order.finalPrice - discountAmount;
            }
            if (!order.discount && order.totalPrice && order.finalPrice) {
              tax = order.finalPrice - order.totalPrice;
            }
            return tax > 0 ? (
              <div>
                <strong className=" text-capitalize">
                  {t("orderComp.tax")}:{" "}
                </strong>
                <span className="fw-bold">{tax.toFixed(2)} $</span>
              </div>
            ) : null;
          })()}

          <div>
            <strong>{t("orderComp.paymentType")}: </strong>
            <Badge bg="secondary" className="fw-bold">
            {t(`orderComp.${order.paymentType}`)}

            </Badge>
          </div>
          <div>
            <strong>{t("orderComp.paymentStatus")}: </strong>
            <Badge
              bg={order.paymentStatus === "paid" ? "success" : "danger"}
              className="fw-bold"
            >
            {t(`orderComp.${order.paymentStatus}`)}
            </Badge>
          </div>
        </div>
        <Row>
          {order?.books?.map((orderBook) => (
            <Col key={orderBook._id} md={6} className="mb-4">
              <Card className="h-100 shadow-sm rounded-0">
                <Card.Img
                  src={orderBook?.book?.imageCover}
                  alt={orderBook?.book?.title}
                  style={{
                    height: "220px",
                    objectFit: "cover",
                    borderRadius: "0",
                    width: "100%",
                  }}
                />
                <Card.Body className="main-theme">
                  <Card.Title className="text-truncate">
                    {orderBook?.book?.title}
                  </Card.Title>
                  <Card.Text>
                    <strong>{t("orderComp.author")}:</strong>{" "}
                    {orderBook?.book?.author}
                    <br />
                    <strong>{t("orderComp.category")}:</strong>{" "}
                    {orderBook?.book?.category.name}
                    <br />
                    <strong>{t("orderComp.price")}:</strong>{" "}
                    {orderBook?.book?.price?.toFixed(2)} $
                    <br />
                    <strong>{t("orderComp.quantity")}:</strong>{" "}
                    <span className="fs-5 text-success fw-bold">
                      {orderBook?.count}
                    </span>
                    <br />
                    <strong>{t("orderComp.bookStatus")}:</strong>{" "}
                    <Badge bg={"success"}>{orderBook?.book?.status}</Badge>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Accordion.Body>
    </Accordion.Item>
  );
};

export default OrderComp;
