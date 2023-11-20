import './ProductCard.scss'
import { Product } from '../../types/ProductTypes'



function ProductCard(props: Product) {
  return (
    <div className='product-card'>
      <h2>{props.name}</h2>
      <p>{props.price}</p>
      <p>{props.category.title}</p>
      <p>{props.subcategory.title}</p>
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
