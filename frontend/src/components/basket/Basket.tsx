import './Basket.scss'

import { Product } from '../../types/ProductTypes'
import { useDispatch } from "react-redux"
import { AppDispatch, useAppSelector } from '../../redux/store'
import { resetBasket, updateBasket, addBasketToBasketHistory } from '../../redux/features/basketSlice'

import BasketItem from '../basket-item/BasketItem'





function Basket() {
  const dispatch = useDispatch<AppDispatch>()
  const basket = useAppSelector((state) => state.basketSlice.value.basket)

  return (
    <aside className='basket'>
      {basket && basket.length === 0 && <p className='basket__empty-basket-display'>
        Inga varor är skannade
      </p>}
      {basket && basket.length > 0 &&
        <>
          <ul className='basket__list'>
            {basket.map((product, i) =>
              <BasketItem item={product} />
            )}
          </ul>
          <div className='basket__footer'>
            <p>Total: {basket.reduce(((total, item) => total = total + item.price), 0)}&nbsp;kr</p>
            <div className='basket__button-panel'>
              <button onClick={() => dispatch(resetBasket())}>
                Töm korgen
              </button>
              <button onClick={() => { dispatch(addBasketToBasketHistory(basket)); dispatch(resetBasket()) }}>
                Spara korgen
              </button>
            </div>

          </div>
        </>
      }

    </aside>
  )
}

export default Basket
