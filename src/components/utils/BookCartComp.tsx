import Icon from "./Icon";
import { Accordion, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import LoadingButton from "./LoadingButton";
import useLoggedInUser from "../../hooks/useLoggedInUser";
import { Book } from "../../interfaces/interfaces";
import DeleteBookDialog from "../dashboard/owner/book/DeleteBookDialog";
import { useState } from "react";
import authAxios from "../../api/authAxios";
import { ApiEndpoints } from "../../api/ApiEndpoints";
import notify from "./Notify";
import DenyDialog from "../dashboard/admin/book/DenyDialog";

type BookCartType = {
  book: Book;
  showControls?: boolean;
  setShowCreateUpdateDialog?: any;
  setCreateUpdateDialogMethod?: any;
  setTargetBook?: any;
};

const BookCartComp = ({
  book,
  showControls = false,
  setShowCreateUpdateDialog,
  setCreateUpdateDialogMethod,
  setTargetBook,
}: BookCartType) => {
  const { t } = useTranslation();
  const { user } = useLoggedInUser();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [loadings, setLoadings] = useState<string[]>([]);
  const [showDenyDialog, setShowDenyDialog] = useState(false);

  // admin role
  const handleApprovedBook = async () => {
    setLoadings((prev) => [...prev, book._id as string]);
    const response = await authAxios(
      true,
      ApiEndpoints.reviewBook(book._id as string),
      "PATCH",
      { reviewStatus: "approved" }
    );
    setLoadings((prev) => prev.filter((item) => item != (book._id as string)));

    if (response.status === 200) {
      notify(t("approveDialog.approvedSuccessfully"));
    } else {
      notify(t("approveDialog.somethingWentWrong"), "error");
    }
  };

  const handleDeny = () => {
    setShowDenyDialog(true);
  };

  const handleAddBookToCart = async () => {
    setLoadings((prev) => [...prev, book._id as string]);
    const response = await authAxios(
      true,
      ApiEndpoints.listCreateCart,
      "POST",
      {
        book: book._id,
        count: 1,
      }
    );
    setLoadings((prev) => prev.filter((item) => item != (book._id as string)));
    if (response?.status == 200) {
      notify(t("exploreBooks.addToCartSuccessfully"));
    } else if (response?.data?.message === "book count is not available") {
      notify(t("exploreBooks.addToCartFailedOutOfRange"), "error");
    } else if (response?.data?.message === "you already have this book in your library") {
      notify(t("exploreBooks.alreadyHaveBook"), 'warn');
    } else {
      notify(t("exploreBooks.addToCartFailed"), "error");
    }
  };

  return (
    <div className="position-relative main-border">
      {user.role === "admin" ? (
        <>
          <div className="d-flex secondary-bg w-100 p-1 gap-1">
            <LoadingButton
              loading={loadings.includes(book._id as string)}
              onClick={handleApprovedBook}
              title={"approve"}
              className="outline-main-btn bg-success w-fit"
            >
              <Icon icon="mdi:success-bold" />
            </LoadingButton>
            <Button
              onClick={handleDeny}
              disabled={loadings.includes(book._id as string)}
              title={"deny"}
              className="w-fit"
              variant="outline-danger"
            >
              <Icon icon="akar-icons:cross" />
            </Button>
          </div>

          <DenyDialog
            showDenyDialog={showDenyDialog}
            setShowDenyDialog={setShowDenyDialog}
            book={book}
          />
        </>
      ) : null}

      {user.role === "owner" && showControls ? (
        <div
          style={{ top: 0 }}
          className="d-flex w-100 p-1 secondary-bg"
        >
          <div className="d-flex gap-1">
            <Button
              onClick={() => {
                setShowCreateUpdateDialog(true);
                setCreateUpdateDialogMethod("update");
                setTargetBook(book);
              }}
              className="outline-main-btn"
              title={t("exploreBooks.updateBook")}
            >
              <Icon icon="tabler:edit" />
            </Button>
            <Button
              title={t("exploreBooks.deleteBook")}
              variant="outline-danger"
              onClick={() => {
                setShowDeleteDialog(true);
              }}
            >
              <Icon icon="ph:trash" />
            </Button>
          </div>
        </div>
      ) : null}

      <img
        style={{ height: "250px", objectFit: "cover" }}
        className="w-100"
        src={book.imageCover}
        alt={book.title}
      />

      {user?.role == "user" ? (
        <LoadingButton
          loading={loadings.includes(book._id as string)}
          onClick={handleAddBookToCart}
          className="w-100"
        >
          {t("exploreBooks.addToCart")}
          <Icon className="fs-4" icon="mdi:cart" />
        </LoadingButton>
      ) : null}

      <Accordion defaultActiveKey={book._id}>
        <Accordion.Item eventKey="0" className="rounded-0">
          <Accordion.Header>{book.title}</Accordion.Header>
          <Accordion.Body className="main-text">
            <p className="text-capitalize">
              <span className="fw-bold">{t("exploreBooks.author")}:</span>{" "}
              {book.author}
            </p>
            <p className="text-capitalize">
              <span className="fw-bold">{t("exploreBooks.price")}:</span>{" "}
              {book.price}$
            </p>
            <p className="text-capitalize">
              <span className="fw-bold">{t("exploreBooks.sold")}:</span>{" "}
              {book.sales}
            </p>
            <p className="text-capitalize">
              <span className="fw-bold">
                {t("exploreBooks.paymentMethod")}:
              </span>{" "}
              {book.status}
            </p>
            <p className="text-capitalize">
              <span className="fw-bold">{t("exploreBooks.category")}:</span>{" "}
              {book.category.name}
            </p>
            {/* make sure don't show in owner page */}
            {!showControls ? (
              <>
                <hr />
                <p className="text-capitalize">
                  <span className="fw-bold">{t("exploreBooks.seller")}:</span>{" "}
                  {book?.owner?.name}
                </p>
              </>
            ) : null}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      {showControls && user.role == "owner" ? (
        <DeleteBookDialog
          showDeleteDialog={showDeleteDialog}
          setShowDeleteDialog={setShowDeleteDialog}
          book={book}
        />
      ) : null}
    </div>
  );
};

export default BookCartComp;
