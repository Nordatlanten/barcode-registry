import './ProductCard.scss'
import { Product } from '../../types/ProductTypes'



function ProductCard(props: Product) {
  return (
    <div className='product-card'>
      <h2 className='product-card__title'>{props.name}</h2>
      <p className='product-card__price'>{props.price} SEK</p>
      <p>Kategori: {props.category.title}</p>
      <p>Subkategori: {props.subcategory.title}</p>
      {props.deals && props.deals.length > 0 && <>
        <h3>Erbjudanden:</h3>
        {props.deals.map((deal, i) =>
          <li key={i}>
            <p>{deal.description}</p>
            <span>{deal.amount} för {deal.total}</span>
          </li>)}
      </>}

    </div >
  )
}

export default ProductCard
