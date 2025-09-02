import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import "./App.css";
import BottomNavbar from "./components/BottomNavbar";
import Header from "./components/Header";
import LogoLoader from "./components/LogoLoader";
import { SearchDropDown } from "./components/SearchDropDown";
import { Toaster } from "react-hot-toast";
import ErrorBoundary from "./screens/ErrorBoundary";

function App() {
  const location = useLocation();
  const searchString = location.pathname.split("/");
  const showSearch = ["/", "/cart"];
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    // Simulate loading time or fetch data before hiding the loader
    const timer = setTimeout(() => {
      setLoading(false); // Set loading to false after 2 seconds (or when the app is ready)
    }, 2000);

    return () => clearTimeout(timer); // Cleanup timeout on unmount
  }, [location.pathname]);

  return (
    <ErrorBoundary>
      <div className="App pt-5">
        <Toaster position="top-center" reverseOrder={false} />
        {loading && <LogoLoader />} {/* Show loader if loading state is true */}
        <Header />
        {showSearch?.includes(location.pathname) && <SearchDropDown />}
        {searchString?.includes("search") && <SearchDropDown />}
        <main className="pb-3">
          <>
            <Outlet />
          </>
        </main>
        <BottomNavbar />
      </div>
    </ErrorBoundary>
  );
}

export default App;
