import { auth, firestore } from "./index";
import { collection, query, where, getDocs, deleteDoc, doc, getDoc, setDoc, Timestamp, limit } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { httpsCallable, getFunctions } from "firebase/functions";

// Initialize Firebase Functions
const functions = getFunctions();

// Collection name for admins
const ADMINS_COLLECTION = "admins";

// Interface for admin user
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  createdAt: Date;
  createdBy?: string;
}

// Interface for regular user
export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  isAdmin: boolean;
}

// Check if a user is an admin
export const checkIfUserIsAdmin = async (userId: string): Promise<boolean> => {
  try {
    const adminRef = doc(firestore, ADMINS_COLLECTION, userId);
    const adminDoc = await getDoc(adminRef);
    return adminDoc.exists();
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};

// Get all admins
export const getAllAdmins = async (): Promise<AdminUser[]> => {
  try {
    const adminsRef = collection(firestore, ADMINS_COLLECTION);
    const querySnapshot = await getDocs(adminsRef);
    
    const admins: AdminUser[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      admins.push({
        id: doc.id,
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        createdAt: (data.createdAt as Timestamp).toDate(),
        createdBy: data.createdBy,
      });
    });
    
    return admins;
  } catch (error) {
    console.error("Error fetching admins:", error);
    return [];
  }
};

// Add a new admin
export const addNewAdmin = async (
  name: string,
  email: string,
  phoneNumber: string,
  password: string,
  currentUserId: string
): Promise<{success: boolean, error?: string}> => {
  try {
    // First create the user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Set custom claims (this requires a Cloud Function)
    const setAdminRole = httpsCallable(functions, 'setAdminRole');
    await setAdminRole({ uid: user.uid });
    
    // Add the user to admins collection
    await setDoc(doc(firestore, ADMINS_COLLECTION, user.uid), {
      name,
      email,
      phoneNumber,
      createdAt: new Date(),
      createdBy: currentUserId
    });
    
    return { success: true };
  } catch (error: any) {
    console.error("Error adding admin:", error);
    return {
      success: false,
      error: error.message || "Failed to add admin"
    };
  }
};

// Make an existing user an admin
export const makeUserAdmin = async (
  userId: string,
  name: string,
  email: string,
  phoneNumber: string,
  currentUserId: string
): Promise<{success: boolean, error?: string}> => {
  try {
    // Check if the user is already an admin
    const isAdmin = await checkIfUserIsAdmin(userId);
    if (isAdmin) {
      return {
        success: false,
        error: "User is already an admin"
      };
    }
    
    // Set custom claims (this requires a Cloud Function)
    const setAdminRole = httpsCallable(functions, 'setAdminRole');
    await setAdminRole({ uid: userId });
    
    // Add the user to admins collection
    await setDoc(doc(firestore, ADMINS_COLLECTION, userId), {
      name,
      email,
      phoneNumber,
      createdAt: new Date(),
      createdBy: currentUserId
    });
    
    return { success: true };
  } catch (error: any) {
    console.error("Error making user admin:", error);
    return {
      success: false,
      error: error.message || "Failed to make user an admin"
    };
  }
};

// Remove an admin
export const removeAdmin = async (adminId: string): Promise<boolean> => {
  try {
    // Remove from admins collection
    await deleteDoc(doc(firestore, ADMINS_COLLECTION, adminId));
    
    // Remove admin role via Cloud Function
    const removeAdminRole = httpsCallable(functions, 'removeAdminRole');
    await removeAdminRole({ uid: adminId });
    
    return true;
  } catch (error) {
    console.error("Error removing admin:", error);
    return false;
  }
};

// Check existing user by email
export const checkUserExists = async (email: string): Promise<{ exists: boolean, user?: any }> => {
  try {
    const usersRef = collection(firestore, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        exists: true,
        user: {
          id: doc.id,
          ...doc.data()
        }
      };
    }
    
    return { exists: false };
  } catch (error) {
    console.error("Error checking user existence:", error);
    return { exists: false };
  }
};

// Get list of users who are not admins
export const getNonAdminUsers = async (searchTerm: string = "", maxResults: number = 20): Promise<User[]> => {
  try {
    // Get current admin IDs for filtering
    const adminIds = new Set<string>();
    const adminsSnapshot = await getDocs(collection(firestore, ADMINS_COLLECTION));
    adminsSnapshot.forEach(doc => adminIds.add(doc.id));
    
    // Get users from the users collection
    const usersRef = collection(firestore, "users");
    let q = query(usersRef, limit(maxResults));
    
    // Apply search if provided
    if (searchTerm) {
      // In a real implementation, this would use a more sophisticated search
      // like Firestore's array-contains or a dedicated search service
      q = query(usersRef,
        where("email", ">=", searchTerm),
        where("email", "<=", searchTerm + "\uf8ff"),
        limit(maxResults)
      );
    }
    
    const querySnapshot = await getDocs(q);
    
    const users: User[] = [];
    querySnapshot.forEach(doc => {
      const data = doc.data();
      
      // Skip users who are already admins
      if (!adminIds.has(doc.id)) {
        users.push({
          id: doc.id,
          name: data.name || data.displayName || "",
          email: data.email || "",
          phoneNumber: data.phoneNumber || "",
          isAdmin: false
        });
      }
    });
    
    return users;
  } catch (error) {
    console.error("Error fetching non-admin users:", error);
    return [];
  }
};
  