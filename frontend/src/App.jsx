import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React, { useState } from 'react';
import Bib from './pages/Bib';
import Accueil from './pages/Accueil';
import Login from './components/Login';
import Signup from './components/Signup';
import Learn from './pages/Learn';
import Hobbies from './pages/Hobbies';
import LearnDetails from './pages/LearnDetails';
import Classeur from './pages/Classeur';
import Category from './pages/Category';
import Souscategory from './pages/Souscategory';
import Book from './pages/Book';
import Result from './pages/Result';
import ResetPassword from './pages/ResetPassword';
import ResetPasswordConfirm from './pages/ResetPasswordConfirm';
import { UserProvider } from './context/context';
import Navbar from './components/Navbar';
import PrivateRoute from './utils/PrivateRoute';
import Profile from './pages/Profile';
import { QueryClient, QueryClientProvider } from "react-query";
import { ChakraProvider } from '@chakra-ui/react';
import ActivateEmail from './pages/Activate';
import Branche from './pages/Branche';
import Error from './pages/Error';
import Homeconcours from './pages/Homeconcours';
import Searchpage from './pages/Searchpage';
import SubcategoryPage from './pages/SubcategoryPage';
import Branchespage from './pages/Branchespage';
import Presentationpage from './pages/Presentationpage';
import Ingenierie from './pages/Ingenierie';
import Universitiespage from './pages/Universitiespage';
import { Helmet } from 'react-helmet';

function App() {
  const [orderPopup, setOrderPopup] = useState(false);
  const [order, setOrder] = useState(false);

  const handlerOrderPopup = () => { 
    setOrderPopup(!orderPopup);
    setOrder(order);
  };

  const handlerOrder = () => { 
    setOrder(!order);
    setOrderPopup(orderPopup);
  };

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
        cacheTime: Infinity,
      },
    },
  });

  return (
    <>
      <BrowserRouter>
      <ChakraProvider>
        <UserProvider>
          <QueryClientProvider client={queryClient}>
              <Navbar handlerOrderPopup={handlerOrderPopup} handlerOrder={handlerOrder} />
              <Routes>
               
                <Route path='/' element={<Accueil />} />
                <Route path='/bibliotheque' element={<Bib />} />
                <Route path='auth/activate/:uid/:token' element={<ActivateEmail />} />
                <Route path='/bibliotheque/enseignements' element={<Learn />} />
                <Route path='/bibliotheque/loisirs' element={<Hobbies />} />
                <Route path='/profile' element={<Profile />} />
                <Route path='/resultat' element={<Result />} />
                <Route path='/search' element={<Searchpage />} />
                <Route path="/Branchespage" element={<Branchespage />} />
                <Route path="/polytech/:concoursId" element={<Presentationpage />} />
                <Route path="/ingenierie" element={<Ingenierie />} />
                <Route path="/ingenierie/:id" element={<Ingenierie />} />
                <Route path='/subcategory/:id' element={<SubcategoryPage />} />
                <Route path="/presentationpage/:concoursId" element={<Presentationpage />} />
                <Route path="/university/:universityId" element={<Universitiespage />} />
                <Route path='/livres/catégories/:id' element={<Category />} />
                <Route path='/livres/sous-catégories/:id' element={<Souscategory />} />
                <Route path='/book/:id' element={<LearnDetails />} />
                <Route path='/classeur/:id' element={<Classeur />} />
                <Route 
                  path='/bibliotheque/enseignements/livre/:id' element={<Book />} 
                />
                <Route path="*" element={<Error />} />
                <Route path='/login' element={<Login />} />
                <Route path='/signup' element={<Signup />} />
                <Route path='/reset-password' element={<ResetPassword />} />
                <Route path='auth/reset-password/:uid/:token' element={<ResetPasswordConfirm />} />
                <Route path='/homeconcours' element={<Homeconcours />} />
                <Route path='/book' element={<PrivateRoute element={<Book />} />} />
                <Route path="/documents/sous_category/:id/branche/:brancheId" element={<Branche />} />
              </Routes>
            <Login orderPopup={orderPopup} setOrderPopup={setOrderPopup} handlerOrder={handlerOrder} />
            <Signup order={order} setOrder={setOrder} handlerOrderPopup={handlerOrderPopup} />
          </QueryClientProvider>
        </UserProvider>
        </ChakraProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
