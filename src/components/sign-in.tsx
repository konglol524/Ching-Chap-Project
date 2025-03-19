import { signInWithGoogle, signOut } from '../firebase/firebase';
import { User } from 'firebase/auth';


interface SignInProps {
  user: User | null;
}

export default function SignIn({ user }: SignInProps) {

  return (
    <div>
      {user ? (
        // If user is signed in, show a welcome message (or something else)
        <button className={"text-select-none ml-4 px-4 py-2  bg-gray-800 text-white font-medium text-sm rounded-md hover:bg-gray-700 hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300"
        } onClick={signOut}>
          Sign Out
        </button>
      ) : (
        // If user is not signed in, show sign-in button
        <button className={"text-select-none ml-4 px-4 py-2  bg-gray-800 text-white font-medium text-sm rounded-md hover:bg-gray-700 hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300"} 
        onClick={signInWithGoogle}>
          Sign in
        </button>
      )}
    </div>
  );
}
