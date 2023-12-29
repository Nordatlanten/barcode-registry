import Page from "../components/page/Page"
import BarcodeSearch from "../components/barcode-search/BarcodeSearch"
import Input from "../components/input/Input"

import { selectBarcode } from "../redux/features/newProductSlice"
import { useDispatch } from "react-redux"
import { AppDispatch, useAppSelector } from "../redux/store"

function BarcodeSearchPage() {
  const dispatch = useDispatch<AppDispatch>()
  const barcode = useAppSelector((state) => state.newProductReducer.value.barcode)
  return (
    <Page title="Sök streckkod">
      <BarcodeSearch />
      {/* <Input type="typeahead" id="test" label="test" placeholder="test" />
      <button onClick={() => {
        dispatch(selectBarcode("LOOOOOOOL"))
      }}>Click to change barcode</button>
      <p>{barcode}</p> */}
    </Page>
  )
}

export default BarcodeSearchPage
