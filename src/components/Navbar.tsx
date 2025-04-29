import React, { useRef } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "./ui/components";
import { Settings } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import logoImage from "../assets/logo-bucket.png";

interface NavbarProps {
  isUserLoggedIn?: boolean;
  onSettingsClick?: () => void;
  isSettingsOpen?: boolean;
  onSettingsOpenChange?: (open: boolean) => void;
  settingsContent?: React.ReactNode;
  loginButton?: React.ReactNode;
}

const Navbar: React.FC<NavbarProps> = ({
  isUserLoggedIn = false,
  onSettingsClick,
  isSettingsOpen = false,
  onSettingsOpenChange,
  settingsContent,
  loginButton,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <header className="navbar">
      <div className="container">
        <div className="navbar-brand">
          <img src={logoImage} alt="Bucket List Logo" className="navbar-logo" />
        </div>

        <div className="flex items-center gap-2">
          <div className="theme-toggle-wrapper">
            <ThemeToggle />
          </div>

          {isUserLoggedIn ? (
            <Dialog open={isSettingsOpen} onOpenChange={onSettingsOpenChange}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="animated-button"
                  onClick={onSettingsClick}
                  ref={buttonRef}
                >
                  <Settings className="icon-small" />
                </Button>
              </DialogTrigger>
              <DialogContent className="dialog-content settings-dialog">
                <DialogHeader className="dialog-header">
                  <DialogTitle className="dialog-title">
                    Account Settings
                  </DialogTitle>
                </DialogHeader>
                {settingsContent}
              </DialogContent>
            </Dialog>
          ) : (
            loginButton
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
