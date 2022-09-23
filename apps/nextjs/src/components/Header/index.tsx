import { Button, Header } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";

export default function index() {
  return (
    <Header height={60}>
      <Link href={"/"}>Note Taking</Link>
    </Header>
  );
}
