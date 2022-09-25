import { useSupabase } from "../../contexts/Supabase";

export default function index() {
  const { session, signOut } = useSupabase(); 
  return (
    <header className="navbar bg-gray-900 border-b-1 flex justify-end shadow-lg">
      {session && (
        <button className="btn text-secondary btn-ghost btn-sm"  onClick={signOut}>
          Sign Out
        </button>
      )}
    </header>
  );
}
