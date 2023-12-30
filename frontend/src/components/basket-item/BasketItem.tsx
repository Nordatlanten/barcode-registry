import './BasketItem.scss'
import { Product } from '../../types/ProductTypes'
import { useDispatch } from "react-redux"
import { AppDispatch, useAppSelector } from '../../redux/store'
import { updateBasket } from '../../redux/features/basketSlice'



function BasketItem(props: { item: Product }) {

  const dispatch = useDispatch<AppDispatch>()
  const basket = useAppSelector((state) => state.basketSlice.value.basket)
  const removeProductFromBasket = (item: Product) => {
    const updatedBasket = basket.filter(product => product !== item)
    dispatch(updateBasket(updatedBasket))
  }

  return (
    <li className='basket-item'>
      <div className='basket-item__data'>
        <h3>{props.item.name}</h3>
        <p>{props.item.price} kr</p>
      </div>
      <button onClick={() => removeProductFromBasket(props.item)}>Ta bort</button>
    </li>
  )
}

export default BasketItem
