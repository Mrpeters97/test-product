import VariantSelector from './components/ui/VariantSelector'
import ContentCards from './components/ui/ContentCards'
import PageHeader from './components/layout/PageHeader'
import Sidebar from './components/layout/Sidebar'
import RightAnchorMenu from './components/layout/RightAnchorMenu'
import { ProductProvider } from './context/ProductContext2'
import { ScrollProvider } from './context/ScrollContext'
import { TourProvider } from './context/TourContext'
import ProductTour from './components/ui/ProductTour'


function App() {
  return (
    <TourProvider>
    <ScrollProvider>
      <ProductProvider>
        <PageHeader />
        <Sidebar />
        <div className="flex w-full min-h-screen bg-[#fcfcfc]" style={{ minHeight: '100vh' }}>
          <div
            className="grid"
            style={{
              marginLeft: 'max(calc(256px + 24px), calc(50vw - 832px))',
              marginRight: 'auto',
              marginTop: '180px',
              paddingTop: 'var(--Gap-6, 24px)',
              paddingRight: 'var(--Gap-6, 24px)',
              paddingBottom: 'var(--Gap-0, 0)',
              paddingLeft: 0,
              gridTemplateColumns: 'minmax(0, 4fr) minmax(220px, 1fr)',
              gap: 'clamp(32px, 3.5vw, 36px)',
              width: '100%',
              maxWidth: '1920px',
            }}
          >
            <div className="flex flex-col items-center w-full max-w-full" style={{ minWidth: 0, gap: '28px', paddingBottom: '128px' }}>
              <VariantSelector />
              <main className="w-full">
                <ContentCards />
              </main>
            </div>
            <div className="w-full max-w-full">
              <RightAnchorMenu />
            </div>
          </div>
        </div>
        <ProductTour />
      </ProductProvider>
    </ScrollProvider>
    </TourProvider>
  )
}

export default App
