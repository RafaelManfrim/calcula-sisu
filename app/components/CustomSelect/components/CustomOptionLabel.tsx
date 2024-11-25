import clsx from 'clsx'
import { SelectOption } from '..'

interface CustomOptionLabelProps extends SelectOption {
  capitalize?: boolean
}

export function CustomOptionLabel({ capitalize = false, ...data }: CustomOptionLabelProps) {
  return (
    <div className={clsx('flex items-center gap-2', capitalize && 'capitalize')}>
      <span className='whitespace-nowrap'>
        {data.label}
      </span>
    </div>
  )
}
