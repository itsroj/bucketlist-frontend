import { useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  Input,
  Label,
} from "../components/ui/components";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../lib/AuthContext";
import { Loader2 } from "lucide-react";
import SpaceButton from "../components/SpaceButton";

const HomePage = () => {
  const { login, register, isLoading } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    password: "",
  });
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (isSignUp) {
        await register(formData.firstName, formData.email, formData.password);
      } else {
        await login(formData.email, formData.password);
      }
      // On success, the auth context will redirect to dashboard
      setIsLoginDialogOpen(false);
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Authentication failed");
    }
  };

  const loginButton = (
    <Dialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
      <DialogTrigger>
        <SpaceButton text="LOGIN / SIGN UP" />
      </DialogTrigger>
      <DialogContent className="dialog-content auth-dialog">
        <DialogHeader className="dialog-header">
          <DialogTitle className="dialog-title">
            {isSignUp ? "Create an Account" : "Login to Your Account"}
          </DialogTitle>
          <DialogDescription className="dialog-description">
            {isSignUp
              ? "Sign up to start tracking your bucket list items"
              : "Login to view and manage your bucket list"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="form-container">
          {isSignUp && (
            <div className="form-group">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
          )}
          <div className="form-group">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-buttons btn-group">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsLoginDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="loader-icon" />
                  Please wait
                </>
              ) : isSignUp ? (
                "Create Account"
              ) : (
                "Login"
              )}
            </Button>
          </div>
          <div className="form-footer">
            <button
              type="button"
              className="link-button"
              onClick={() => setIsSignUp(!isSignUp)}
              disabled={isLoading}
            >
              {isSignUp
                ? "Already have an account? Login"
                : "Don't have an account? Sign Up"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="page-container">
      <Navbar isUserLoggedIn={false} loginButton={loginButton} />

      <main className="main-content">
        <section className="hero-section">
          <div className="container text-center">
            <h2 className="hero-title">Create Your Personal Bucket List</h2>
            <p className="hero-description">
              Track your dreams, goals, and experiences in one place. Create,
              organize, and conquer your bucket list items.
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="features-section">
          <div className="container">
            <h2 className="section-title">Features</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </div>
                <h3 className="feature-title">Create Personal Entries</h3>
                <p className="feature-description">
                  Add personalized items to your bucket list with titles,
                  descriptions, and more.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <h3 className="feature-title">Ask Our Chatbot</h3>
                <p className="feature-description">
                  Our chatbot is here to help you with your bucket list. Ask
                  questions, get recommendations, and more.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                </div>
                <h3 className="feature-title">Upload Images</h3>
                <p className="feature-description">
                  Upload photos to visually enhance your bucket list entries and
                  memories.
                </p>
              </div>
            </div>
            <div className="get-started-container">
              <Dialog
                open={isLoginDialogOpen}
                onOpenChange={setIsLoginDialogOpen}
              >
                <DialogTrigger asChild>
                  <div>
                    <SpaceButton text="GET STARTED TODAY" />
                  </div>
                </DialogTrigger>
              </Dialog>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="testimonials-section">
          <div className="container">
            <h2 className="section-title">What Our Users Say</h2>
            <div className="testimonials-grid">
              <div className="testimonial-card">
                <div className="testimonial-header">
                  <div className="avatar">
                    <span className="avatar-letter">S</span>
                  </div>
                  <div>
                    <h3 className="testimonial-name">Sarah T.</h3>
                    <p className="testimonial-role">Adventure Enthusiast</p>
                  </div>
                </div>
                <p className="testimonial-text">
                  "This app has transformed how I plan my adventures. I've
                  completed 12 bucket list items this year alone!"
                </p>
              </div>
              <div className="testimonial-card">
                <div className="testimonial-header">
                  <div className="avatar">
                    <span className="avatar-letter">M</span>
                  </div>
                  <div>
                    <h3 className="testimonial-name">Michael R.</h3>
                    <p className="testimonial-role">Travel Blogger</p>
                  </div>
                </div>
                <p className="testimonial-text">
                  "As a travel blogger, I need to keep track of my experiences.
                  This app makes it easy and enjoyable."
                </p>
              </div>
              <div className="testimonial-card">
                <div className="testimonial-header">
                  <div className="avatar">
                    <span className="avatar-letter">J</span>
                  </div>
                  <div>
                    <h3 className="testimonial-name">Jessica K.</h3>
                    <p className="testimonial-role">Life Coach</p>
                  </div>
                </div>
                <p className="testimonial-text">
                  "I recommend this app to all my clients. It's the perfect tool
                  for goal setting and living intentionally."
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
