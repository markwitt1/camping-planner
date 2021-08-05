import { useEffect } from "react";

const useScrollTop = (): void => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  }, []);
};

export default useScrollTop;
