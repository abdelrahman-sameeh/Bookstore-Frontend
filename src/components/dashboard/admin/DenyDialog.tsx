import { Dispatch, SetStateAction, useState, FormEvent } from "react";
import { Button, Modal } from "react-bootstrap";
import { Book } from "../../../interfaces/interfaces";
import LoadingButton from "../../utils/LoadingButton";
import InputError from "../../utils/InputError";
import authAxios from "../../../api/authAxios";
import { ApiEndpoints } from "../../../api/ApiEndpoints";
import notify from "../../utils/Notify";
import { useTranslation } from "react-i18next";

const DenyDialog = ({
  showDenyDialog,
  setShowDenyDialog,
  book,
}: {
  showDenyDialog?: boolean;
  setShowDenyDialog?: Dispatch<SetStateAction<boolean>>;
  book?: Book;
}) => {
  const { t } = useTranslation(); // Use the i18next hook
  const [denyReason, setDenyReason] = useState(""); // Create state for the textarea
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Map<string, string>>(new Map());

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (denyReason.length < 5) {
      setErrors(new Map().set("reason", t("denyDialog.tooShortMessage")));
      return false;
    }
    if (denyReason.length > 1000) {
      setErrors(new Map().set("reason", t("denyDialog.tooLongMessage")));
      return false;
    }
    if (!isNaN(+denyReason)) {
      setErrors(new Map().set("reason", t("denyDialog.invalidMessage")));
      return false;
    }

    setLoading(true);
    const data = {
      deniedReason: denyReason,
      reviewStatus: "denied",
    };

    const response = await authAxios(
      true,
      ApiEndpoints.reviewBook(book?._id as string),
      "PATCH",
      data
    );
    setLoading(false);

    if (response.status === 200) {
      setShowDenyDialog?.(false);
      notify(t("denyDialog.deniedSuccessfully"));
      setErrors(new Map());
      setDenyReason("");
    } else {
      notify(t("denyDialog.somethingWentWrong"), "error");
    }
  };

  const handleClose = () => {
    setShowDenyDialog?.(false);
  };

  return (
    <Modal className="custom-dialog" show={showDenyDialog} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t("denyDialog.denyBookTitle")}</Modal.Title>
      </Modal.Header>
      <form onSubmit={handleSubmit}>
        <Modal.Body>
          <label htmlFor="denyReason">{t("denyDialog.reasonForDenying")}</label>
          <textarea
            id="denyReason"
            className="form-control mt-2"
            rows={4}
            value={denyReason}
            onChange={(e) => setDenyReason(e.target.value)} // Update state on change
            required
          />
          {errors.has("reason") ? (
            <InputError message={errors.get("reason") as string} />
          ) : null}
        </Modal.Body>
        <Modal.Footer>
          <LoadingButton type="submit" loading={loading}>
            {t("denyDialog.submit")}
          </LoadingButton>
          <Button variant="secondary" onClick={handleClose}>
            {t("denyDialog.close")}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default DenyDialog;
