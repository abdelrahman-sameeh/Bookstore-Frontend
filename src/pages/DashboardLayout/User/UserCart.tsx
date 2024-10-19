import { useRecoilState } from "recoil";
import { cartsState } from "../../../recoil/cartsAtom";
import { FormEvent, useEffect, useState } from "react";
import authAxios from "../../../api/authAxios";
import { ApiEndpoints } from "../../../api/ApiEndpoints";
import { Container, Row, Col, Card, Accordion } from "react-bootstrap";
import LoadingButton from "../../../components/utils/LoadingButton";
import { Cart, CartBook } from "../../../interfaces/interfaces";
import notify from "../../../components/utils/Notify";
import DeleteCartDialog from "../../../components/dashboard/user/cart/DeleteCartDialog";
import { useTranslation } from "react-i18next";
import Icon from "../../../components/utils/Icon";

const UserCart = () => {
  const { t } = useTranslation(); // Use translation hook
  const [carts, setCarts] = useRecoilState(cartsState);
  const [loading, setLoading] = useState<string[]>([]);
  const [showDeleteCartDialog, setShowDeleteCartDialog] = useState(false);
  const [targetCart, setTargetCart] = useState<Cart>({});
  const [counts, setCounts] = useState<CartBook[]>([]);

  useEffect(() => {
    const fetchCarts = async () => {
      const response = await authAxios(true, ApiEndpoints.listCreateCart);
      setCarts(response?.data?.data?.carts);
    };
    fetchCarts();
  }, [setCarts]);

  const handleRemoveOne = async (cart: Cart, cartBook: CartBook) => {
    setLoading((prev) => [...prev, cartBook._id as string]);
    const count = counts.find((cBooks) => cBooks._id === cartBook._id)?.count;

    const response = await authAxios(
      true,
      ApiEndpoints.deleteBookFromCart(cartBook?.book?._id as string),
      "DELETE",
      {
        count,
        cartId: cart?._id,
      }
    );
    setLoading((prev) => prev.filter((item) => item !== cartBook._id));

    if (response.status === 200) {
      notify(t("userCart.deleteOneSuccess")); // Use translation key
      const updatedCarts = carts.map((c) =>
        c._id === cart._id ? response?.data?.data?.cart : c
      );
      setCarts(updatedCarts);
    } else if (response.status === 204) {
      notify(t("userCart.deleteCartSuccess")); // Use translation key
      setCarts((prev) => prev.filter((item) => item._id !== cart._id));
    } else {
      notify(t("userCart.somethingWentWrong"), "error"); // Use translation key
    }
  };

  if (!carts || carts.length === 0) {
    return <div className="text-center">{t("userCart.emptyCart")}</div>; // Use translation key
  }

  return (
    <Container className="mt-4">
      <h2>{t("userCart.title")}</h2> {/* Use translation key */}
      <DeleteCartDialog
        show={showDeleteCartDialog}
        setShow={setShowDeleteCartDialog}
        cart={targetCart}
        setCart={setTargetCart}
      />
      <Accordion defaultActiveKey="0">
        {carts.map((cart, index) => (
          <Accordion.Item
            className="alt-bg"
            eventKey={index.toString()}
            key={cart._id}
          >
            <Accordion.Header>
              {t("userCart.totalPrice", {
                price: cart?.totalPrice?.toFixed(2),
              })}{" "}
              {/* Use translation key */}
            </Accordion.Header>
            <Accordion.Body>
              <div className="d-flex mb-3 gap-1">
                <LoadingButton
                  onClick={() => alert(t("userCart.proceedCheckout"))} // Use translation key
                >
                  {t("userCart.createOrder")}
                </LoadingButton>
                <LoadingButton
                  variant="error"
                  onClick={() => {
                    setShowDeleteCartDialog(true);
                    setTargetCart(cart);
                  }}
                >
                  {t("userCart.deleteCart")} {/* Use translation key */}
                </LoadingButton>
              </div>

              {cart?.books?.map((cartBook) => (
                <Card className="mb-3 rounded-0" key={cartBook._id}>
                  <Row className="g-0 main-bg main-text">
                    <Col md={4}>
                      <Card.Img
                        src={cartBook?.book?.imageCover}
                        alt={cartBook?.book?.title}
                        style={{
                          height: "250px",
                          objectFit: "cover",
                          borderRadius: "0",
                          width: "100%",
                        }}
                      />
                    </Col>
                    <Col md={8}>
                      <Card.Body className="h-100 rounded-0">
                        <Card.Title>{cartBook?.book?.title}</Card.Title>
                        <Card.Text>
                          <strong>{t("userCart.author")}:</strong>{" "}
                          {cartBook?.book?.author}
                          <br />
                          <strong>{t("userCart.category")}:</strong>{" "}
                          {cartBook?.book?.category.name}
                          <br />
                          <strong>{t("userCart.price")}:</strong> $
                          {cartBook?.book?.price?.toFixed(2)}
                          <br />
                          <strong>{t("userCart.quantity")}:</strong>{" "}
                          {cartBook?.count}
                          <br />
                          <strong>{t("userCart.total")}:</strong> $
                          {(
                            (cartBook?.book?.price as number) * cartBook?.count
                          ).toFixed(2)}
                        </Card.Text>
                        <form
                          onSubmit={(e: FormEvent) => {
                            e.preventDefault();
                            handleRemoveOne(cart, cartBook);
                          }}
                        >
                          <label htmlFor="bookCount" className="fw-bold mb-1">
                            {t("userCart.removeCount")}
                          </label>
                          <div className="d-flex align-items-center gap-1">
                            <input
                              id={"bookCount"}
                              onChange={(e) => {
                                const existBook = counts.some(
                                  (item) => item._id === cartBook._id
                                );
                                if (!existBook) {
                                  setCounts(
                                    (prev) =>
                                      [
                                        ...prev,
                                        {
                                          count:
                                            +e.target.value <= 0
                                              ? 1
                                              : +e.target.value > cartBook.count
                                              ? cartBook.count
                                              : e.target.value,
                                          _id: cartBook._id,
                                        },
                                      ] as any
                                  );
                                } else {
                                  const updatedCount = counts.map((item) => {
                                    if (item._id == cartBook._id) {
                                      return {
                                        count:
                                          +e.target.value <= 0
                                            ? 1
                                            : +e.target.value > cartBook.count
                                            ? cartBook.count
                                            : e.target.value,
                                        _id: cartBook._id,
                                      };
                                    } else {
                                      return item;
                                    }
                                  });
                                  setCounts(updatedCount as any);
                                }
                              }}
                              type="number"
                              value={
                                counts.find((item) => item._id == cartBook._id)
                                  ?.count || 1
                              }
                              className="form-control"
                            />
                            <LoadingButton
                              type={"submit"}
                              variant="error"
                              style={{width: 'fit-content'}}
                              loading={loading.includes(
                                cartBook?._id as string
                              )}
                            >
                              <Icon icon={"ph:trash"} />
                            </LoadingButton>
                          </div>
                        </form>
                      </Card.Body>
                    </Col>
                  </Row>
                </Card>
              ))}
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </Container>
  );
};

export default UserCart;
