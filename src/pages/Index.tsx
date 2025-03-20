
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ScannerPage from "./ScannerPage";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log("Index page loaded"); // Debug log
    // Uncomment this if you want to redirect instead of rendering ScannerPage directly
    // navigate('/scanner');
  }, []);

  // Return the ScannerPage component directly for now
  return <ScannerPage />;
};

export default Index;
