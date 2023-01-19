import { useEffect, useState } from "react";

const useDebounce = (searchKeyword, delay) => {
    // State and setters for debounced value
    const [debouncedValue, setDebouncedValue] = useState(searchKeyword);

    useEffect(
        () => {
            // Update debounced value after delay
            const handler = setTimeout(() => {
                setDebouncedValue(searchKeyword);
            }, delay);

            // Cancel the timeout if value changes (also on delay change or unmount)
            // This is how we prevent debounced value from updating if value is changed ...
            // .. within the delay period. Timeout gets cleared and restarted.
            return () => {
                clearTimeout(handler);
            };
        },
        [searchKeyword, delay] // Only re-call effect if value or delay changes
    );

    return debouncedValue;
}

export default useDebounce
