import './Input.scss'
import { useState } from 'react'
import { Category, Subcategory } from '../../types/ProductTypes'
import { getCategoriesMatchingQuery } from '../../api/product-crud'

const FETCH_WAIT_INTERVAL = 500

type InputProps = NumberProps | TextProps | TypeaheadProps

type NumberProps = {
  type: 'number',
  placeholder?: string,
  label: string,
  id: string,
}

type TextProps = {
  type: 'text',
  placeholder?: string,
  label: string,
  id: string,
}

type TypeaheadProps = {
  type: 'typeahead',
  placeholder?: string,
  label: string,
  id: string,
  data?: Category[] | Subcategory[],
  fetchEndpoint?: 'categories' | 'subcategories' | 'deals'
}


function Input(props: InputProps) {
  const [timer, setTimer] = useState<NodeJS.Timeout>()
  const [showDropdown, setShowDropdown] = useState(false)
  const [dropdownData, setDropdownData] = useState<Category[]>()

  const onChangeLoadData = async (query: string) => {
    if (query.length > 1) {
      clearTimeout(timer)
      setTimer(
        setTimeout(
          async () => {
            try {
              const result = await getCategoriesMatchingQuery(query)
              if (result) {
                setShowDropdown(true)
                setDropdownData(result.data)
              } else {
                setShowDropdown(false)
                setDropdownData([])
              }
            } catch (error) {
              console.log(error)
            }
          }, FETCH_WAIT_INTERVAL
        )
      )
    }
  }


  if (props.type === 'typeahead')
    return (
      <div className={`typeahead`}>
        <label htmlFor={props.id}>{props.label}</label>
        <input
          id={props.id}
          type="text"
          placeholder={props.placeholder}
          onClick={() => { }}
          onChange={(e) => { onChangeLoadData(e.target.value) }}
        />
        <ul className={`dropdown${!showDropdown ? " hideDropdown" : ""}`}>
          {dropdownData && dropdownData.map((item, _i) =>
            <li key={item.title}>
              {item.title}
            </li>)}
        </ul>
      </div>
    )
}

export default Input
