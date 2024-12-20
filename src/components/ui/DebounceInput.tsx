import React, { useEffect, useState } from "react";
export interface DebouncedInputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
    value: string | number;
     
    onChange: (val: string | number) => void;
    /**Time in milliseconds */
    debounceTime?: number;
}

export const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounceTime = 300,
  ...props
}: DebouncedInputProps) => {
  const [value, setValue] = useState(initialValue);

  // setValue if any initialValue changes
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  // debounce onChange — triggered on every keypress
  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounceTime);

    return () => {
      clearTimeout(timeout);
    };
  }, [value, onChange, debounceTime]);

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};
