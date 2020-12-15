import { useState, useCallback } from 'react';

// 기본 값
// 아래 반복되는 작업들..
export default(initialValue = null) => {
    const [value, setValue] = useState(initialValue);
    const handler = useCallback((e) => {
        setValue(e.target.value);
    }, []);

    return [value, handler];
};