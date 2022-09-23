import { Header } from "@mantine/core";
import Link from "next/link";

export default function index() {
  return (
    <Header height={60}>
      <Link href={"/"}>Note Taking</Link>
    </Header>
  );
}
