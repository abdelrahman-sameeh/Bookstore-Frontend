import {
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
  FormEvent,
} from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import { couponsState, targetCouponState } from "../../../../recoil/couponAtom";
import LoadingButton from "../../../utils/LoadingButton";
import authAxios from "../../../../api/authAxios";
import { ApiEndpoints } from "../../../../api/ApiEndpoints";
import notify from "../../../utils/Notify";

function validation(
  couponCode: string,
  discount: number | string,
  expiryDate: string,
  setErrors: Dispatch<SetStateAction<Map<string, string>>>
): boolean {
  const newErrors = new Map<string, string>();

  // Check if coupon code is empty
  if (!couponCode) {
    newErrors.set("code", "codeRequired");
  }

  // Check if discount is valid
  if (!discount) {
    newErrors.set("discount", "discountRequired");
  } else if (discount && isNaN(Number(discount))) {
    newErrors.set("discount", "discountInvalid");
  } else if (+discount < 0 || +discount > 100) {
    newErrors.set("discount", "discountRange");
  }

  // Check if expiry date is empty
  if (!expiryDate) {
    newErrors.set("expiryDate", "expiryDateRequired");
  } else {
    const today = new Date().toISOString().split("T")[0];
    if (expiryDate < today) {
      newErrors.set("expiryDate", "expiryDatePast");
    }
  }

  // If errors exist, update the state and return false
  if (newErrors.size) {
    setErrors(newErrors);
    return false;
  }

  // No errors
  setErrors(newErrors);
  return true;
}

const CreateUpdateCouponDialog = ({
  show,
  setShow,
  isUpdate,
  setIsUpdate,
}: {
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
  isUpdate: boolean;
  setIsUpdate: Dispatch<SetStateAction<boolean>>;
}) => {
  const { t } = useTranslation();
  const [coupons, setCoupons] = useRecoilState(couponsState);
  const [couponCode, setCouponCode] = useState<string>("");
  const [discount, setDiscount] = useState<number | string>("");
  const [expiryDate, setExpiryDate] = useState<string>("");
  const [targetCoupon, setTargetCoupon] = useRecoilState(targetCouponState);
  const [errors, setErrors] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(false);

  // If updating, populate the form with the coupon data
  useEffect(() => {
    if (isUpdate && targetCoupon?._id) {
      setCouponCode(targetCoupon.code as string);
      setDiscount(targetCoupon.discount as string);
      setExpiryDate(targetCoupon?.expiryDate?.split("T")[0] as string);
    } else {
      setCouponCode("");
      setDiscount("");
      setExpiryDate("");
    }
    setErrors(new Map());
  }, [isUpdate, targetCoupon]);

  const handleClose = () => {
    setShow(false);
    setIsUpdate(false);
    setTargetCoupon({});
  };


  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    const isValid = validation(couponCode, discount, expiryDate, setErrors);
    if (!isValid) {
      return;
    }
    const data = { code: couponCode, discount, expiryDate };
  
    setLoading(true);
    const response = await authAxios(
      true,
      ApiEndpoints.listCreateCoupon(),
      "POST",
      data
    );
    setLoading(false);
  
    if (response.status === 201) {
      notify(t("couponMessages.createSuccess"));  // Localized success message
      setCoupons((prev) => [...prev, response?.data?.data?.coupon]);
      handleClose();
    } else if (response?.data?.errors[0]?.msg === "this coupon already exist") {
      notify(t("couponMessages.alreadyExist"), "error");  // Localized error message
    } else {
      notify(t("couponMessages.genericError"), "error"); 
    }
  };
  
  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    const isValid = validation(couponCode, discount, expiryDate, setErrors);
    if (!isValid) {
      return;
    }
    const data = { code: couponCode, discount, expiryDate };
  
    setLoading(true);
    const response = await authAxios(
      true,
      ApiEndpoints.retrieveUpdateDeleteCoupon(targetCoupon?._id as string),
      "PUT",
      data
    );
    setLoading(false);
  
    if (response.status === 200) {
      notify(t("couponMessages.updateSuccess"));  // Localized success message
      const updatedCoupons = coupons.map((coupon) => {
        if (coupon._id === targetCoupon._id) {
          return response?.data?.data?.coupon;
        } else {
          return coupon;
        }
      });
      setCoupons(updatedCoupons);
      handleClose();
    } else if (response?.data?.errors[0]?.msg === "this coupon already exist") {
      notify(t("couponMessages.alreadyExist"), "error");  // Localized error message
    } else {
      notify(t("couponMessages.genericError"), "error");  // Localized generic error message
    }
  };
  return (
    <Modal className="custom-dialog" show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {isUpdate
            ? t("createUpdateCouponDialog.updateTitle")
            : t("createUpdateCouponDialog.createTitle")}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={isUpdate ? handleUpdate : handleCreate}>
        <Modal.Body>
          <div>
            {/* Coupon Code Input */}
            <Form.Group controlId="couponCode">
              <Form.Label>{t("createUpdateCouponDialog.code")}</Form.Label>
              <Form.Control
                type="text"
                placeholder={t("createUpdateCouponDialog.codePlaceholder")}
                value={couponCode}
                onChange={(e) => {
                  errors.has("code") && errors.delete("code");
                  setCouponCode(e.target.value);
                }}
                isInvalid={errors.has("code")}
              />
              {errors.has("code") && (
                <Form.Control.Feedback type="invalid">
                  {t(`createUpdateCouponDialog.${errors.get("code")}`)}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            {/* Discount Input */}
            <Form.Group controlId="discount">
              <Form.Label>{t("createUpdateCouponDialog.discount")}</Form.Label>
              <Form.Control
                type="number"
                placeholder={t("createUpdateCouponDialog.discountPlaceholder")}
                value={discount}
                onChange={(e) => {
                  errors.has("discount") && errors.delete("discount");
                  setDiscount(e.target.value);
                }}
                isInvalid={errors.has("discount")}
              />
              {errors.has("discount") && (
                <Form.Control.Feedback type="invalid">
                  {t(`createUpdateCouponDialog.${errors.get("discount")}`)}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            {/* Expiry Date Input */}
            <Form.Group controlId="expiryDate">
              <Form.Label>
                {t("createUpdateCouponDialog.expiryDate")}
              </Form.Label>
              <Form.Control
                type="date"
                value={expiryDate}
                onChange={(e) => {
                  errors.has("expiryDate") && errors.delete("expiryDate");
                  setExpiryDate(e.target.value);
                }}
                isInvalid={errors.has("expiryDate")}
              />
              {errors.has("expiryDate") && (
                <Form.Control.Feedback type="invalid">
                  {t(`createUpdateCouponDialog.${errors.get("expiryDate")}`)}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {t("createUpdateCouponDialog.close")}
          </Button>
          <LoadingButton variant="main" loading={loading}>
            {isUpdate
              ? t("createUpdateCouponDialog.update")
              : t("createUpdateCouponDialog.create")}
          </LoadingButton>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CreateUpdateCouponDialog;
