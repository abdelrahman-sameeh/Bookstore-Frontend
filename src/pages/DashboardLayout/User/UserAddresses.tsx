import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next"; // Import i18next
import authAxios from "../../../api/authAxios";
import { ApiEndpoints } from "../../../api/ApiEndpoints";
import { useRecoilState } from "recoil";
import { Col, Row, Container } from "react-bootstrap";
import LoadingButton from "../../../components/utils/LoadingButton";
import CreateUpdateAddressModal from "../../../components/dashboard/user/CreateUpdateAddressModal";
import AddressComp from "../../../components/dashboard/user/AddressComp";
import { addressesState } from "../../../recoil/addressesAtom";
import DeleteAddressDialog from "../../../components/dashboard/user/DeleteCouponDialog";

const UserAddresses = () => {
  const { t } = useTranslation(); // i18next hook for translations
  const [addresses, setAddresses] = useRecoilState(addressesState);
  const [isUpdate, setIsUpdate] = useState(false);
  const [showCreateUpdateDialog, setShowCreateUpdateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    authAxios(true, ApiEndpoints.listCreateAddresses).then((response) => {
      setAddresses(response?.data?.data?.addresses);
    });
  }, []);

  return (
    <Container className="alt-bg p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="text-capitalize">{t("userAddress.yourAddresses")}</h2>
        <LoadingButton
          onClick={() => {
            setShowCreateUpdateDialog(true);
            setIsUpdate(false);
          }}
        >
          {t("userAddress.addAddress")}
        </LoadingButton>
      </div>

      {/* create update address modal */}
      <CreateUpdateAddressModal
        isUpdate={isUpdate}
        setIsUpdate={setIsUpdate}
        setShow={setShowCreateUpdateDialog}
        show={showCreateUpdateDialog}
      />

      <DeleteAddressDialog
        show={showDeleteDialog}
        setShow={setShowDeleteDialog}
      />

      {/* Address List */}
      <Row>
        {addresses.length > 0 ? (
          addresses.map((address) => (
            <Col md={4} className="mb-3" key={address._id}>
              <AddressComp
                address={address}
                setIsUpdate={setIsUpdate}
                setShowCreateUpdateDialog={setShowCreateUpdateDialog}
                setShowDeleteDialog={setShowDeleteDialog}
              />
            </Col>
          ))
        ) : (
          <Col>
            <h2 className="text-center">{t("userAddress.noAddresses")}</h2>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default UserAddresses;
