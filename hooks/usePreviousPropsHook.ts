import { useEffect, useRef } from "react";

export default function usePreviousProps<K = any>(value: K) {
  const ref = useRef<K>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
