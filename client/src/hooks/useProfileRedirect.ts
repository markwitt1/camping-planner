import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import useApi from "./useApi";

const useProfileRedirect = (): void => {
  const { push } = useHistory();
  const { getCurrentUser } = useApi();
  useEffect(() => {
    getCurrentUser().then(({ status }) => status === 200 && push("/profile"));
  }, []);
};
export default useProfileRedirect;
