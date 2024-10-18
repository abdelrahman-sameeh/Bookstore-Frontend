import { useEffect, useState } from "react";
import LoadingButton from "../../../components/utils/LoadingButton";
import authAxios from "../../../api/authAxios";
import { ApiEndpoints } from "../../../api/ApiEndpoints";
import { useRecoilState, useSetRecoilState } from "recoil";
import { categoriesState, categoryState } from "../../../recoil/categoriesAtom";
import { Spinner, Card, Button, Row, Col } from "react-bootstrap"; // استيراد مكونات React Bootstrap
import { Category } from "../../../interfaces/interfaces";
import Icon from "../../../components/utils/Icon";
import DeleteCategoryDialog from "../../../components/dashboard/admin/DeleteCategoryDialog";
import CreateUpdateCategoryDialog from "../../../components/dashboard/admin/CreateUpdateCategoryDialog";
import { useTranslation } from "react-i18next";

const Categories = () => {
  const [categories, setCategories] = useRecoilState(categoriesState);
  const setCategory = useSetRecoilState(categoryState);
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCreateUpdateDialog, setShowCreateUpdateDialog] = useState(false);
  const [method, setMethod] = useState<"create" | "update">("create");

  useEffect(() => {
    authAxios(false, ApiEndpoints.listCreateCategory)
      .then((res) => {
        setCategories(res?.data?.data?.categories);
        setLoading(false); // عند جلب البيانات بنجاح
      })
      .catch(() => {
        setError("failed to load categories");
        setLoading(false); // عند حدوث خطأ
      });
  }, [setCategories]);

  return (
    <div>
      <div className="container alt-bg py-3">
        <div className="d-flex justify-content-between align-items-center flex-wrap">
          <h2 className="fw-bold text-capitalize">
            {" "}
            {t("category.categories")}{" "}
          </h2>
          <LoadingButton
            onClick={() => {
              setCategory({});
              setMethod("create");
              setShowCreateUpdateDialog(true);
            }}
          >
            {" "}
            {t("category.addCategory")}{" "}
          </LoadingButton>
        </div>

        <DeleteCategoryDialog
          setShowDeleteDialog={setShowDeleteDialog}
          showDeleteDialog={showDeleteDialog}
        />

        <CreateUpdateCategoryDialog
          setShowCreateUpdateDialog={setShowCreateUpdateDialog}
          showCreateUpdateDialog={showCreateUpdateDialog}
          method={method}
        />

        {/* حالة التحميل */}
        {loading ? (
          <div className="d-flex justify-content-center">
            <Spinner animation="border" />
          </div>
        ) : error ? (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        ) : (
          <Row xs={1} md={2} lg={3} className="g-4 mt-3">
            {/* عرض الفئات باستخدام Card */}
            {categories?.map((category: Category) => (
              <Col key={category._id}>
                <Card className="main-bg main-text">
                  <Card.Title>
                    <div className=" border-bottom d-flex gap-1 rounded-top p-1">
                      <Button
                        variant="outline-primary"
                        onClick={() => {
                          setShowCreateUpdateDialog(true);
                          setMethod("update");
                          setCategory(category);
                        }}
                      >
                        <Icon icon="tabler:edit" />
                      </Button>
                      <Button
                        variant="outline-danger"
                        onClick={() => {
                          setShowDeleteDialog(true);
                          setCategory(category);
                        }}
                      >
                        <Icon icon="ph:trash" />
                      </Button>
                    </div>
                  </Card.Title>
                  <Card.Body>
                    <Card.Title className="text-capitalize">
                      {category.name}
                    </Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
};

export default Categories;
