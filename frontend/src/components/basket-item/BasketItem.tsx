import './BasketItem.scss'
import { Product } from '../../types/ProductTypes'
import { useDispatch } from "react-redux"
import { AppDispatch, useAppSelector } from '../../redux/store'
import { addProductToBasket, updateBasket } from '../../redux/features/basketSlice'
import { checkBasketForItem } from '../../utils/basketFunctions'


function BasketItem(props: { item: Product[] }) {

  const dispatch = useDispatch<AppDispatch>()
  const basket = useAppSelector((state) => state.basketSlice.value.basket)
  const removeProductFromBasket = (item: Product) => {
    const updatedBasket = basket.filter(product => product !== item)
    dispatch(updateBasket(updatedBasket))
  }


  const decreaseProductQuantity = (product: Product) => {
    const index = basket.indexOf(product)
    let newBasket = [...basket]
    if (index > -1) {
      newBasket.splice(index, 1)
      dispatch(updateBasket(newBasket))
    }
  }

  const increaseProductQuantity = (product: Product) => {
    const entries = checkBasketForItem(product, basket)
    dispatch(addProductToBasket(product))
  }


  return (
    <li className='basket-item'>
      <div className='basket-item__content'>
        <div className='basket-item__header'>
          <h3>{props.item[0].name}</h3>
          <button onClick={() => removeProductFromBasket(props.item[0])}>🗑️</button>
        </div>
        <p>{props.item[0].price} kr</p>
        <div className='basket-item__footer'>
          <div className='basket-item__quantity-panel'>
            <button onClick={() => decreaseProductQuantity(props.item[0])}>-</button>
            <span>{props.item.length}</span>
            <button onClick={() => increaseProductQuantity(props.item[0])}>+</button>
          </div>
          <div className='basket-item__sum'>
            {props.item[0].price * props.item.length} kr
          </div>
        </div>
      </div>
    </li>
  )
}

export default BasketItem
