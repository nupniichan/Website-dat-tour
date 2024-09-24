import PagesRouter from './Router/PagesRouter'
import './App.css'
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
      <>
          <Header />
            <PagesRouter />
          <Footer />
      </>
  );
}

export default App
