// import { Flex, Text, Tooltip } from '@chakra-ui/react'
import clsx from 'clsx'
import { components, OptionProps } from 'react-select'
import { SelectOption } from '..'
// import { Tag } from '@components/Tag'

interface CustomOptionProps extends OptionProps {
  capitalize?: boolean
}

export function CustomOption({ capitalize, ...rest }: CustomOptionProps) {
  const data = rest.data as SelectOption

  return (
    <components.Option {...rest}>
      {/* <Tooltip label={data.tooltip} overflow="scroll"> */}
      <div className={clsx('flex items-center gap-2', capitalize && 'capitalize')}>
        <span className='whitespace-nowrap'>
          {data.label}
        </span>

        {/* {data.status && (
          <Tag shape="circle" shapeColor={data.status?.color}>
            {data.status?.label}
          </Tag>
        )} */}
        {/* <div className='flex gap-1 flex-1'>
          {data.tags?.map((tag) => (
            <Tag key={tag.label} badgeBackground={tag?.color}>
              {tag.label}
            </Tag>
          ))}
        </div> */}
      </div>
      {/* </Tooltip> */}
    </components.Option>
  )
}
