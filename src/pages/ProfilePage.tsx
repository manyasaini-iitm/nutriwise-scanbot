
import { useEffect } from "react";
import { motion } from "framer-motion";
import UserProfile from "@/components/UserProfile";

const ProfilePage = () => {
  useEffect(() => {
    // Scroll to top when this page loads
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Health Profile
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Customize your health profile to get personalized nutrition recommendations
          </p>
        </div>
        
        <UserProfile />
      </motion.div>
    </div>
  );
};

export default ProfilePage;
