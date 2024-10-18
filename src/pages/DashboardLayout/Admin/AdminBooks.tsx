import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Col, Row, Form, Pagination } from "react-bootstrap";
import authAxios from "../../../api/authAxios";
import { ApiEndpoints } from "../../../api/ApiEndpoints";
import Icon from "../../../components/utils/Icon";
import BookCartComp from "../../../components/utils/BookCartComp";
import { Book, Category, PaginationData } from "../../../interfaces/interfaces";
import { ownerBookState } from "../../../recoil/bookAtom";
import { useRecoilState } from "recoil";
import useDebounce from "../../../hooks/useDebounce";

const AdminBooks = () => {
  const { t } = useTranslation();
  const [books, setBooks] = useRecoilState(ownerBookState);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({});
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm);

  // States for filters
  const [priceOrder, setPriceOrder] = useState<"asc" | "desc" | null>(null);
  const [salesOrder, setSalesOrder] = useState<"asc" | "desc" | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [booksPerPage, setBooksPerPage] = useState(8); // Default number of books per page

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch categories
  useEffect(() => {
    authAxios(false, ApiEndpoints.getCategories).then((response) => {
      setCategories(response?.data?.data?.categories || []);
    });
  }, []);


  // Generate query string based on filters
  const generateQueryString = () => {
    let query = [];
    if (debouncedSearchTerm) {
      query.push(`search=${debouncedSearchTerm}`);
    }
    if (selectedCategories.length > 0) {
      query.push(`categories=${selectedCategories.join(",")}`);
    }
    if (priceOrder) {
      query.push(`price=${priceOrder}`);
    }
    if (salesOrder) {
      query.push(`sales=${salesOrder}`);
    }
    query.push(`page=${currentPage}`);
    query.push(`limit=${booksPerPage}`);

    return query.length > 0 ? `?${query.join("&")}` : "";
  };

  // Fetch books when filters or search term change
  useEffect(() => {
    const queryString = generateQueryString();
    authAxios(true, ApiEndpoints.getAdminBooks(queryString)).then((response) => {
      setBooks(response?.data?.data?.books || []);
      setPagination(response?.data?.pagination || {});
    });
  }, [
    debouncedSearchTerm,
    selectedCategories,
    currentPage,
    priceOrder,
    salesOrder,
    booksPerPage,
  ]);

  const handleCategoryChange = (categoryId: string) => {
    setCurrentPage(1);
    setSelectedCategories((prevCategories) => {
      if (prevCategories.includes(categoryId)) {
        return prevCategories.filter((id) => id !== categoryId);
      } else {
        return [...prevCategories, categoryId];
      }
    });
  };

  // Toggle filters display
  const toggleFilters = () => {
    setShowFilters((prevShowFilters) => !prevShowFilters);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle books per page change
  const handleBooksPerPageChange = (event: any) => {
    setBooksPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to the first page when changing the number of books per page
  };

  // Render pagination items
  const renderPagination = () => {
    const totalPages = pagination.pages || 1;
    const pageItems = [];

    for (let i = 1; i <= totalPages; i++) {
      pageItems.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    return pageItems;
  };

  return (
    <section className="explore-books">
      <div className="container p-2 alt-bg">
        <h4 className="text-capitalize p-2">
          {" "}
          {t("dashboard.admin.links.manageBooks")}{" "}
        </h4>

        <div className="d-flex gap-1 align-items-center position-relative">
          <input
            className="form-control rounded-0 main-bg"
            type="search"
            placeholder={t("exploreBooks.searchBooks")}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <div onClick={toggleFilters}>
            <Icon className="fs-2 pointer" icon="carbon:filter" />
          </div>

          <div
            style={{
              top: "40px",
              right: "0",
              zIndex: "9",
            }}
            className={`filters ${
              showFilters ? "active" : ""
            } position-absolute w-100 alt-bg`}
          >
            <Row className="p-2">
              <Col lg={4} xs={6} className="mt-3">
                <h5>{t("exploreBooks.price")}</h5>
                <Form.Check
                  id="price-desc"
                  className="d-flex align-items-center gap-1"
                  type="radio"
                  label={t("exploreBooks.mostExpensive")}
                  name="price"
                  value="desc"
                  onChange={() => setPriceOrder("desc")}
                  checked={priceOrder === "desc"}
                />
                <Form.Check
                  id="price-asc"
                  className="d-flex align-items-center gap-1"
                  type="radio"
                  label={t("exploreBooks.leastExpensive")}
                  name="price"
                  value="asc"
                  onChange={() => setPriceOrder("asc")}
                  checked={priceOrder === "asc"}
                />
                {priceOrder ? (
                  <button
                    onClick={() => setPriceOrder(null)}
                    className="btn main-bg main-text mt-1"
                  >
                    {t("exploreBooks.removeSelected")}
                  </button>
                ) : null}
              </Col>

              <Col lg={4} xs={6} className="mt-3">
                <h5>{t("exploreBooks.sales")}</h5>
                <Form.Check
                  id="sales-desc"
                  className="d-flex align-items-center gap-1"
                  type="radio"
                  label={t("exploreBooks.mostSold")}
                  name="sales"
                  value="desc"
                  onChange={() => setSalesOrder("desc")}
                  checked={salesOrder === "desc"}
                />
                <Form.Check
                  id="sales-asc"
                  className="d-flex align-items-center gap-1"
                  type="radio"
                  label={t("exploreBooks.leastSold")}
                  name="sales"
                  value="asc"
                  onChange={() => setSalesOrder("asc")}
                  checked={salesOrder === "asc"}
                />
                {salesOrder ? (
                  <button
                    onClick={() => setSalesOrder(null)}
                    className="btn main-bg main-text mt-1"
                  >
                    {t("exploreBooks.removeSelected")}
                  </button>
                ) : null}
              </Col>

              <Col lg={4} xs={12} className="mt-3">
                <h5>{t("exploreBooks.booksPerPage")}</h5>
                <Form.Control
                  className="main-bg main-text rounded-0 pointer"
                  as="select"
                  value={booksPerPage}
                  onChange={handleBooksPerPageChange}
                >
                  {[2, 5, 8, 12, 16, 20, 30].map((num) => (
                    <option className="main-text" key={num} value={num}>
                      {num} {t("exploreBooks.books")}
                    </option>
                  ))}
                </Form.Control>
              </Col>

              <Col xs={12} className="mt-3">
                <h5 className="m-1">{t("exploreBooks.categories")}</h5>
                <div className="categories d-flex gap-2 flex-wrap">
                  {categories.map((category: Category) => (
                    <Form.Check
                      id={category._id}
                      className="d-flex align-items-center gap-1"
                      key={category._id}
                      type="checkbox"
                      label={category.name}
                      value={category._id}
                      onChange={() => handleCategoryChange(category._id || "")}
                      checked={selectedCategories.includes(category._id || "")}
                    />
                  ))}
                </div>
              </Col>
            </Row>
          </div>
        </div>

        <Row className="mt-3 g-2 pb-2">
          {books.length ? (
            books.map((book: Book) => (
              <Col key={book._id} lg={3} md={4} sm={6} xs={12}>
                <BookCartComp
                  book={book}
                  showControls={true}
                />
              </Col>
            ))
          ) : (
            <h2 className="text-capitalize text-center">
              {t("exploreBooks.noBooksMatchFilter")}{" "}
              <Icon icon="twemoji:thinking-face" />
            </h2>
          )}
        </Row>

        {/* Pagination Controls */}
        {pagination.pages && pagination.pages > 1 ? (
          <Row className="mt-4">
            <Col className="d-flex justify-content-center">
              <Pagination>{renderPagination()}</Pagination>
            </Col>
          </Row>
        ) : null}
      </div>
    </section>
  );
};

export default AdminBooks;
