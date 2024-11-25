import { ReactNode } from 'react'
import Select, { Props as ReactSelectProps, createFilter } from 'react-select'

import { CustomOption } from './components/CustomOption'
import { CustomGroupLabel } from './components/CustomGroupLabel'
import { CustomOptionLabel } from './components/CustomOptionLabel'
import { CustomMenuList, OPTION_HEIGHT } from './components/CustomMenuList'

interface CustomSelectProps extends ReactSelectProps {
  animated?: boolean
  capitalizeOptions?: boolean
  backgroundColor?: string
}

export interface SelectOption {
  label?: string
  value?: number | string
  options?: readonly unknown[]
  tags?: {
    label: string
    color?: string
  }[]
  status?: {
    label: string
    color: string
  }
  tooltip?: string | ReactNode
}

export function CustomSelect({
  isMulti = false,
  closeMenuOnSelect = true,
  capitalizeOptions = false,
  backgroundColor = 'transparent',
  ...rest
}: CustomSelectProps) {
  return (
    <Select
      // filterOption={createFilterOptions({ options: rest.options })}
      filterOption={createFilter({ ignoreAccents: false })}
      // filterOption={null}
      placeholder={`Selecione ${isMulti ? 'uma ou mais opções' : 'uma opção'}`}
      noOptionsMessage={() => 'Não há opções disponíveis.'}
      loadingMessage={() => 'Carregando opções...'}
      isMulti={isMulti}
      closeMenuOnSelect={closeMenuOnSelect}
      hideSelectedOptions={false}
      formatOptionLabel={(option) => (
        <CustomOptionLabel capitalize={capitalizeOptions} {...(option as SelectOption)} />
      )}
      formatGroupLabel={(group) => <CustomGroupLabel {...group} />}
      components={{
        Option: (props) => (
          <CustomOption capitalize={capitalizeOptions} {...props} />
        ),
        MenuList: CustomMenuList, // (props) => <CustomMenuList {...props} />, a forma comentada de renderizar o menu causa um bug ao selecionar um item em uma posição maior que a altura máxima do menu
      }}
      styles={{
        container: (baseStyles) => ({
          ...baseStyles,
          flex: 1,
        }),
        control: (baseStyles, state) => ({
          ...baseStyles,
          background: backgroundColor,
          borderColor: '#e4e4e7',
          ':hover': {
            borderColor: '#d4d4d8'
          },
          opacity: state.isDisabled ? 0.4 : 1,
        }),
        placeholder: (baseStyles) => ({
          ...baseStyles,
          color: 'inherit',
        }),
        dropdownIndicator: (baseStyles) => ({
          ...baseStyles,
          cursor: 'pointer',
          color: 'inherit',
          ':hover': {
            color: '#1385F6',
          },
        }),
        clearIndicator: (baseStyles) => ({
          ...baseStyles,
          cursor: 'pointer',
          color: 'inherit',
          ':hover': {
            color: '#D7271D',
          },
        }),
        menu: (baseStyles) => ({
          ...baseStyles,
          background: '#fff'
        }),
        input: (baseStyles) => ({
          ...baseStyles,
          color: 'inherit',
        }),
        option: (baseStyles, state) => ({
          ...baseStyles,
          background: state.isSelected ? '#D8EBFE' : 'transparent',
          color: "#2b373f",
          ':hover': {
            background: !state.isDisabled ? '#D8EBFE' : 'transparent',
            filter: 'brightness(0.9)',
          },
          opacity: state.isDisabled ? 0.5 : 1,
          cursor: state.isDisabled ? 'not-allowed' : 'initial',
          height: OPTION_HEIGHT,
        }),
        singleValue: (baseStyles) => ({
          ...baseStyles,
          color: '#252a2e',
        }),
        groupHeading: (baseStyles) => ({
          ...baseStyles,
          color: '#252a2e',
          fontWeight: 700,
          fontSize: 16,
          // height: GROUP_HEADER_HEIGHT,
        }),
        multiValue: (baseStyles) => ({
          ...baseStyles,
          background: '#0870D9',
          color: 'white',
          borderRadius: 4,
        }),
        multiValueLabel: (baseStyles) => ({
          ...baseStyles,
          color: 'white',
          background: '#0870D9',
          borderRadius: 4,
        }),
        multiValueRemove: (baseStyles) => ({
          ...baseStyles,
          background: '#0870D9',
          color: 'inherit',
          ':hover': {
            color: '#D7271D',
          },
          borderRadius: 4,
          // eslint-disable-next-line prettier/prettier
          'svg': {
            width: 16,
            height: 16,
          },
        }),
      }}
      // pageSize={2}
      // tabIndex={3}
      // tabSelectsValue={true}
      // value={}
      // isOptionDisabled={(option) => option}
      // isOptionSelected={}
      // isLoading

      {...rest}
    />
  )
}
