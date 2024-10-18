import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next"; // Import i18next
import authAxios from "../../../api/authAxios";
import { ApiEndpoints } from "../../../api/ApiEndpoints";
import { useRecoilState } from "recoil";
import { couponsState } from "../../../recoil/couponAtom";
import { Col, Row, Form, Pagination, Container } from "react-bootstrap";
import useDebounce from "../../../hooks/useDebounce";
import CouponComp from "../../../components/dashboard/owner/coupon/CouponComp";
import LoadingButton from "../../../components/utils/LoadingButton";
import CreateUpdateCouponDialog from "../../../components/dashboard/owner/coupon/CreateUpdateCouponDialog";

// Helper function to construct query parameters
function getQuery(
  available: string,
  limit: number,
  page: number,
  search: string
) {
  let query = `?page=${page}`;
  if (limit) query += `&limit=${limit}`;
  if (search) query += `&search=${search}`;
  if(available)query += `&available=${available==='available'}`;
  return query;
}

const OwnerCoupons = () => {
  const { t } = useTranslation(); // i18next hook for translations
  const [coupons, setCoupons] = useRecoilState(couponsState);
  const [search, setSearch] = useState<string>("");
  const debouncedSearchTerm = useDebounce(search, 300);
  const [available, setAvailable] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(5);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isUpdate, setIsUpdate] = useState(false);
  const [showCreateUpdateDialog, setShowCreateUpdateDialog] = useState(false);

  useEffect(() => {
    const query = getQuery(available, limit, page, debouncedSearchTerm);
    authAxios(true, ApiEndpoints.listCreateCoupon(query)).then((response) => {
      const { coupons } = response.data.data;
      const { pages } = response.data.pagination;
      setCoupons(coupons);
      setTotalPages(pages);
    });
  }, [available, limit, page, debouncedSearchTerm]);

  return (
    <Container className="alt-bg p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="">{t("ownerCoupons.availableCoupons")}</h2>
        <LoadingButton
          onClick={() => {
            setShowCreateUpdateDialog(true);
            setIsUpdate(false);
          }}
        >
          {t("ownerCoupons.addCoupon")}
        </LoadingButton>
      </div>

      <CreateUpdateCouponDialog
        show={showCreateUpdateDialog}
        setShow={setShowCreateUpdateDialog}
        isUpdate={isUpdate}
        setIsUpdate={setIsUpdate}
      />

      <Row className="mb-3">
        {/* Search Input */}
        <Col sm={12} md={6}>
          <Form.Group controlId="searchCoupons">
            <Form.Label>{t("ownerCoupons.searchCoupons")}</Form.Label>
            <Form.Control
              className="main-theme"
              type="text"
              placeholder={t("ownerCoupons.searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Form.Group>
        </Col>

        {/* Availability Filter */}
        <Col sm={12} md={2}>
          <Form.Group controlId="availableFilter">
            <Form.Label>{t("ownerCoupons.availability")}</Form.Label>
            <Form.Control
              className="main-theme"
              as="select"
              value={available}
              onChange={(e) => setAvailable(e.target.value)}
            >
              <option value="">{t("ownerCoupons.select")}</option>
              <option value="available">{t("ownerCoupons.available")}</option>
              <option value="unavailable">
                {t("ownerCoupons.unavailable")}
              </option>
            </Form.Control>
          </Form.Group>
        </Col>

        {/* Pagination Limit */}
        <Col sm={12} md={4}>
          <Form.Group controlId="limitSelector">
            <Form.Label>{t("ownerCoupons.itemsPerPage")}</Form.Label>
            <Form.Control
              className="main-theme"
              as="select"
              value={limit}
              onChange={(e) => setLimit(Number.parseInt(e.target.value))}
            >
              <option value={2}>2</option>
              <option value={5}>5</option>
              <option value={8}>8</option>
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>

      {/* Coupon List */}
      <Row>
        {coupons.map((coupon) => (
          <Col md={4} className="mb-3" key={coupon._id}>
            <CouponComp
              coupon={coupon}
              setIsUpdate={setIsUpdate}
              setShowCreateUpdateDialog={setShowCreateUpdateDialog}
            />
          </Col>
        ))}
      </Row>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="justify-content-center mt-4">
          <Pagination.Prev
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            {t("ownerCoupons.previous")}
          </Pagination.Prev>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (pageNumber) => (
              <Pagination.Item
                key={pageNumber}
                active={page === pageNumber}
                onClick={() => setPage(pageNumber)}
              >
                {pageNumber}
              </Pagination.Item>
            )
          )}

          <Pagination.Next
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            {t("ownerCoupons.next")}
          </Pagination.Next>
        </Pagination>
      )}
    </Container>
  );
};

export default OwnerCoupons;
