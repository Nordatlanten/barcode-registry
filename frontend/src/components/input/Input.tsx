import './Input.scss'
import { Category, Subcategory } from '../../types/ProductTypes'

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
  if (props.type === 'typeahead')
    return (
      <div>
        <label htmlFor={props.id}>{props.label}</label>
        <input id={props.id} type="text" placeholder={props.placeholder} />
        <ul>
          {props.data && props.data.map((item, _i) =>
            <li key={item.title}>
              {item.title}
            </li>)}
        </ul>
      </div>
    )
}

export default Input
