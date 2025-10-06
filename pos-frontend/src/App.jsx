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

const initialState = {
  user: {
    isAuth: false,
    user: null,
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


// --- START: Shared Components/Hooks ---

function FullScreenLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/90 backdrop-blur-sm">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
      <p className="ml-4 text-white text-lg">Loading application data...</p>
    </div>
  );
}

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

const NavLink = ({ to, name }) => (
    <RouterLink to={to} className="text-gray-600 hover:text-indigo-600 transition duration-150 font-medium">
        {name}
    </RouterLink>
);

function useLoadData() {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    // Simulate initial setup from an API
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

const RouterLink = ({ to, children, ...props }) => {
    const navigate = useNavigate();
    return (
        <a href="#" onClick={(e) => { e.preventDefault(); navigate(to); }} {...props}>
            {children}
        </a>
    );
};


// --- END: Shared Components/Hooks ---

// --- START: Page Components (with initial content) ---

const PageContainer = ({ title, children }) => (
    <div className="p-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6 border-b pb-2">{title}</h2>
        <div className="bg-white p-6 rounded-xl shadow-lg min-h-[500px]">
            {children}
        </div>
    </div>
);

function Home() {
    const { user } = useSelector(state => state.user);
    const [stats, setStats] = useState({ revenue: 0, orders: 0, tables: 0 });

    // Mock Fetching Data (Where you would call your Render API: /api/order/stats)
    useEffect(() => {
        // Replace with actual API call to https://pos-nh74.onrender.com/api/dashboard/stats
        setTimeout(() => {
            setStats({
                revenue: 1450.50,
                orders: 42,
                tables: 15,
            });
        }, 500);
    }, []);

    const cards = [
        { title: "Today's Revenue", value: `$${stats.revenue.toFixed(2)}`, color: "text-green-500", icon: "💰" },
        { title: "New Orders", value: stats.orders, color: "text-indigo-500", icon: "🧾" },
        { title: "Open Tables", value: stats.tables, color: "text-yellow-500", icon: "🍽️" },
    ];

    return (
        <PageContainer title={`Welcome Back, ${user?.name || 'Manager'}`}>
            <p className="text-gray-600 mb-6">Quick overview of today's operational status.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cards.map((card, index) => (
                    <div key={index} className="bg-indigo-50 p-6 rounded-xl shadow-lg border border-indigo-100 transition duration-300 hover:shadow-xl">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-700">{card.title}</h3>
                            <span className="text-3xl">{card.icon}</span>
                        </div>
                        <p className={`mt-2 text-4xl font-bold ${card.color}`}>
                            {card.value}
                        </p>
                    </div>
                ))}
            </div>
        </PageContainer>
    );
}

function Auth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isRegister, setIsRegister] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // --- AUTH LOGIC INTEGRATION POINT ---
        // 1. **CORS/502 FIX CHECK:** This is where you would fetch data from your Render backend.
        //    Example Fetch: fetch('https://pos-nh74.onrender.com/api/user/login', { ... });
        //    If your CORS and 502 fixes are in place on Render, this will succeed.

        try {
            // Simulate a successful API response
            await new Promise(resolve => setTimeout(resolve, 1500)); 
            
            // This dispatch simulates the successful response payload from your backend
            dispatch({ 
                type: 'LOGIN_SUCCESS', 
                payload: { user: { name: formData.email, role: isRegister ? 'waiter' : 'manager' }, token: 'real-token' } 
            });
            
            // 2. **useNavigate FIX CHECK:** This works because useNavigate is correctly imported
            navigate('/'); 
        } catch (error) {
            console.error("Auth failed:", error);
            // Dispatch failure state or show error message here
        } finally {
            setLoading(false);
        }
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
                        disabled={loading}
                        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition duration-150 ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'}`}
                    >
                        {loading ? 'Processing...' : (isRegister ? 'Register' : 'Login')}
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
    const [orders, setOrders] = useState([
        { id: 101, table: 5, total: 35.50, status: 'Completed', time: '10:30 AM' },
        { id: 102, table: 2, total: 88.00, status: 'In Progress', time: '11:15 AM' },
        { id: 103, table: 8, total: 12.99, status: 'Pending', time: '12:00 PM' },
    ]);

    return (
        <PageContainer title="Orders Management">
            <p className="text-gray-600 mb-4">Track and manage current and past customer orders here.</p>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {['Order ID', 'Table', 'Total', 'Status', 'Time'].map(header => (
                                <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-indigo-50 transition duration-150">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.table}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">${order.total.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                        order.status === 'In Progress' ? 'bg-indigo-100 text-indigo-800' :
                                        'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.time}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </PageContainer>
    );
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
        <Route path="*" element={<PageContainer title="404 Not Found"><p className="text-red-500">The requested page was not found.</p></PageContainer>} />
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
