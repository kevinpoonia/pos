import React, { useState, useEffect, useMemo } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
  useNavigate,
} from "react-router-dom";

// External Library Imports (Mocked or simplified for single-file use)
// NOTE: These are mocked/simplified. You need to replace the entire App
// with your actual code that correctly implements Redux and React Query.
const keepPreviousData = true;
const useQuery = ({ queryKey, queryFn, placeholderData }) => ({ 
    data: { data: { data: [] } }, 
    isError: false, 
    isLoading: false 
});
const enqueueSnackbar = (message, options) => console.log('Snackbar:', message); 

// --- START: SVG Icon Placeholders ---

const MdTableBar = (props) => <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M7 16H3c-1.1 0-2 .9-2 2v3h22v-3c0-1.1-.9-2-2-2h-4v-2H7v2zm12-4V4H5v8H3V4c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v8h-2z"/></svg>;
const MdCategory = (props) => <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M12 2l-5.5 9h11L12 2zm0 3.84L13.93 9h-3.86L12 5.84zM17.5 13c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5zM3 21.5h7v-7H3v7z"/></svg>;
const BiSolidDish = (props) => <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M21 15.5c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1.5 21H22v-2H1.5c-1.1 0-2-.9-2-2s.9-2 2-2H22V13H1.5c-2.21 0-4 1.79-4 4s1.79 4 4 4zM2 11c0-3.31 2.69-6 6-6h8c3.31 0 6 2.69 6 6v2H2v-2zM4 9v2h16V9c0-2.21-1.79-4-4-4H8c-2.21 0-4 1.79-4 4z"/></svg>;
const BsCashCoin = (props) => <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M10 20v-2H4V2h10v2h2v4h4v12h-6v-2h4v-8h-2V6h-8V4H4v12h6v2zM14 8h-4v2h4zm0 4h-4v2h4z"/></svg>;
const GrInProgress = (props) => <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M12 4c-4.41 0-8 3.59-8 8s3.59 8 8 8 8-3.59 8-8-3.59-8-8-8zm-1 12H9v-6h2v6zm4-3h-2v3h2v-3z"/></svg>;
const MdRestaurantMenu = (props) => <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M8.1 13.34L15.9 5.54c.78-.78 2.05-.78 2.83 0l2.5 2.5c.78.78.78 2.05 0 2.83L13.48 20.3c-.78.78-2.05.78-2.83 0l-2.5-2.5c-.78-.78-.78-2.05 0-2.83zm5.66 4.31l1.41-1.41-5.18-5.18-1.41 1.41 5.18 5.18z"/></svg>;

// --- END: SVG Icon Placeholders ---

// --- START: Single-File React-Redux Setup ---

const initialState = {
  user: {
    isAuth: false,
    user: null,
    token: null,
    error: null,
  },
  customer: {
    customerName: 'Guest',
    table: { tableNo: 'N/A' }
  }
};

const AuthContext = React.createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return { ...state, user: { isAuth: true, user: action.payload.user, token: action.payload.token } };
    case 'LOGOUT':
      return { ...state, user: { isAuth: false, user: null, token: null } };
    default:
      return state;
  }
};

const AuthProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(authReducer, initialState);
  
  const useSelector = (selectorFn) => selectorFn(state);
  const useDispatch = () => dispatch;
  
  const value = useMemo(() => ({ state, dispatch, useSelector, useDispatch }), [state]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useReduxStore = () => React.useContext(AuthContext);

const useSelector = (selectorFn) => {
    const { useSelector } = useReduxStore();
    return useSelector(selectorFn);
};
const useDispatch = () => {
    const { useDispatch } = useReduxStore();
    return useDispatch();
};

// --- END: Single-File React-Redux Setup ---

// --- START: Minimal Page Structure Components ---

// Mock Components
const FullScreenLoader = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/90 backdrop-blur-sm">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
      <p className="ml-4 text-white text-lg">Loading...</p>
    </div>
);
const RouterLink = ({ to, children, ...props }) => {
    const navigate = useNavigate();
    return (
        <a href="#" onClick={(e) => { e.preventDefault(); navigate(to); }} {...props}>
            {children}
        </a>
    );
};
const NavLink = ({ to, name }) => (
    <RouterLink to={to} className="text-gray-600 hover:text-indigo-600 transition duration-150 font-medium">
        {name}
    </RouterLink>
);

function Header() {
    const { isAuth, user } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch({ type: 'LOGOUT' });
        navigate('/auth'); 
    };

    return (
        <header className="bg-white shadow-md sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
                <div className="flex items-center space-x-6">
                    <h1 className="text-xl font-bold text-indigo-600">POS System</h1>
                    <nav className="hidden md:flex space-x-4">
                        <NavLink to="/" name="Home" />
                        <NavLink to="/orders" name="Orders" />
                        <NavLink to="/tables" name="Tables" />
                        <NavLink to="/menu" name="Menu" />
                        <NavLink to="/dashboard" name="Dashboard" />
                    </nav>
                </div>
                {isAuth ? (
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-600 text-sm hidden sm:inline">Welcome, {user?.name || 'User'}</span>
                        <button
                            onClick={handleLogout}
                            className="px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition duration-150 shadow-md"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => navigate('/auth')}
                        className="px-3 py-1 bg-indigo-500 text-white text-sm font-medium rounded-lg hover:bg-indigo-600 transition duration-150 shadow-md"
                    >
                        Login / Register
                    </button>
                )}
            </div>
        </header>
    );
}

function useLoadData() {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    // Simulate loading data/checking auth status
    setTimeout(() => {
      // Mock successful authentication for testing
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user: { name: 'Admin' }, token: 'mock-token' } });
      setIsLoading(false);
    }, 1000);
  }, [dispatch]);

  return isLoading;
}


// Placeholder components for your actual pages
const PlaceholderPage = ({ name }) => (
    <div className="bg-[#1f1f1f] h-[calc(100vh-5rem)] p-10 text-center text-white flex items-center justify-center">
        <div className="text-3xl font-bold">
            {name} Page Loaded Successfully!
            <p className="text-lg text-yellow-400 mt-2">
                Paste the content of your original **{name}.jsx** file here.
            </p>
        </div>
    </div>
);

function Home() {
    return <PlaceholderPage name="Home" />;
}
function Auth() {
    // Auth page is slightly more complex, but we revert to placeholder logic
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isRegister, setIsRegister] = useState(false);

    const handleMockLogin = () => {
         dispatch({ type: 'LOGIN_SUCCESS', payload: { user: { name: 'Test User' }, token: 'mock-token' } });
         navigate('/');
    };

    return (
        <div className="flex min-h-screen w-full bg-[#1a1a1a] text-white p-10 items-center justify-center">
             <div className="bg-[#1f1f1f] p-10 rounded-xl shadow-2xl max-w-md w-full text-center">
                <h2 className="text-3xl font-bold text-yellow-400 mb-6">
                    {isRegister ? "Employee Registration" : "Employee Login"}
                </h2>
                <p className="mb-4 text-gray-400">
                    Paste your **Login/Register** form content here.
                </p>
                <button 
                    onClick={handleMockLogin} 
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition"
                >
                    Mock {isRegister ? "Register" : "Login"} (Click to continue)
                </button>
                <div className="mt-4 text-sm text-[#ababab]">
                    {isRegister ? "Already have an account?" : "Don't have an account?"}
                    <a onClick={() => setIsRegister(!isRegister)} className="text-yellow-400 font-semibold hover:underline cursor-pointer ml-1" href="#">
                        {isRegister ? "Sign in" : "Sign up"}
                    </a>
                </div>
            </div>
        </div>
    );
}
function Orders() {
    return <PlaceholderPage name="Orders" />;
}
function Tables() {
    return <PlaceholderPage name="Tables" />;
}
function Menu() {
    return <PlaceholderPage name="Menu" />;
}
function Dashboard() {
    return <PlaceholderPage name="Dashboard" />;
}

// --- END: Page Components ---

// --- Main App Logic ---

function Layout() {
  const isLoading = useLoadData(); 
  const location = useLocation();
  const hideHeaderRoutes = ["/auth"];
  const { isAuth } = useSelector(state => state.user); 

  if(isLoading) return <FullScreenLoader />

  return (
    <>
      {!hideHeaderRoutes.includes(location.pathname) && <Header />}
      
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoutes>
              <Home />
            </ProtectedRoutes>
          }
        />
        <Route path="/auth" element={isAuth ? <Navigate to="/" /> : <Auth />} />
        <Route
          path="/orders"
          element={
            <ProtectedRoutes>
              <Orders />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/tables"
          element={
            <ProtectedRoutes>
              <Tables />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/menu"
          element={
            <ProtectedRoutes>
              <Menu />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoutes>
              <Dashboard />
            </ProtectedRoutes>
          }
        />
        <Route path="*" element={<PlaceholderPage name="404 Not Found" />} />
      </Routes>
    </>
  );
}

function ProtectedRoutes({ children }) {
  const { isAuth } = useSelector((state) => state.user);
  if (!isAuth) {
    return <Navigate to="/auth" />; 
  }

  return children;
}

// Mock Query Provider
const QueryProvider = ({ children }) => <>{children}</>;

function App() {
  return (
    <AuthProvider>
      <QueryProvider>
          <Router>
            <Layout />
          </Router>
      </QueryProvider>
    </AuthProvider>
  );
}

export default App;
