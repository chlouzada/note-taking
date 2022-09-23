import { Button, Header } from "@mantine/core";
import { useSupabase } from "../../contexts/Supabase";

export default function index() {
  const { session, signOut } = useSupabase();

  return (
    <Header className="flex items-center justify-between px-4" height={50}>
      <p>Note Taking</p>
      {session && (
        <Button onClick={signOut} variant="subtle" color="lime">
          Sign Out
        </Button>
      )}
    </Header>
  );
}
