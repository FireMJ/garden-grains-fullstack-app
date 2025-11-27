import { getAuth } from "firebase/auth";
import { app } from "./firebase"; // make sure this points to your firebase.ts

export const auth = getAuth(app);
