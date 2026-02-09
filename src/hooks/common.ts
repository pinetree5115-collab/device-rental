import { useEffect, RefObject } from "react";

/**
 * 요소 외부 클릭을 감지하는 hook
 * @param ref - 외부 클릭을 감지할 요소의 ref
 * @param handler - 외부 클릭 시 실행할 콜백 함수
 */
export function useClickOutside<T extends HTMLElement>(
    ref: RefObject<T>,
    handler: () => void,
) {
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                handler();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [ref, handler]);
}
