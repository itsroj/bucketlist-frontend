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
import { Link, useNavigate } from "react-router-dom";

interface NavbarProps {
  isUserLoggedIn?: boolean;
  onSettingsClick?: () => void;
  isSettingsOpen?: boolean;
  onSettingsOpenChange?: (open: boolean) => void;
  settingsContent?: React.ReactNode;
  loginButton?: React.ReactNode;
  disableSettings?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({
  isUserLoggedIn = false,
  onSettingsClick,
  isSettingsOpen = false,
  onSettingsOpenChange,
  settingsContent,
  loginButton,
  disableSettings = false,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  const handleLogoClick = () => {
    if (isUserLoggedIn) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  return (
    <header className="navbar">
      <div className="container">
        <div
          className="navbar-brand"
          onClick={handleLogoClick}
          style={{ cursor: "pointer" }}
        >
          <img src={logoImage} alt="Bucket List Logo" className="navbar-logo" />
        </div>

        <div className="flex items-center gap-2">
          <div className="theme-toggle-wrapper">
            <ThemeToggle />
          </div>

          {isUserLoggedIn && !disableSettings ? (
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
          ) : isUserLoggedIn && disableSettings ? null : (
            loginButton
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
