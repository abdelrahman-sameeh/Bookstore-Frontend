import Icon from "./Icon";
import { Accordion } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import LoadingButton from "./LoadingButton";
import useLoggedInUser from "../../hooks/useLoggedInUser";
import { Book } from "../../interfaces/interfaces";
import DeleteBookDialog from "../dashboard/owner/DeleteBookDialog";
import { useState } from "react";

type BookCartType = { book: Book; showControls?: boolean };

const BookCartComp = ({ book, showControls = false }: BookCartType) => {
  const { t } = useTranslation();
  const { user } = useLoggedInUser();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <div className="book-card position-relative border">
      {user.role === "owner" && showControls ? (
        <div style={{ top: 0 }} className="d-flex w-100 bg-light p-1">
          <button onClick={() => {
            setShowDeleteDialog(true)
          }} title={"Delete Book"} className="border-0 bg-light">
            <Icon
              className="fs-4 text-danger"
              icon="material-symbols:delete-outline"
            />
          </button>
          <button title={"Update Book"} className="border-0 bg-light">
            <Icon className="fs-4" icon="carbon:ibm-data-product-exchange" />
          </button>
        </div>
      ) : null}

      <img
        style={{ height: "250px", objectFit: "cover" }}
        className="w-100"
        src={book.imageCover}
        alt={book.title}
      />

      {user?.role == "user" ? (
        <LoadingButton className="w-100">
          {t("exploreBooks.addToCart")}
          <Icon className="fs-4" icon="mdi:cart" />
        </LoadingButton>
      ) : null}

      <Accordion defaultActiveKey={book._id}>
        <Accordion.Item eventKey="0" className="rounded-0">
          <Accordion.Header>{book.title}</Accordion.Header>
          <Accordion.Body>
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
