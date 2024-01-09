import './Input.scss'
import { useState, forwardRef } from 'react'
import { Category, Subcategory, Deal } from '../../types/ProductTypes'
import { getDataMatchingQuery, getSubcategoriesOfCategory } from '../../api/product-crud'

import { useDispatch } from 'react-redux'
import { useAppSelector, AppDispatch } from '../../redux/store'
import { selectCategory, selectSubcategory } from '../../redux/features/newProductSlice'

const FETCH_WAIT_INTERVAL = 500

type InputProps = NumberProps | TextProps | TypeaheadProps

type NumberProps = {
  type: 'number',
  placeholder?: string,
  label: string,
  id: string,
  onChange?: React.ChangeEventHandler<HTMLInputElement>
}

type TextProps = {
  type: 'text',
  placeholder?: string,
  label: string,
  id: string,
  value?: string,
  autoFocus?: boolean,
  onChange?: React.ChangeEventHandler<HTMLInputElement>
}

type TypeaheadProps = {
  type: 'typeahead',
  placeholder?: string,
  label: string,
  id: string,
  data?: Category[] | Subcategory[],
  fetchEndpoint: 'categories' | 'subcategories' | 'deals'
}


const Input = forwardRef((props: InputProps, ref: React.LegacyRef<HTMLInputElement>) => {
  const [timer, setTimer] = useState<NodeJS.Timeout>()
  const [showDropdown, setShowDropdown] = useState(false)
  const [dropdownData, setDropdownData] = useState<Category[] | Subcategory[]>()
  const [text, setText] = useState("")


  const category = useAppSelector((state) => state.newProductReducer.value.category)
  const subcategory = useAppSelector((state) => state.newProductReducer.value.subcategory)
  const dispatch = useDispatch<AppDispatch>()

  const onChangeLoadData = async (query: string, endpoint: string) => {
    setText(query)
    if (query.length > 1) {
      clearTimeout(timer)
      //Sqlite doesn't register lowercase/uppercase umlaut characters as the same so here we go...
      query = query.charAt(0).toUpperCase()
      setTimer(
        setTimeout(
          async () => {
            try {
              let result
              if (endpoint === 'categories') {
                result = await getDataMatchingQuery(query, endpoint)
                setDropdownData(result)
              }
              if (endpoint === 'subcategories') {
                result = await getSubcategoriesOfCategory(query, category.title)
                setDropdownData(result?.subcategories)
              }
              if (result) {
                setShowDropdown(true)
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

  const onClickDispatchItemAndSetText = (text: string, item: Category | Subcategory) => {
    setText(text)
    if (props.type === 'typeahead' && props.fetchEndpoint === 'categories') {
      console.log(item)

      dispatch(selectCategory(item))
      setShowDropdown(false)
    }
    if (props.type === 'typeahead' && props.fetchEndpoint === 'subcategories') {
      console.log(item)
      dispatch(selectSubcategory(item))

    }
  }

  if (props.type === 'text')
    return (
      <div className="input input--text">
        <label htmlFor={props.id}>{props.label}</label>
        <input
          value={props.value}
          ref={ref}
          autoFocus={props.autoFocus && true}
          id={props.id}
          type="text"
          placeholder={props.placeholder}
          onChange={props.onChange}
        />
      </div>
    )

  if (props.type === 'number')
    return (
      <div className="input input--number">
        <label htmlFor={props.id}>{props.label}</label>
        <input
          ref={ref}
          id={props.id}
          type="number"
          placeholder={props.placeholder}
          onChange={props.onChange}
        />
      </div>
    )


  if (props.type === 'typeahead')
    return (
      <div className="input input--typeahead">
        <label htmlFor={props.id}>{props.label}</label>
        <input
          id={props.id}
          type="text"
          placeholder={props.placeholder}
          onClick={() => { }}
          value={text}
          onChange={(e) => { onChangeLoadData(e.target.value, props.fetchEndpoint) }}
        />
        <ul className={`dropdown${!showDropdown ? " hideDropdown" : ""}`}>
          {dropdownData && dropdownData.map((item, _i) =>
            <li key={item.title} onClick={() => onClickDispatchItemAndSetText(item.title, item)}>
              {item.title}
            </li>)}
        </ul>
      </div>
    )
})

export default Input
