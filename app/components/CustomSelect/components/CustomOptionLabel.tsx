// import { Tag } from '@components/Tag'
import clsx from 'clsx'
import { SelectOption } from '..'
// import { Flex, Text, Tooltip } from '@chakra-ui/react'

interface CustomOptionLabelProps extends SelectOption {
  showTags: boolean
  showStatus: boolean
  capitalize?: boolean
}

export function CustomOptionLabel({
  showTags,
  showStatus,
  capitalize = false,
  ...data
}: CustomOptionLabelProps) {
  return (
    // <Tooltip label={data.tooltip}>
    <div className={clsx('flex items-center gap-2', capitalize && 'capitalize')}>
      <span className='whitespace-nowrap'>
        {data.label}
      </span>

      {/* {showStatus && data.status && (
          <Tag shape="circle" shapeColor={data.status?.color}>
            {data.status?.label}
          </Tag>
        )}

        {showTags && data.tags && (
          <Flex gap="1" flex="1">
            {data.tags?.map((tag) => (
              <Tag key={tag.label} badgeBackground={tag?.color}>
                {tag.label}
              </Tag>
            ))}
          </Flex>
        )} */}
    </div>
  )
}
