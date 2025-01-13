import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ChakraProvider } from '@chakra-ui/react';
import { UserProvider } from '../../frontend/src/context/context'; // Assurez-vous que ce chemin est correct
import Navbar from '../../frontend/src/components/Navbar';
import Login from '../../frontend/src/components/Login';
import Signup from '../../frontend/src/components/Signup';
import Searchpage from './Pages/Searchpage';
import Homeconcours from './Pages/Homeconcours';
import Branchespage from './Pages/Branchespage';
import Ingenierie from './Pages/Ingenierie';
import SubcategoryPage from './Pages/SubcategoryPage';
import Presentationpage from './Pages/Presentationpage';
import Universitiespage from './Pages/Universitiespage';

// Initialisation de QueryClient
const queryClient = new QueryClient();

const App = () => {
  const [orderPopup, setOrderPopup] = useState(false);
  const [order, setOrder] = useState(false);

  const handlerOrderPopup = () => {
    setOrderPopup(!orderPopup);
  };

  const handlerOrder = () => {
    setOrder(!order);
  };

  return (
    <ChakraProvider>
      <UserProvider>
        <QueryClientProvider client={queryClient}>
          <Router>
          <Navbar handlerOrderPopup={handlerOrderPopup} handlerOrder={handlerOrder} />
            <Routes>
              <Route path="/search" element={<Searchpage />} />
              <Route path="/" element={<Homeconcours />} />
              <Route path="/Branchespage" element={<Branchespage />} />
              <Route path="/polytech/:concoursId" element={<Presentationpage />} />
              <Route path="/subcategory/:id" element={<SubcategoryPage />} />
              <Route path="/ingenierie" element={<Ingenierie />} />
              <Route path="/ingenierie/:id" element={<Ingenierie />} />
              <Route path="/presentationpage/:concoursId" element={<Presentationpage />} />
              <Route path="/university/:universityId" element={<Universitiespage />} />
            </Routes>
            {orderPopup && <Login orderPopup={orderPopup} setOrderPopup={setOrderPopup} />}
            {order && <Signup order={order} setOrder={setOrder} />}
          </Router>
    //     </QueryClientProvider>
    //   </UserProvider>
    // </ChakraProvider>
  );
};

export default App;
