import { useSupabase } from "../../contexts/Supabase";

export default function index() {
  const { session, signOut } = useSupabase(); 
  return (
    <header className="navbar bg-base-100 flex justify-between border shadow-sm ">
      <p className="leading-normal font-extrabold text-lg">Note Taking</p>
      {session && (
        <button className="btn btn-sm btn-ghost"  onClick={signOut}>
          Sign Out
        </button>
      )}
    </header>
  );
}
