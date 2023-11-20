import './ProductCard.scss'

import { Product } from '../../types/ProductTypes'

function ProductCard(props: Product) {
  return (
    <div className='product-card'>
      <h2>{props.name}</h2>
      <p>{props.price}</p>
      <p>{props.categories[0].title}</p>
      <p>{props.categories[0].subcategories && props.categories[0].subcategories[0].title}</p>
      {props.deals && <>
        <h3>Erbjudanden:</h3>
        {props.deals.map((deal, i) =>
          <li key={i}>
            <p>{deal.description}</p>
            <span>{deal.amount} för {deal.total}</span>
          </li>)}
      </>}

    </div>
  )
}

export default ProductCard
