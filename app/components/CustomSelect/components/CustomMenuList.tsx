import { GroupBase, MenuListProps } from 'react-select'
import { VariableSizeList as List } from 'react-window'
import { SelectOption } from '..'

export const GROUP_HEADER_HEIGHT = 50
export const OPTION_HEIGHT = 40

export function CustomMenuList({
  options,
  children,
  maxHeight,
}: MenuListProps<unknown, boolean, GroupBase<unknown>>) {
  function getOptionSize(option: SelectOption) {
    if (option.options) {
      return option.options.length * OPTION_HEIGHT + GROUP_HEADER_HEIGHT
    }
    return OPTION_HEIGHT
  }

  function getItemSize(i: number) {
    return getOptionSize(options[i] as SelectOption)
  }

  const totalHeight = options.reduce((height, option) => {
    return Number(height) + getOptionSize(option as SelectOption)
  }, 0) as number

  const estimatedItemSize = totalHeight / options.length

  return Array.isArray(children) ? (
    <List
      height={Math.min(totalHeight, maxHeight)} // maxHeight = 300
      width="100%"
      itemCount={children.length}
      itemSize={getItemSize}
      estimatedItemSize={estimatedItemSize}
      initialScrollOffset={0}
    >
      {({ index, style }) => <div style={style}>{children[index]}</div>}
    </List>
  ) : (
    <div>{children}</div>
  )
}
