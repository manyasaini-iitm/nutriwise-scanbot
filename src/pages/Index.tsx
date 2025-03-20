
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ScannerPage from "./ScannerPage";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log("Index page loaded - Showing ScannerPage directly"); // Debug log
    // This component directly renders ScannerPage
  }, []);

  // Return the ScannerPage component directly
  return <ScannerPage />;
};

export default Index;
