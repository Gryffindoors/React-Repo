import { BrowserRouter, Routes, Route } from 'react-router';
import Home from './pages/Home';
import LoginPage from './pages/loginPage';
import Background from './layouts/background';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/authContext';
import { Toaster } from 'react-hot-toast';
import UsersPage from './pages/UsersPage';


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Background>
          <Toaster position="top-right" />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route path="/users" element={<UsersPage />} />
          </Routes>
        </Background>
      </AuthProvider>
    </BrowserRouter >
  );
}

export default App;
