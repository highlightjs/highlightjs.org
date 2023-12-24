import { HTMLAttributes, forwardRef, useEffect, useRef } from 'react';

interface Props extends HTMLAttributes<HTMLInputElement> {
  checked?: boolean;
  indeterminate?: boolean;
}

export const Checkbox = ({ indeterminate, ...rest }: Props) => {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = indeterminate ?? false;
    }
  }, [indeterminate]);

  return <input type="checkbox" ref={ref} {...rest} />;
};
