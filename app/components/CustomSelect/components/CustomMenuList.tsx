import { GroupBase, MenuListProps } from 'react-select'
import { VariableSizeList as List } from 'react-window'
import { SelectOption } from '..'

export const GROUP_HEADER_HEIGHT = 50
export const OPTION_HEIGHT = 40

export function CustomMenuList({
  options,
  children,
  getValue,
  maxHeight,
}: MenuListProps<unknown, boolean, GroupBase<unknown>>) {
  /* const [value] = getValue()

  let offset = options.indexOf(value) * OPTION_HEIGHT

  const hasSubOptions = options.some(
    (option) => (option as SelectOption).options?.length,
  )

  // Comentar a condição abaixo irá fazer com que o deslocamento padrão do menu agrupado seja o primeiro item da lista (como era antes)
  if (hasSubOptions && value !== undefined) {
    let totalPassedLength = 0
    options.every((currOption, index) => {
      const indexOfSubOption = (currOption as SelectOption).options?.findIndex(
        (option) =>
          (option as SelectOption).value === (value as SelectOption).value,
      )

      if (indexOfSubOption !== undefined && indexOfSubOption !== -1) {
        offset =
          (totalPassedLength + indexOfSubOption + 1) * OPTION_HEIGHT +
          index * GROUP_HEADER_HEIGHT

        return false
      }

      const subOptionsLength = (currOption as SelectOption).options?.length ?? 0

      totalPassedLength += subOptionsLength

      return true
    })
  }

  const initialOffset = offset */

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
      // initialScrollOffset={initialOffset}
      initialScrollOffset={0}
    >
      {({ index, style }) => <div style={style}>{children[index]}</div>}
    </List>
  ) : (
    <div>{children}</div>
  )
}
