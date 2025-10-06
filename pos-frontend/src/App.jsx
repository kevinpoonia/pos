import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
  useNavigate,
} from "react-router-dom";

// --- START: Single-File React-Redux Setup ---
// Redux-like global state setup using React Context and Hooks (for single file compliance)

// 1. DUMMY REDUX STORE / STATE
const initialState = {
  user: {
    isAuth: false,
    user: null,
    // Add token/error states if needed for Auth component logic
    token: null,
    error: null,
  },
};

const AuthContext = React.createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return { ...state, user: { isAuth: true, user: action.payload.user, token: action.payload.token } };
    case 'LOGOUT':
      return { ...state, user: { isAuth: false, user: null, token: null } };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

const AuthProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(authReducer, initialState);
  
  // Custom useSelector-like hook
  const useSelector = (selectorFn) => selectorFn(state);

  // Custom useDispatch-like function
  const useDispatch = () => dispatch;
  
  const value = useMemo(() => ({ state, dispatch, useSelector, useDispatch }), [state]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom Hook to access state and dispatch globally
const useReduxStore = () => React.useContext(AuthContext);

// Custom useSelector implementation (from external Redux)
const useSelector = (selectorFn) => {
    const { useSelector } = useReduxStore();
    return useSelector(selectorFn);
};
// Custom useDispatch implementation (from external Redux)
const useDispatch = () => {
    const { useDispatch } = useReduxStore();
    return useDispatch();
};

// --- END: Single-File React-Redux Setup ---


// --- START: Shared Components/Hooks ---

// 1. FullScreenLoader (Previously imported from ./components/shared/FullScreenLoader)
function FullScreenLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/90 backdrop-blur-sm">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
      <p className="ml-4 text-white text-lg">Loading application data...</p>
    </div>
  );
}

// 2. Header (Previously imported from ./components/shared/Header)
function Header() {
    const { isAuth, user } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch({ type: 'LOGOUT' });
        // After logout, navigate to auth page
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

const NavLink = ({ to, name }) => (
    <RouterLink to={to} className="text-gray-600 hover:text-indigo-600 transition duration-150 font-medium">
        {name}
    </RouterLink>
);

// 3. useLoadData Hook (Previously imported from ./hooks/useLoadData)
function useLoadData() {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    // Simulate fetching user data or initial setup from an API
    const loadInitialData = () => {
      // For demonstration: Set a dummy authenticated user after 1 second
      setTimeout(() => {
        dispatch({ type: 'LOGIN_SUCCESS', payload: { user: { name: 'Admin', role: 'manager' }, token: 'mock-token' } });
        setIsLoading(false);
      }, 1000);
    };

    loadInitialData();
  }, [dispatch]);

  return isLoading;
}

// Renaming Link to RouterLink to avoid confusion with NavLink component
const RouterLink = ({ to, children, ...props }) => {
    const navigate = useNavigate();
    return (
        <a href="#" onClick={(e) => { e.preventDefault(); navigate(to); }} {...props}>
            {children}
        </a>
    );
};


// --- END: Shared Components/Hooks ---

// --- START: Page Components (Previously imported from ./pages) ---

const PageContainer = ({ title, children }) => (
    <div className="p-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6 border-b pb-2">{title}</h2>
        <div className="bg-white p-6 rounded-xl shadow-lg">
            {children}
        </div>
    </div>
);

function Home() {
  return <PageContainer title="Home"><p className="text-gray-600">Welcome to the POS Home screen. Quick access and overview goes here.</p></PageContainer>;
}

function Auth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isRegister, setIsRegister] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate API call success
        console.log(`Submitting ${isRegister ? 'Registration' : 'Login'} for:`, formData);
        
        // Use the navigate function (lowercase 'n') which fixes the previous error
        dispatch({ type: 'LOGIN_SUCCESS', payload: { user: { name: formData.email, role: 'waiter' }, token: 'new-token' } });
        navigate('/'); 
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl">
                <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">
                    {isRegister ? 'Register Account' : 'Sign In'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            name="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
                    >
                        {isRegister ? 'Register' : 'Login'}
                    </button>
                </form>
                <p className="mt-6 text-center text-sm">
                    {isRegister ? "Already have an account? " : "Don't have an account? "}
                    <button
                        type="button"
                        onClick={() => setIsRegister(!isRegister)}
                        className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-150"
                    >
                        {isRegister ? 'Sign In' : 'Register'}
                    </button>
                </p>
            </div>
        </div>
    );
}

function Orders() {
  return <PageContainer title="Orders Management"><p className="text-gray-600">Track and manage current and past customer orders here.</p></PageContainer>;
}
function Tables() {
  return <PageContainer title="Table Status"><p className="text-gray-600">View and manage table occupancy and status.</p></PageContainer>;
}
function Menu() {
  return <PageContainer title="Menu Editor"><p className="text-gray-600">Edit, add, and remove menu items and categories.</p></PageContainer>;
}
function Dashboard() {
  return <PageContainer title="Dashboard & Reports"><p className="text-gray-600">View sales reports, daily summaries, and performance metrics.</p></PageContainer>;
}

// --- END: Page Components ---


// --- Main App Logic (from your provided code) ---

function Layout() {
  // useLoadData now handles both loading state and initial auth simulation
  const isLoading = useLoadData(); 
  const location = useLocation();
  const hideHeaderRoutes = ["/auth"];
  // useSelector now comes from the custom context implementation
  const { isAuth } = useSelector(state => state.user); 

  if(isLoading) return <FullScreenLoader />

  return (
    <>
      {/* Conditionally render Header based on route */}
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
        {/* Navigate component (Capital 'N') is correct for component-based redirect */}
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
        <Route path="*" element={<PageContainer title="404 Not Found"><p className="text-red-500">The requested page was not found.</p></PageContainer>} />
      </Routes>
    </>
  );
}

function ProtectedRoutes({ children }) {
  const { isAuth } = useSelector((state) => state.user);
  if (!isAuth) {
    // Navigate component (Capital 'N') is correct here for component-based redirect
    return <Navigate to="/auth" />; 
  }

  return children;
}

function App() {
  return (
    // Wrap the application in the custom AuthProvider (simulating Redux Provider)
    <AuthProvider>
      <Router>
        <Layout />
      </Router>
    </AuthProvider>
  );
}

export default App;
