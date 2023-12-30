import { ReactNode } from 'react'
import './Page.scss'
import Basket from '../basket/Basket'

type PageProps = {
  title: string,
  children: ReactNode
}

function Page(props: PageProps) {
  return (
    <>
      <article className='page'>
        <h1 className='page__title'>{props.title}</h1>
        <div className='page__content'>
          {props.children}
        </div>
      </article>
      <Basket />
    </>
  )
}

export default Page
