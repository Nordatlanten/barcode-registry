import './Basket.scss'

import { Product } from '../../types/ProductTypes'
import { useDispatch } from "react-redux"
import { AppDispatch, useAppSelector } from '../../redux/store'
import { resetBasket, updateBasket, addBasketToBasketHistory } from '../../redux/features/basketSlice'
import { groupBy, checkBasketForItem } from '../../utils/basketFunctions'
import BasketItem from '../basket-item/BasketItem'




function Basket() {
  const dispatch = useDispatch<AppDispatch>()
  const basket = useAppSelector((state) => state.basketSlice.value.basket)
  const groupedBasket = groupBy(basket, i => i.barcode)

  return (
    <aside className='basket'>
      {basket && basket.length === 0 && <p className='basket__empty-basket-display'>
        Inga varor är skannade
      </p>}
      {Object.values(groupedBasket) && Object.values(groupedBasket).length > 0 &&
        <>
          <ul className='basket__list'>
            {Object.values(groupedBasket).map((uniqueItem, i) => (
              <BasketItem key={uniqueItem[0].barcode} item={uniqueItem} />
            ))

            }
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
