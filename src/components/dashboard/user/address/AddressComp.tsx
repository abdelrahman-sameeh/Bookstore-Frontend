import { Card, Button } from "react-bootstrap";
import { Address } from "../../../../interfaces/interfaces";
import { useTranslation } from "react-i18next";
import Icon from "../../../utils/Icon";
import { Dispatch, SetStateAction } from "react";
import { useSetRecoilState } from "recoil";
import { targetAddressState } from "../../../../recoil/addressesAtom";

type AddressCompProps = {
  address: Address;
  setIsUpdate: Dispatch<SetStateAction<boolean>>;
  setShowCreateUpdateDialog: Dispatch<SetStateAction<boolean>>;
  setShowDeleteDialog: Dispatch<SetStateAction<boolean>>;
};

const AddressComp = ({
  address,
  setIsUpdate,
  setShowCreateUpdateDialog,
  setShowDeleteDialog,
}: AddressCompProps) => {
  const { t } = useTranslation();
  const setTargetAddress = useSetRecoilState(targetAddressState);

  return (
    <Card className="main-theme h-100">
      <Card.Header>
        <div className="d-flex gap-1">
          <Button
            title={'update address'}
            variant="outline-primary"
            onClick={() => {
              setShowCreateUpdateDialog(true);
              setIsUpdate(true);
              setTargetAddress(address);
            }}
          >
            <Icon icon="tabler:edit" />
          </Button>
          <Button
            title={'delete address'}
            variant="outline-danger"
            onClick={() => {
              setTargetAddress(address);
              setShowDeleteDialog(true);
            }}
          >
            <Icon icon="ph:trash" />
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        <Card.Title>
          {address.city
            ? `${address.city}, ${address.country}`
            : t("addressComp.title")}
        </Card.Title>
        {address.country ? (
          <p className="mb-1">
            <strong>{t("addressComp.country")}:</strong> {address.country}
          </p>
        ) : null}

        {address.city ? (
          <p className="mb-1">
            <strong>{t("addressComp.city")}:</strong> {address.city}
          </p>
        ) : null}

        {address.address ? (
          <p className="mb-1">
            <strong>{t("addressComp.address")}:</strong> {address.address}
          </p>
        ) : null}

        {address.phone ? (
          <p className="mb-1">
            <strong>{t("addressComp.phone")}:</strong> {address.phone}
          </p>
        ) : null}
      </Card.Body>
    </Card>
  );
};

export default AddressComp;
