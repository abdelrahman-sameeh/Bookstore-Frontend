import { useRecoilState, useSetRecoilState } from "recoil";
import { cartsState, targetCartState } from "../../../recoil/cartsAtom";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import authAxios from "../../../api/authAxios";
import { ApiEndpoints } from "../../../api/ApiEndpoints";
import { Container, Row, Col, Card, Accordion } from "react-bootstrap";
import LoadingButton from "../../../components/utils/LoadingButton";
import { Cart, BookItem } from "../../../interfaces/interfaces";
import notify from "../../../components/utils/Notify";
import DeleteCartDialog from "../../../components/dashboard/user/cart/DeleteCartDialog";
import { useTranslation } from "react-i18next";
import Icon from "../../../components/utils/Icon";
import CreateOrderDialog from "../../../components/dashboard/user/cart/CreateOrderDialog";

type LoadingState = {
  [key: string]: boolean;
};

const UserCart = () => {
  const { t } = useTranslation(); // Use translation hook
  const [carts, setCarts] = useRecoilState(cartsState);
  const [loading, setLoading] = useState<LoadingState>({});
  const [showDeleteCartDialog, setShowDeleteCartDialog] = useState(false);
  const setTargetCart = useSetRecoilState(targetCartState);
  const [decreaseCounts, setDecreaseCounts] = useState<BookItem[]>([]);
  const [increaseCounts, setIncreaseCounts] = useState<BookItem[]>([]);
  const [showCreateOrderDialog, setShowCreateOrderDialog] = useState(false);

  useEffect(() => {
    const fetchCarts = async () => {
      const response = await authAxios(true, ApiEndpoints.listCreateCart);
      setCarts(response?.data?.data?.carts);
    };
    fetchCarts();
  }, [setCarts]);

  // Utility function to handle count updates
  const updateCounts = (
    e: ChangeEvent<HTMLInputElement>,
    cartBook: BookItem,
    currentCounts: any[],
    setCounts: (counts: any[]) => void,
    maxCount: number
  ) => {
    const count =
      +e.target.value <= 0
        ? 1
        : +e.target.value > maxCount
        ? maxCount
        : +e.target.value;

    const existBook = currentCounts.some((item) => item._id === cartBook._id);

    if (!existBook) {
      // Update the count array directly
      const newCounts = [
        ...currentCounts,
        {
          count,
          _id: cartBook._id,
        },
      ];
      setCounts(newCounts);
    } else {
      const updatedCount = currentCounts.map((item) =>
        item._id === cartBook._id
          ? {
              count,
              _id: cartBook._id,
            }
          : item
      );
      setCounts(updatedCount);
    }
  };

  // Handler for decreasing count
  const handleChangeDecreaseInput = (
    e: ChangeEvent<HTMLInputElement>,
    cartBook: BookItem
  ) => {
    updateCounts(
      e,
      cartBook,
      decreaseCounts,
      setDecreaseCounts,
      cartBook.count
    );
  };

  // Handler for increasing count
  const handleChangeIncreaseInput = (
    e: ChangeEvent<HTMLInputElement>,
    cartBook: BookItem
  ) => {
    const bookCount = cartBook?.book?.count || 0;
    updateCounts(
      e,
      cartBook,
      increaseCounts,
      setIncreaseCounts,
      bookCount - cartBook.count
    );
  };

  const handleRemove = async (cart: Cart, cartBook: BookItem) => {
    setLoading((prev) => ({
      ...prev,
      [(cartBook._id as string) + "decrease"]: true,
    }));
    const count = decreaseCounts.find(
      (cBooks) => cBooks._id === cartBook._id
    )?.count;

    const response = await authAxios(
      true,
      ApiEndpoints.deleteBookFromCart(cartBook?.book?._id as string),
      "DELETE",
      {
        count,
        cartId: cart?._id,
      }
    );
    setLoading((prevLoading) => {
      const newLoading = { ...prevLoading };
      if (newLoading[(cartBook._id as string) + "decrease"]) {
        delete newLoading[(cartBook._id as string) + "decrease"];
      }
      return newLoading;
    });

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

  const handleAdd = async (cart: Cart, cartBook: BookItem) => {
    const count =
      increaseCounts.find((book) => book._id === cartBook._id)?.count || 1;

    setLoading((prev) => ({
      ...prev,
      [(cartBook._id as string) + "increase"]: true,
    }));

    const response = await authAxios(
      true,
      ApiEndpoints.listCreateCart,
      "POST",
      {
        book: cartBook.book._id,
        count,
      }
    );
    setLoading((prevLoading) => {
      const newLoading = { ...prevLoading };
      if (newLoading[(cartBook._id as string) + "increase"]) {
        delete newLoading[(cartBook._id as string) + "increase"];
      }
      return newLoading;
    });

    if (response?.status === 200) {
      notify(t("userCart.addBookSuccessfully"));
      // update increase count
      const updatedIncreaseCount = increaseCounts.map((item) => {
        return item?._id === cartBook?._id ? { ...item, count: 1 } : item;
      });
      setIncreaseCounts(updatedIncreaseCount);
      // update carts
      const updatedCarts = carts.map((c) => {
        return c._id === cart._id ? response?.data?.data?.cart : c;
      });
      setCarts(updatedCarts);
    } else {
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
      />
      <CreateOrderDialog
        show={showCreateOrderDialog}
        setShow={setShowCreateOrderDialog}
      />
      <Accordion defaultActiveKey="0">
        {carts.map((cart, index) => (
          <Accordion.Item
            className="alt-bg"
            eventKey={index.toString()}
            key={cart._id}
          >
            <Accordion.Header>
              <div className="d-flex align-items-center gap-1">
                <span>#{index + 1} -</span>
                {t("userCart.totalPrice", {
                  price: cart?.totalPrice?.toFixed(2),
                })}{" "}
              </div>
            </Accordion.Header>
            <Accordion.Body>
              <div className="d-flex mb-3 gap-1 flex-wrap">
                <LoadingButton
                  onClick={() => {
                    setTargetCart(cart);
                    setShowCreateOrderDialog(true);
                  }}
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
                <Card className="primary-bg mb-3 rounded-0" key={cartBook._id}>
                  <Row className="g-0 main-text">
                    <Col md={4}>
                      <Card.Img
                        src={cartBook?.book?.imageCover}
                        alt={cartBook?.book?.title}
                        className="h-100 w-100 object-fit-cover"
                        style={{
                          borderRadius: "0",
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
                          <span className="fs-5 text-success fw-bold text-decoration-underline">
                            {cartBook?.count}
                          </span>
                          <br />
                          <strong>{t("userCart.total")}:</strong> $
                          {(
                            (cartBook?.book?.price as number) * cartBook?.count
                          ).toFixed(2)}
                          <br />
                          <strong className="text-success">
                            {t("userCart.numberOfAvailableBooks")}:
                            <span className="text-decoration-underline fs-5 mx-1">
                              {cartBook?.book?.count}
                            </span>
                          </strong>{" "}
                          <br />
                          <strong>
                            {t("userCart.bookStatus")}:
                            <span className="text-success text-decoration-underline fs-5 mx-1">
                              {cartBook?.book?.status}
                            </span>
                          </strong>{" "}
                        </Card.Text>

                        <Accordion>
                          <Accordion.Item eventKey="0">
                            <Accordion.Header>
                              {t("userCart.controls")}
                            </Accordion.Header>
                            <Accordion.Body >
                              <form
                                onSubmit={(e: FormEvent) => {
                                  e.preventDefault();
                                  handleRemove(cart, cartBook);
                                }}
                              >
                                <label
                                  htmlFor="removeCount"
                                  className="fw-bold main-text mb-1"
                                >
                                  {t("userCart.removeCount")}
                                </label>
                                <div className="d-flex align-items-center gap-1">
                                  <input
                                    id="removeCount"
                                    onChange={(e) =>
                                      handleChangeDecreaseInput(e, cartBook)
                                    }
                                    type="number"
                                    value={
                                      decreaseCounts.find(
                                        (item) => item._id === cartBook._id
                                      )?.count || 1
                                    }
                                    className="form-control"
                                  />
                                  <LoadingButton
                                    type="submit"
                                    variant="error"
                                    style={{ width: "fit-content" }}
                                    loading={
                                      loading[
                                        (cartBook?._id as string) + "decrease"
                                      ]
                                    }
                                  >
                                    <Icon icon={"ph:trash"} />
                                  </LoadingButton>
                                </div>
                              </form>

                              {cartBook.book.status === "offline" &&
                              (cartBook?.book?.count as number) !==
                                cartBook.count ? (
                                <form
                                  className="mt-2"
                                  onSubmit={(e: FormEvent) => {
                                    e.preventDefault();
                                    handleAdd(cart, cartBook);
                                  }}
                                >
                                  <label
                                    htmlFor="bookCount"
                                    className="fw-bold mb-1"
                                  >
                                    {t("userCart.addCount")}
                                  </label>
                                  <div className="d-flex align-items-center gap-1">
                                    <input
                                      id="bookCount"
                                      type="number"
                                      onChange={(e) =>
                                        handleChangeIncreaseInput(e, cartBook)
                                      }
                                      value={
                                        increaseCounts.find(
                                          (item) => item._id === cartBook._id
                                        )?.count || 1
                                      }
                                      className="form-control"
                                    />
                                    <LoadingButton
                                      type="submit"
                                      style={{ width: "fit-content" }}
                                      loading={
                                        loading[
                                          (cartBook?._id as any) + "increase"
                                        ]
                                      }
                                    >
                                      <Icon icon={"ph:plus"} />
                                    </LoadingButton>
                                  </div>
                                </form>
                              ) : (
                                <div className="pt-2 fw-bold text-warning">
                                  {t("userCart.lastBook", {
                                    booksCount: cartBook.count,
                                  })}
                                </div>
                              )}
                            </Accordion.Body>
                          </Accordion.Item>
                        </Accordion>
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
