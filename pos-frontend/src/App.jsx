import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
  useNavigate,
} from "react-router-dom";

// External Library Imports
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
// Removed: import { MdTableBar, MdCategory, MdRestaurantMenu } from "react-icons/md";
// Removed: import { BiSolidDish } from "react-icons/bi";
// Removed: import { BsCashCoin } from "react-icons/bs";
// Removed: import { GrInProgress } from "react-icons/gr";

// --- START: SVG Icon Replacements for react-icons ---

const IconWrapper = ({ children, className }) => (
    <svg className={className} width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor">
        {children}
    </svg>
);

// MD Icons
const MdTableBar = (props) => (
    <IconWrapper {...props}><path d="M7 16H3c-1.1 0-2 .9-2 2v3h22v-3c0-1.1-.9-2-2-2h-4v-2H7v2zm12-4V4H5v8H3V4c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v8h-2z"/></IconWrapper>
);
const MdCategory = (props) => (
    <IconWrapper {...props}><path d="M12 2l-5.5 9h11L12 2zm0 3.84L13.93 9h-3.86L12 5.84zM17.5 13c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5zM3 21.5h7v-7H3v7z"/></IconWrapper>
);
const MdRestaurantMenu = (props) => (
    <IconWrapper {...props}><path d="M8.1 13.34L15.9 5.54c.78-.78 2.05-.78 2.83 0l2.5 2.5c.78.78.78 2.05 0 2.83L13.48 20.3c-.78.78-2.05.78-2.83 0l-2.5-2.5c-.78-.78-.78-2.05 0-2.83zm5.66 4.31l1.41-1.41-5.18-5.18-1.41 1.41 5.18 5.18z"/></IconWrapper>
);

// BI Icons
const BiSolidDish = (props) => (
    <IconWrapper {...props}><path d="M21 15.5c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1.5 21H22v-2H1.5c-1.1 0-2-.9-2-2s.9-2 2-2H22V13H1.5c-2.21 0-4 1.79-4 4s1.79 4 4 4zM2 11c0-3.31 2.69-6 6-6h8c3.31 0 6 2.69 6 6v2H2v-2zM4 9v2h16V9c0-2.21-1.79-4-4-4H8c-2.21 0-4 1.79-4 4z"/></IconWrapper>
);

// BS Icons
const BsCashCoin = (props) => (
    <IconWrapper {...props}><path d="M10 20v-2H4V2h10v2h2v4h4v12h-6v-2h4v-8h-2V6h-8V4H4v12h6v2zM14 8h-4v2h4zm0 4h-4v2h4z"/></IconWrapper>
);

// GR Icons
const GrInProgress = (props) => (
    <IconWrapper {...props}><path d="M12 4c-4.41 0-8 3.59-8 8s3.59 8 8 8 8-3.59 8-8-3.59-8-8-8zm-1 12H9v-6h2v6zm4-3h-2v3h2v-3z"/></IconWrapper>
);

// --- END: SVG Icon Replacements ---


// --- START: Single-File React-Redux Setup ---

const initialState = {
  user: {
    isAuth: false,
    user: null,
    token: null,
    error: null,
  },
  // Added placeholder for customer data used in Menu component
  customer: {
    customerName: 'Guest Customer',
    table: {
      tableNo: 15,
    }
  }
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


// --- START: Mock External Components and HTTP Functions (REPLACE WITH YOUR CODE) ---

// Placeholder for useQuery fetch functions
const getOrders = async () => ({
  data: {
    data: [{ _id: 'o1', tableNo: 1, total: 50, status: 'progress' }] 
  }
});
const getTables = async () => ({
  data: {
    data: [{ _id: 't1', tableNo: 1, status: 'booked', seats: 4, currentOrder: { customerDetails: { name: 'J Smith' } } }]
  }
});

// Placeholder for Components
const BottomNav = () => <div className="absolute bottom-0 w-full h-16 bg-[#1a1a1a] flex items-center justify-center text-white">BOTTOM NAV</div>;
const BackButton = () => <div className="text-[#f5f5f5] cursor-pointer">← Back</div>;
const Metrics = () => <div className="text-white p-6 container mx-auto">Metrics Component Content</div>;
const RecentOrders = () => <div className="text-white p-6 container mx-auto">RecentOrders Component Content</div>;
const Login = ({ setLoading, handleSubmit }) => (
    <div className="text-white">
        <p>Login Form Placeholder</p>
        <button className="bg-yellow-400 text-black p-2 rounded" onClick={handleSubmit}>Login</button>
    </div>
);
const Register = ({ setLoading, handleSubmit }) => (
    <div className="text-white">
        <p>Register Form Placeholder</p>
        <button className="bg-yellow-400 text-black p-2 rounded" onClick={handleSubmit}>Register</button>
    </div>
);
const OrderCard = ({ order }) => (
    <div className="bg-[#1a1a1a] p-4 text-white rounded-lg">Order {order._id} - Status: {order.status}</div>
);
const TableCard = ({ name, status, seats, initials }) => (
    <div className={`p-4 rounded-lg text-white ${status === 'booked' ? 'bg-red-700' : 'bg-green-700'}`}>Table {name} ({seats} seats)</div>
);
const Modal = ({ setIsTableModalOpen }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
        <div className="bg-white p-6 rounded">Table Modal</div>
        <button onClick={() => setIsTableModalOpen(false)}>Close</button>
    </div>
);
const Greetings = () => <div className="text-white p-8 text-2xl">Hello, Admin!</div>;
const MiniCard = ({ title, icon, number }) => (
    <div className="bg-[#1a1a1a] p-4 rounded-lg text-white flex justify-between">
        <div>{title}: {number}</div>
        <div>{icon}</div>
    </div>
);
const PopularDishes = () => <div className="text-white p-8">Popular Dishes List</div>;
const MenuContainer = () => <div className="text-white p-8">Menu Items Grid</div>;
const CustomerInfo = () => <div className="text-white p-4">Customer Info Panel</div>;
const CartInfo = () => <div className="text-white p-4 h-64 overflow-y-auto">Cart Items List</div>;
const Bill = () => <div className="text-white p-4">Bill Summary</div>;


// --- END: Mock External Components and HTTP Functions ---

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
    const loadInitialData = () => {
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

// --- START: Page Components (Integrated Content) ---

const PageContainer = ({ title, children }) => (
    <div className="p-0 max-w-full mx-auto">
        {/* Removed header/padding since your pages provide their own dark background/layout */}
        {children}
    </div>
);


function Auth() {
    // --- INTEGRATED AUTH.JSX CONTENT ---
    
    // Note: The original Auth function relied on Login/Register components to handle form logic.
    // Since we can't fully integrate those without their source, we keep the original JSX structure.
    
    useEffect(() => {
      document.title = "POS | Auth"
    }, [])

    const [isRegister, setIsRegister] = useState(false);

    // Placeholder for handleSubmit/setLoading logic from previous file structure:
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false); // Used in Register/Login forms

    // DUMMY handleSubmit/setLoading to maintain flow
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500)); 
            dispatch({ 
                type: 'LOGIN_SUCCESS', 
                payload: { user: { name: 'TestUser', role: 'waiter' }, token: 'real-token' } 
            });
            navigate('/'); 
        } catch (error) {
            console.error("Auth failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full">
          {/* Left Section */}
          <div className="w-1/2 relative flex items-center justify-center bg-cover bg-gray-900">
            {/* BG Image Placeholder */}
            <div className="absolute inset-0 bg-cover opacity-30" style={{backgroundImage: "url('https://placehold.co/1200x800/222/fff?text=Restaurant+Image')"}}></div>

            {/* Black Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-80"></div>

            {/* Quote at bottom */}
            <blockquote className="absolute bottom-10 px-8 mb-10 text-2xl italic text-white z-10">
              "Serve customers the best food with prompt and friendly service in a
              welcoming atmosphere, and they’ll keep coming back."
              <br />
              <span className="block mt-4 text-yellow-400">- Founder of Restro</span>
            </blockquote>
          </div>

          {/* Right Section */}
          <div className="w-1/2 min-h-screen bg-[#1a1a1a] p-10">
            <div className="flex flex-col items-center gap-2">
              <img alt="Restro Logo" className="h-14 w-14 border-2 rounded-full p-1" src="https://placehold.co/56x56/yellow/black?text=R" />
              <h1 className="text-lg font-semibold text-[#f5f5f5] tracking-wide">Restro</h1>
            </div>

            <h2 className="text-4xl text-center mt-10 font-semibold text-yellow-400 mb-10">
              {isRegister ? "Employee Registration" : "Employee Login"}
            </h2>

            {/* Components - Using placehold components that execute handleSubmit on click */}  
            {isRegister ? <Register setIsRegister={setIsRegister} handleSubmit={handleSubmit} setLoading={setLoading} /> : <Login handleSubmit={handleSubmit} setLoading={setLoading} />}


            <div className="flex justify-center mt-6">
              <p className="text-sm text-[#ababab]">
                {isRegister ? "Already have an account?" : "Don't have an account?"}
                <a onClick={() => setIsRegister(!isRegister)} className="text-yellow-400 font-semibold hover:underline cursor-pointer" href="#">
                  {isRegister ? "Sign in" : "Sign up"}
                </a>
              </p>
            </div>
        </div>
        </div>
    );
}

function Home() {
    // --- INTEGRATED HOME.JSX CONTENT ---
    useEffect(() => {
      document.title = "POS | Home"
    }, [])

    return (
        <PageContainer title="Home">
            <section className="bg-[#1f1f1f] h-[calc(100vh-5rem)] overflow-hidden flex gap-3">
              {/* Left Div */}
              <div className="flex-[3]">
                <Greetings />
                <div className="flex items-center w-full gap-3 px-8 mt-8">
                  <MiniCard title="Total Earnings" icon={<BsCashCoin className="text-2xl" />} number={512} footerNum={1.6} />
                  <MiniCard title="In Progress" icon={<GrInProgress className="text-2xl" />} number={16} footerNum={3.6} />
                </div>
                <RecentOrders />
              </div>
              {/* Right Div */}
              <div className="flex-[2]">
                <PopularDishes />
              </div>
              <BottomNav />
            </section>
        </PageContainer>
    );
}

function Orders() {
    // --- INTEGRATED ORDERS.JSX CONTENT ---
    const [status, setStatus] = useState("all");

    useEffect(() => {
      document.title = "POS | Orders"
    }, [])

    const { data: resData, isError } = useQuery({
        queryKey: ["orders"],
        queryFn: async () => {
        // MOCK: Replace with actual fetch to your Render backend
          return await getOrders(); 
        },
        placeholderData: keepPreviousData
    })

    if(isError) {
        // Error logging instead of enqueueSnackbar
        console.error("Orders: Something went wrong!"); 
    }

    return (
        <PageContainer title="Orders">
            <section className="bg-[#1f1f1f]  h-[calc(100vh-5rem)] overflow-hidden">
              <div className="flex items-center justify-between px-10 py-4">
                <div className="flex items-center gap-4">
                  <BackButton />
                  <h1 className="text-[#f5f5f5] text-2xl font-bold tracking-wider">
                    Orders
                  </h1>
                </div>
                <div className="flex items-center justify-around gap-4">
                  <button onClick={() => setStatus("all")} className={`text-[#ababab] text-lg ${status === "all" && "bg-[#383838] rounded-lg px-5 py-2"} rounded-lg px-5 py-2 font-semibold`}>
                    All
                  </button>
                  <button onClick={() => setStatus("progress")} className={`text-[#ababab] text-lg ${status === "progress" && "bg-[#383838] rounded-lg px-5 py-2"} rounded-lg px-5 py-2 font-semibold`}>
                    In Progress
                  </button>
                  <button onClick={() => setStatus("ready")} className={`text-[#ababab] text-lg ${status === "ready" && "bg-[#383838] rounded-lg px-5 py-2"} rounded-lg px-5 py-2 font-semibold`}>
                    Ready
                  </button>
                  <button onClick={() => setStatus("completed")} className={`text-[#ababab] text-lg ${status === "completed" && "bg-[#383838] rounded-lg px-5 py-2"} rounded-lg px-5 py-2 font-semibold`}>
                    Completed
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 px-16 py-4 overflow-y-scroll scrollbar-hide">
                {
                    resData?.data.data.length > 0 ? (
                      resData.data.data.map((order) => {
                        // OrderCard is a mock component
                      return <OrderCard key={order._id} order={order} />
                      })
                    ) : <p className="col-span-3 text-gray-500">No orders available</p>
                }
              </div>

              <BottomNav />
            </section>
        </PageContainer>
    );
}

function Tables() {
    // --- INTEGRATED TABLES.JSX CONTENT ---
    const [status, setStatus] = useState("all");

    useEffect(() => {
      document.title = "POS | Tables"
    }, [])

    const { data: resData, isError } = useQuery({
        queryKey: ["tables"],
        queryFn: async () => {
        // MOCK: Replace with actual fetch to your Render backend
          return await getTables(); 
        },
        placeholderData: keepPreviousData,
    });

    if(isError) {
        console.error("Tables: Something went wrong!");
    }

    return (
        <PageContainer title="Tables">
            <section className="bg-[#1f1f1f] h-[calc(100vh-5rem)] overflow-hidden">
              <div className="flex items-center justify-between px-10 py-4">
                <div className="flex items-center gap-4">
                  <BackButton />
                  <h1 className="text-[#f5f5f5] text-2xl font-bold tracking-wider">
                    Tables
                  </h1>
                </div>
                <div className="flex items-center justify-around gap-4">
                  <button
                    onClick={() => setStatus("all")}
                    className={`text-[#ababab] text-lg ${
                      status === "all" && "bg-[#383838] rounded-lg px-5 py-2"
                    } rounded-lg px-5 py-2 font-semibold`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setStatus("booked")}
                    className={`text-[#ababab] text-lg ${
                      status === "booked" && "bg-[#383838] rounded-lg px-5 py-2"
                    } rounded-lg px-5 py-2 font-semibold`}
                  >
                    Booked
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-3 px-16 py-4 h-[650px] overflow-y-scroll scrollbar-hide">
                {resData?.data.data.map((table) => {
                    // TableCard is a mock component
                  return (
                    <TableCard
                      id={table._id}
                      name={table.tableNo}
                      status={table.status}
                      initials={table?.currentOrder?.customerDetails.name}
                      seats={table.seats}
                    />
                  );
                })}
              </div>

              <BottomNav />
            </section>
        </PageContainer>
    );
}

function Menu() {
    // --- INTEGRATED MENU.JSX CONTENT ---
    const customerData = useSelector((state) => state.customer);

    useEffect(() => {
        document.title = "POS | Menu"
    }, [])

    return (
        <PageContainer title="Menu">
            <section className="bg-[#1f1f1f] h-[calc(100vh-5rem)] overflow-hidden flex gap-3">
                {/* Left Div */}
                <div className="flex-[3]">
                    <div className="flex items-center justify-between px-10 py-4">
                        <div className="flex items-center gap-4">
                            <BackButton />
                            <h1 className="text-[#f5f5f5] text-2xl font-bold tracking-wider">
                                Menu
                            </h1>
                        </div>
                        <div className="flex items-center justify-around gap-4">
                            <div className="flex items-center gap-3 cursor-pointer">
                                <MdRestaurantMenu className="text-[#f5f5f5] text-4xl" />
                                <div className="flex flex-col items-start">
                                  <h1 className="text-md text-[#f5f5f5] font-semibold tracking-wide">
                                    {customerData.customerName || "Customer Name"}
                                  </h1>
                                  <p className="text-xs text-[#ababab] font-medium">
                                    Table : {customerData.table?.tableNo || "N/A"}
                                  </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <MenuContainer />
                </div>
                {/* Right Div */}
                <div className="flex-[1] bg-[#1a1a1a] mt-4 mr-3 h-[780px] rounded-lg pt-2">
                    {/* Customer Info */}
                    <CustomerInfo />
                    <hr className="border-[#2a2a2a] border-t-2" />
                    {/* Cart Items */}
                    <CartInfo />
                    <hr className="border-[#2a2a2a] border-t-2" />
                    {/* Bills */}
                    <Bill />
                </div>

                <BottomNav />
            </section>
        </PageContainer>
    );
}

function Dashboard() {
    // --- INTEGRATED DASHBOARD.JSX CONTENT ---
    
    useEffect(() => {
        document.title = "POS | Admin Dashboard"
    }, [])

    const [isTableModalOpen, setIsTableModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("Metrics");

    const buttons = [
        { label: "Add Table", icon: <MdTableBar className="text-xl" />, action: "table" },
        { label: "Add Category", icon: <MdCategory className="text-xl" />, action: "category" },
        { label: "Add Dishes", icon: <BiSolidDish className="text-xl" />, action: "dishes" },
    ];

    const tabs = ["Metrics", "Orders", "Payments"];

    const handleOpenModal = (action) => {
        if (action === "table") setIsTableModalOpen(true);
    };

    return (
        <PageContainer title="Dashboard">
            <div className="bg-[#1f1f1f] h-[calc(100vh-5rem)]">
                <div className="container mx-auto flex items-center justify-between py-14 px-6 md:px-4">
                    <div className="flex items-center gap-3">
                        {buttons.map(({ label, icon, action }) => {
                            return (
                              <button
                                key={label}
                                onClick={() => handleOpenModal(action)}
                                className="bg-[#1a1a1a] hover:bg-[#262626] px-8 py-3 rounded-lg text-[#f5f5f5] font-semibold text-md flex items-center gap-2"
                                >
                                {label} {icon}
                                </button>
                              );
                          })}
                    </div>

                    <div className="flex items-center gap-3">
                        {tabs.map((tab) => {
                            return (
                              <button
                                key={tab}
                                className={`
                                px-8 py-3 rounded-lg text-[#f5f5f5] font-semibold text-md flex items-center gap-2 ${
                                  activeTab === tab
                                    ? "bg-[#262626]"
                                    : "bg-[#1a1a1a] hover:bg-[#262626]"
                                  }`}
                                onClick={() => setActiveTab(tab)}
                                >
                                {tab}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {activeTab === "Metrics" && <Metrics />}
                {activeTab === "Orders" && <RecentOrders />}
                {activeTab === "Payments" && 
                    <div className="text-white p-6 container mx-auto">
                        Payment Component Coming Soon
                    </div>
                }

                {isTableModalOpen && <Modal setIsTableModalOpen={setIsTableModalOpen} />}
            </div>
        </PageContainer>
    );
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
        <Route path="*" element={<PageContainer title="404 Not Found"><div className="bg-[#1f1f1f] h-[calc(100vh-5rem)] p-10 text-center text-white">The requested page was not found.</div></PageContainer>} />
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

// React Query Provider is needed for components that use useQuery
const QueryProvider = ({ children }) => {
    // Mock QueryClient
    const queryClient = useMemo(() => new (function QueryClient() {
      this.defaultQueryOptions = {};
      this.fetchQuery = () => {};
      this.prefetchQuery = () => {};
    })(), []); 
    
    // In a real app, you would use QueryClientProvider. 
    // Here we just return children as the useQuery hook is mocked.
    return <>{children}</>;
};

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
