import Page from "../components/page/Page"
import BarcodeSearch from "../components/barcode-search/BarcodeSearch"
import Input from "../components/input/Input"

function BarcodeSearchPage() {
  return (
    <Page title="Sök streckkod">
      <BarcodeSearch />
      <Input type="typeahead" id="test" label="test" placeholder="test" />
    </Page>
  )
}

export default BarcodeSearchPage
