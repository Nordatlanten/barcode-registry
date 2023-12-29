import { Subcategory } from '../../types/ProductTypes'
import './Select.scss'

type SelectProps = {
  data: Subcategory[],
  id: string,
  label: string,
  onChange: React.ChangeEventHandler<HTMLSelectElement>
}

function Select(props: SelectProps) {
  return (
    <div className='select'>
      <label htmlFor={props.id}>{props.label}</label>
      <select id={props.id} onChange={props.onChange}>
        <option value="">-- Ingen vald --</option>
        {props.data && props.data.map((item, _i) =>
          <option value={item.title} key={item.title}>
            {item.title}
          </option>)}
      </select>
    </div>
  )
}

export default Select
