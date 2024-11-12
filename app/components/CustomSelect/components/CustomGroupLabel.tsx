import { SelectOption } from '..'

export function CustomGroupLabel(data: SelectOption) {
  return (
    <div className='flex items-center justify-between flex-1'>
      <span>{data.label}</span>
      {/* <Badge>{data.options?.length}</Badge> */}
    </div>
  )
}
