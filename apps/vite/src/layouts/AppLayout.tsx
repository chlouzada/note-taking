import { useState } from 'react';
import {
  AppShell,
  Navbar,
  Header as MHeader,
  Footer as MFooter,
  Aside,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme,
} from '@mantine/core';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';

export default function AppLayout({children}: {children: React.ReactNode}) {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  return (
    <AppShell
      styles={{
        main: {
          background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
        },
      }}
      
      footer={
        <MFooter height={60} p="md">
          <Footer/>
        </MFooter>
      }
      header={
        <MHeader fixed height={70} p="md">
          <Header/>
        </MHeader>
      }
    >
      {children}
    </AppShell>
  );
}