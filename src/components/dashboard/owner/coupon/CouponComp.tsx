import { Card, Button, CardHeader } from "react-bootstrap";
import { useTranslation } from "react-i18next"; // Import i18next
import Icon from "../../../utils/Icon";
import { Coupon } from "../../../../interfaces/interfaces";
import { useSetRecoilState } from "recoil";
import { targetCouponState } from "../../../../recoil/couponAtom";
import { Dispatch, SetStateAction } from "react";

const CouponComp = ({
  coupon,
  setShowCreateUpdateDialog,
  setIsUpdate,
}: {
  coupon: Coupon;
  setIsUpdate: Dispatch<SetStateAction<boolean>>;
  setShowCreateUpdateDialog: Dispatch<SetStateAction<boolean>>;
}) => {
  const { t } = useTranslation(); // i18next hook for translations
  const  setTargetCoupon = useSetRecoilState(targetCouponState);

  return (
    <Card className="main-theme h-100 w-100">
      <CardHeader>
        <div className="d-flex gap-1">
          <Button
            variant="outline-primary"
            onClick={() => {
              setTargetCoupon(coupon);
              setShowCreateUpdateDialog(true)
              setIsUpdate(true)
            }}
          >
            <Icon icon="tabler:edit" />
          </Button>
          <Button variant="outline-danger" onClick={() => {}}>
            <Icon icon="ph:trash" />
          </Button>
        </div>
      </CardHeader>
      <Card.Body>
        <Card.Title>
          {coupon.code}
        </Card.Title>
        <Card.Text>
          <strong>{t("couponComp.discount")}:</strong> {coupon.discount}% <br />
          <strong>{t("couponComp.expiryDate")}:</strong>{" "}
          {new Date(coupon.expiryDate as any).toLocaleDateString()}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default CouponComp;
