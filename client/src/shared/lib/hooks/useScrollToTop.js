import { useEffect } from "react";

/**
 * @param {Array} dependencies - Масив залежностей, при зміні яких спрацює скрол
 */
export function useScrollToTop(dependencies = []) {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [dependencies]);
}
