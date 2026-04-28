import { Logo } from '../logo';

export const Header = () => {
  return (
    <header className="fixed top-0 z-50 w-full bg-background-primary backdrop-blur supports-[backdrop-filter]:bg-background/60:">
      <Logo />
    </header>
  );
};
