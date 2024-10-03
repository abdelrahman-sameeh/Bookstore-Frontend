import { useRecoilValue } from "recoil";
import { themeState } from "../../recoil/utils";

type InputErrorProps = {
  message: string
};

const InputError = ({ message }: InputErrorProps) => {
  const theme = useRecoilValue(themeState);

  return (
    <div
      style={{
        color: theme === "dark" ? "#e66363" : "",
      }}
      className="invalid-feedback d-flex fw-bold"
    >
      {message}
    </div>
  );
};

export default InputError;
