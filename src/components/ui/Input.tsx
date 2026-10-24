import type { InputHTMLAttributes } from "react";

function Input({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`field ${className}`.trim()} {...props} />;
}

export default Input;
