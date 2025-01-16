import { Form, InputGroup } from "react-bootstrap";
import Icon from "../utils/Icon";
import { useTranslation } from "react-i18next";

const NavbarSearchInput = () => {
  const { t } = useTranslation();

  return (
    <InputGroup className="px-2 navbar-search">
      <InputGroup.Text className="px-0 bg-transparent border-0">
        <Icon icon="material-symbols:search-rounded" className="fs-5" />
      </InputGroup.Text>
      <Form.Control
        className="bg-transparent border-0"
        placeholder={t("navbar.search")}
      />
    </InputGroup>
  );
};

export default NavbarSearchInput;
