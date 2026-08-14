import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";

export default function SyncUser() {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded || !user) return;

    const sync = async () => {
      try {
        await axios.post("http://localhost:5001/api/users/sync", {
          clerkId: user.id,
          fullName: user.fullName || user.firstName || "",
          email: user.primaryEmailAddress?.emailAddress || "",
          image: user.imageUrl || "",
        });
      } catch (err) {
        console.error("User sync failed:", err);
      }
    };

    sync();
  }, [isLoaded, user]);

  return null;
}