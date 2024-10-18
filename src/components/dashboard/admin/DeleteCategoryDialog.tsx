import { Dispatch, SetStateAction, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import LoadingButton from "../../utils/LoadingButton";
import { useTranslation } from "react-i18next"; // Importing useTranslation
import { useRecoilState } from "recoil";
import { categoriesState, categoryState } from "../../../recoil/categoriesAtom";
import authAxios from "../../../api/authAxios";
import { ApiEndpoints } from "../../../api/ApiEndpoints";
import notify from "../../utils/Notify";

type DeleteCategoryDialogTypes = {
  showDeleteDialog: boolean;
  setShowDeleteDialog: Dispatch<SetStateAction<boolean>>;
};

function DeleteCategoryDialog({
  showDeleteDialog,
  setShowDeleteDialog,
}: DeleteCategoryDialogTypes) {
  const { t } = useTranslation(); // Destructure the t function from useTranslation
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useRecoilState(categoriesState);
  const [category, setCategory] = useRecoilState(categoryState);

  const handleClose = () => {
    setShowDeleteDialog(false);
    setCategory({});
  };
  const handleDelete = async () => {
    setLoading(true);
    const response = await authAxios(
      true,
      ApiEndpoints.getUpdateDeleteCategory(category._id as string),
      "DELETE"
    );
    if (response.status === 204) {
      notify(t("deleteCategoryDialog.success"), "success"); // Use translation for success message
      setCategories(categories.filter((cat) => cat._id !== category._id));
      setCategory({});
      setShowDeleteDialog(false);
    } else {
      notify(t("deleteCategoryDialog.error"), "error"); // Use translation for error message
    }
    setLoading(false);
  };

  return (
    <Modal
      className="custom-dialog"
      show={showDeleteDialog}
      onHide={handleClose}
    >
      <Modal.Header closeButton>
        <Modal.Title>{t("deleteCategoryDialog.title")}</Modal.Title>{" "}
        {/* Title translation */}
      </Modal.Header>
      <Modal.Body>{t("deleteCategoryDialog.confirmation")}</Modal.Body>{" "}
      {/* Confirmation translation */}
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          {t("deleteCategoryDialog.close")}
        </Button>
        <LoadingButton onClick={handleDelete} loading={loading} variant="error">
          {t("deleteCategoryDialog.delete")}
        </LoadingButton>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteCategoryDialog;
