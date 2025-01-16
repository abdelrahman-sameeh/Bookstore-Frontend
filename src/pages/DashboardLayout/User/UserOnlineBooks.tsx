import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import authAxios from "../../../api/authAxios";
import { ApiEndpoints } from "../../../api/ApiEndpoints";
import { useRecoilState } from "recoil";
import { userBooksState } from "../../../recoil/bookAtom";
import { Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

const UserOnlineBooks = () => {
  const { t } = useTranslation();
  const [books, setBooks] = useRecoilState(userBooksState);

  useEffect(() => {
    authAxios(true, ApiEndpoints.getUserOnlineBooks).then((response) => {
      setBooks(response?.data?.data?.books);
    });
  }, [setBooks]);

  return (
    <div className="container p-2 alt-bg ">
      <h2>{t("userOnlineBooks.title")}</h2>{" "}
      <Row>
        {books.map((book) => (
          <Col key={book._id} sm={6} md={4} lg={3} className="mb-4">
            <Card>
              <Link to={`/dashboard/user/books/${book._id}`}>
                <Card.Img
                  style={{ height: "200px", objectFit: "cover" }}
                  variant="top"
                  src={book.imageCover}
                />
                <Card.Body className="secondary-bg main-text rounded-bottom">
                  <Card.Title>{book.title}</Card.Title>
                  <Card.Text>
                    <small>
                      {t("userOnlineBooks.author", { name: book.author })}
                    </small>
                    <br />
                    <small>
                      {t("userOnlineBooks.category", {
                        name: book.category.name,
                      })}
                    </small>{" "}
                  </Card.Text>
                </Card.Body>
              </Link>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default UserOnlineBooks;
