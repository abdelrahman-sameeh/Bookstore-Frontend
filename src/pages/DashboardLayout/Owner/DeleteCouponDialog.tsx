import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useRecoilState, useSetRecoilState } from "recoil";
import { couponsState, targetCouponState } from "../../../recoil/couponAtom";
import LoadingButton from "../../../components/utils/LoadingButton";
import { useTranslation } from "react-i18next";
import authAxios from "../../../api/authAxios";
import { ApiEndpoints } from "../../../api/ApiEndpoints";
import notify from "../../../components/utils/Notify";

type DeleteCouponProps = {
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
};

const DeleteCouponDialog = ({ show, setShow }: DeleteCouponProps) => {
  const setCoupons = useSetRecoilState(couponsState)
  const [targetCoupon, setTargetCoupon] = useRecoilState(targetCouponState);
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation();

  const handleClose = () => {
    setShow(false);
    setTargetCoupon({});
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);
    const response = await authAxios(
      true,
      ApiEndpoints.retrieveUpdateDeleteCoupon(targetCoupon._id as string),
      "DELETE"
    );
    setLoading(false);

    if (response.status === 204) {
      notify(t("deleteCouponDialog.success")); // Success message from i18next
      setCoupons((prev) => prev.filter((coupon) => coupon._id !== targetCoupon._id)); // Update the coupon list
      handleClose();
    } else {
      notify(t("deleteCouponDialog.error"), "error"); // Error message from i18next
    }
  };

  return (
    <Modal className="custom-dialog" show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t("deleteCouponDialog.title")}</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <p>{t("deleteCouponDialog.confirm", { code: targetCoupon.code })}</p> {/* Confirmation message */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {t("deleteCouponDialog.close")}
          </Button>
          <LoadingButton variant="error" loading={loading}>
            {t("deleteCouponDialog.delete")}
          </LoadingButton>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default DeleteCouponDialog;
