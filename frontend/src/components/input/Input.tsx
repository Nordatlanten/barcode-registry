import './Input.scss'

type InputProps = {
  type: 'text' | 'number' | 'typeahead',
  placeholder: string,

}

function Input(props: InputProps) {
  if (props.type === 'typeahead')
    return (
      <input type="text" />
    )
}
