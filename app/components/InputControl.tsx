import clsx from "clsx";
import { HTMLAttributes } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

export interface InputControlProps extends HTMLAttributes<HTMLInputElement> {
  containerClassName?: string
  labelText: string
  register?: UseFormRegisterReturn
  disabled?: boolean
}

export function InputControl(
  { containerClassName, labelText, className, register, ...rest }: InputControlProps
) {

  return (
    <div className={clsx("flex flex-col w-full", containerClassName)}>
      <label className="text-lg" htmlFor={rest.id}>{labelText}</label>
      <input
        type="number"
        className={clsx("bg-background p-2 px-4 h-10 text-xl", className)}
        {...register}
        {...rest}
      />
    </div>
  )
}