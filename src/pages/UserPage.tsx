import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  Label,
  Input,
  Textarea,
} from "../components/ui/components";
import { ChevronUp, ChevronDown, Loader2, ImageIcon } from "lucide-react";
import { ChatBot } from "../components/ChatBot";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../lib/AuthContext";
import { profileAPI, bucketListAPI, uploadAPI } from "../lib/api";
import defaultEntryImage from "../assets/default-entry-image.png";
import SpaceButton from "../components/SpaceButton";

interface BucketListEntry {
  id: string;
  title: string;
  description: string;
  location: string;
  imageUrl: string;
  completed: boolean;
  createdAt: Date;
  completedOn: Date | null;
}

const UserPage = () => {
  const { user, logout, updateUser } = useAuth();
  const [entries, setEntries] = useState<BucketListEntry[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<BucketListEntry | null>(
    null
  );
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [authAction, setAuthAction] = useState<
    "edit" | "password" | "delete" | null
  >(null);
  const [password, setPassword] = useState("");
  const [newName, setNewName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [newEntry, setNewEntry] = useState({
    title: "",
    description: "",
    location: "Anywhere",
    imageUrl: "",
    completed: false,
  });
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);
  const [isDescriptionDialogOpen, setIsDescriptionDialogOpen] = useState(false);
  const [selectedEntryForDetails, setSelectedEntryForDetails] =
    useState<BucketListEntry | null>(null);

  useEffect(() => {
    // Load bucket list entries from API
    const fetchEntries = async () => {
      try {
        setLoading(true);
        // Fetch entries from the API
        const response = await bucketListAPI.getEntries();
        setEntries(response);
      } catch (err) {
        console.error("Failed to fetch entries:", err);
        // Fallback to mock data if API fails
        const mockEntries: BucketListEntry[] = [
          {
            id: "1",
            title: "Visit Paris",
            description: "See the Eiffel Tower and enjoy French cuisine",
            location: "Paris, France",
            imageUrl:
              "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop",
            completed: false,
            createdAt: new Date(2023, 1, 15),
            completedOn: null,
          },
          {
            id: "2",
            title: "Learn to Scuba Dive",
            description: "Get PADI certified and explore the underwater world",
            location: "Great Barrier Reef, Australia",
            imageUrl:
              "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop",
            completed: true,
            createdAt: new Date(2023, 2, 10),
            completedOn: new Date(2023, 2, 15),
          },
          {
            id: "3",
            title: "Run a Marathon",
            description: "Train for and complete a full 26.2 mile marathon",
            location: "Boston, MA",
            imageUrl:
              "https://images.unsplash.com/photo-1613937574892-25f441264a09?w=400&h=300&fit=crop",
            completed: false,
            createdAt: new Date(2023, 3, 5),
            completedOn: null,
          },
        ];
        setEntries(mockEntries);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, []);

  const handleSortToggle = () => {
    setSortOrder((prevSort) => (prevSort === "asc" ? "desc" : "asc"));
  };

  const handleCreateEntry = () => {
    setIsEditMode(false);
    setNewEntry({
      title: "",
      description: "",
      location: "Anywhere",
      imageUrl: "",
      completed: false,
    });
    setIsCreateDialogOpen(true);
  };

  const handleEditEntry = (entry: BucketListEntry) => {
    setIsEditMode(true);
    setCurrentEntry(entry);
    setNewEntry({
      title: entry.title,
      description: entry.description,
      location: entry.location,
      imageUrl: "",
      completed: entry.completed,
    });
    setIsCreateDialogOpen(true);
  };

  const handleDeleteEntry = async (id: string) => {
    // Set the entry ID to delete and open the confirmation dialog
    setEntryToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteEntry = async () => {
    if (!entryToDelete) return;

    try {
      setLoading(true);
      await bucketListAPI.deleteEntry(entryToDelete);
      // Update local state after successful API call
      setEntries((prevEntries) =>
        prevEntries.filter((entry) => entry.id !== entryToDelete)
      );
      // Close the dialog after successful deletion
      setIsDeleteDialogOpen(false);
      // Reset the entry to delete
      setEntryToDelete(null);
    } catch (err) {
      console.error("Failed to delete entry:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCompleted = async (id: string) => {
    try {
      setLoading(true);
      const entryToUpdate = entries.find((entry) => entry.id === id);

      if (!entryToUpdate) return;

      const updatedEntry = {
        ...entryToUpdate,
        completed: !entryToUpdate.completed,
        completedOn: !entryToUpdate.completed ? new Date() : null,
      };

      await bucketListAPI.updateEntry(id, updatedEntry);

      setEntries((prevEntries) =>
        prevEntries.map((entry) => (entry.id === id ? updatedEntry : entry))
      );
    } catch (err) {
      console.error("Failed to toggle completion:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEntry = async () => {
    try {
      setLoading(true);

      // Create the entry object to save
      let entryToSave;

      if (isEditMode && currentEntry) {
        // For edits, only update imageUrl if the user provided a new one
        entryToSave = {
          ...newEntry,
          // Keep original imageUrl if no new URL is provided
          imageUrl: newEntry.imageUrl
            ? newEntry.imageUrl
            : currentEntry.imageUrl,
        };

        // Update existing entry
        const updatedEntry = await bucketListAPI.updateEntry(
          currentEntry.id,
          entryToSave
        );
        setEntries((prevEntries) =>
          prevEntries.map((entry) =>
            entry.id === currentEntry.id ? updatedEntry : entry
          )
        );
      } else {
        // For new entries, use default image if no URL is provided
        entryToSave = {
          ...newEntry,
          imageUrl: newEntry.imageUrl || defaultEntryImage,
        };

        // Create new entry
        const createdEntry = await bucketListAPI.createEntry(entryToSave);
        setEntries((prevEntries) => [...prevEntries, createdEntry]);
      }
      setIsCreateDialogOpen(false);
    } catch (err) {
      console.error("Failed to save entry:", err);
      setError("Failed to save entry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsAction = (
    action: "edit" | "password" | "delete" | "logout"
  ) => {
    if (action === "logout") {
      logout();
      return;
    }

    // Reset fields for the settings dialog
    setPassword("");
    setNewName("");
    setNewPassword("");
    setError(null);

    setAuthAction(action);
    setIsAuthDialogOpen(true);
    setIsSettingsOpen(false);
  };

  const handleSettingsConfirm = async () => {
    setLoading(true);
    setError(null);

    try {
      switch (authAction) {
        case "edit":
          // Update user's name
          if (user && newName) {
            await profileAPI.updateProfile(newName, password);
            // Update the user context with the new name
            updateUser({ firstName: newName });
            setIsAuthDialogOpen(false);
          } else {
            throw new Error("Please enter a new name");
          }
          break;
        case "password":
          // Change password
          if (newPassword) {
            await profileAPI.changePassword(password, newPassword);
            alert("Password changed successfully");
            setIsAuthDialogOpen(false);
          } else {
            throw new Error("Please enter a new password");
          }
          break;
        case "delete":
          // Delete account
          await profileAPI.deleteAccount(password);
          logout();
          break;
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  // Calculate completion percentage
  const completedCount = entries.filter((entry) => entry.completed).length;
  const totalEntries = entries.length;
  const completionPercentage =
    totalEntries > 0 ? Math.round((completedCount / totalEntries) * 100) : 0;

  // Get motivational message
  const getMotivationalMessage = () => {
    if (completionPercentage === 0) {
      return "You haven't done any of bucket list items yet, Time to get started.";
    } else if (completionPercentage >= 1 && completionPercentage <= 24) {
      return "You have started, but you should get more done.";
    } else if (completionPercentage >= 25 && completionPercentage <= 49) {
      return "You are getting something done, but you still have more to do.";
    } else if (completionPercentage === 50) {
      return "You are half-way there! Keep going!";
    } else if (completionPercentage >= 51 && completionPercentage <= 74) {
      return "Nice! You have completed more than half of your list!";
    } else if (completionPercentage >= 75 && completionPercentage <= 89) {
      return "Well done! You have completed at least three quarters of your list!";
    } else if (completionPercentage >= 90 && completionPercentage <= 99) {
      return "Most of it is done. Finish what is left!";
    } else {
      return "Great job! You did it! Think if there is anything else you want to add.";
    }
  };

  // Handle file selection for image upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setError(null);

      // Upload the file to Cloudinary via our API
      const uploadResponse = await uploadAPI.uploadImage(file);

      if (uploadResponse && uploadResponse.url) {
        // Update the entry state with the new image URL
        setNewEntry({
          ...newEntry,
          imageUrl: uploadResponse.url,
        });
      }
    } catch (err) {
      console.error("Failed to upload image:", err);
      setError("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Open description dialog
  const handleOpenDescriptionDialog = (entry: BucketListEntry) => {
    setSelectedEntryForDetails(entry);
    setIsDescriptionDialogOpen(true);
  };

  // Format date for display
  const formatDate = (date: Date | string) => {
    if (!date) return "";
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Add a new function to handle the card click
  const handleCardClick = (entry: BucketListEntry) => {
    handleOpenDescriptionDialog(entry);
  };

  // Return loading state if user exists but entries aren't fetched yet
  if (!user) {
    return <div className="loading-state">Loading...</div>;
  }

  // Get sorted entries
  const sortedEntries = [...entries].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  return (
    <div className="user-container">
      <Navbar
        isUserLoggedIn={true}
        isSettingsOpen={isSettingsOpen}
        onSettingsOpenChange={setIsSettingsOpen}
        settingsContent={
          <div className="settings-menu">
            <div className="settings-menu-header">
              Manage your profile and account settings
            </div>
            <button
              className="settings-link"
              onClick={() => handleSettingsAction("edit")}
            >
              <svg
                className="settings-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Edit First Name
            </button>
            <button
              className="settings-link"
              onClick={() => handleSettingsAction("password")}
            >
              <svg
                className="settings-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Change Password
            </button>
            <button
              className="settings-delete"
              onClick={() => handleSettingsAction("delete")}
            >
              <svg
                className="settings-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Delete Account
            </button>
            <button
              className="settings-link"
              onClick={() => handleSettingsAction("logout")}
            >
              <svg
                className="settings-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Log Out
            </button>
          </div>
        }
      />

      {/* Progress tracker and welcome section together in the center */}
      <div className="container page-top-section">
        {/* Welcome message in the center */}
        <div className="welcome-section text-center mx-auto">
          <h2 className="welcome-title">Welcome {user.firstName}!</h2>
          <p className="welcome-subtitle">Here is your bucket list</p>
        </div>

        {/* Create Entry button */}
        <div className="create-entry-container">
          <SpaceButton text="CREATE AN ENTRY" onClick={handleCreateEntry} />
        </div>

        <div className="progress-section">
          <div className="progress-card">
            <div className="progress-stats">
              <div className="progress-header">
                <span>{completionPercentage}% Complete</span>
                <span>
                  {completedCount} of {totalEntries} tasks
                </span>
              </div>
              <div className="progress-bar-container">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${completionPercentage}%`,
                  }}
                ></div>
              </div>
              <div className="progress-message">
                <p>{getMotivationalMessage()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="sort-section">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSortToggle}
            className="animated-button"
          >
            {sortOrder === "asc" ? (
              <ChevronUp className="sort-icon" />
            ) : (
              <ChevronDown className="sort-icon" />
            )}
            {sortOrder === "asc" ? "Oldest to Newest" : "Newest to Oldest"}
          </Button>
        </div>

        {/* Scrollable container for entries */}
        <div className="entries-scrollable-container">
          <div className="entries-container">
            {sortedEntries.length === 0 ? (
              <div className="empty-state">
                <p className="empty-title">Your bucket list is empty</p>
                <p className="empty-subtitle">
                  Start adding items to your bucket list!
                </p>
                <SpaceButton
                  text="CREATE YOUR FIRST ENTRY"
                  onClick={handleCreateEntry}
                />
              </div>
            ) : (
              sortedEntries.map((entry) => (
                <div
                  key={entry.id}
                  className={`bucket-list-entry fixed-height-entry ${
                    entry.completed ? "completed" : ""
                  }`}
                  onClick={() => handleCardClick(entry)}
                >
                  <div className="relative">
                    {entry.completed && (
                      <div className="entry-completed-overlay">
                        <span className="entry-completed-text">DONE!</span>
                      </div>
                    )}
                    <div className="entry-row">
                      {/* Checkbox on the left */}
                      <div
                        className="entry-checkbox"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div
                          className={`checkbox ${
                            entry.completed ? "checked" : ""
                          }`}
                          onClick={() => handleToggleCompleted(entry.id)}
                        >
                          {entry.completed && (
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="white"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          )}
                        </div>
                      </div>

                      {/* Image */}
                      <div className="entry-image">
                        <img src={entry.imageUrl} alt={entry.title} />
                      </div>

                      {/* Content */}
                      <div className="entry-content">
                        <h3 className="entry-title">{entry.title}</h3>
                        <div className="truncated-description">
                          <span className="see-more-text">
                            Click to see more
                          </span>
                        </div>

                        <div className="entry-details-row">
                          <div className="entry-detail">
                            <span className="detail-label">Location: </span>
                            <span className="detail-value">
                              {entry.location}
                            </span>
                          </div>

                          <div className="entry-detail">
                            <span className="detail-label">Created: </span>
                            <span className="detail-value">
                              {formatDate(entry.createdAt)}
                            </span>
                          </div>
                        </div>

                        <div className="completion-date">
                          <span className="detail-label">Completed On: </span>
                          <span className="detail-value">
                            {entry.completedOn
                              ? formatDate(entry.completedOn)
                              : ""}
                          </span>
                        </div>
                      </div>

                      {/* Button group for edit/delete in the top right */}
                      <div
                        className="entry-actions btn-group"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditEntry(entry);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteEntry(entry.id);
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <Footer />

      {/* Chatbot button - positioned completely independently */}
      <div className="chatbot-button-container">
        <Dialog open={isChatbotOpen} onOpenChange={setIsChatbotOpen}>
          <DialogTrigger asChild>
            <Button className="circular-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </Button>
          </DialogTrigger>
          <DialogContent className="dialog-content chatbot-dialog">
            <DialogHeader className="dialog-header">
              <DialogTitle className="dialog-title">
                Bucket List Assistant
              </DialogTitle>
              <DialogDescription className="dialog-description">
                Ask me for advice on planning your bucket list activities
              </DialogDescription>
            </DialogHeader>
            <div className="chatbot-messages custom-scrollbar">
              <ChatBot />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Dialog Button Groups */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="dialog-content entry-dialog">
          <DialogHeader className="dialog-header">
            <DialogTitle className="dialog-title">
              {isEditMode ? "Edit Entry" : "Create a New Entry"}
            </DialogTitle>
            <DialogDescription className="dialog-description">
              {isEditMode
                ? "Update your bucket list item details"
                : "Add a new item to your bucket list"}
            </DialogDescription>
          </DialogHeader>
          <div className="form-container">
            <div className="form-group">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newEntry.title}
                onChange={(e) =>
                  setNewEntry({ ...newEntry, title: e.target.value })
                }
                placeholder="What do you want to do?"
                required
              />
            </div>
            <div className="form-group">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newEntry.description}
                onChange={(e) =>
                  setNewEntry({ ...newEntry, description: e.target.value })
                }
                placeholder="Describe your bucket list item"
                rows={3}
              />
            </div>
            <div className="form-group">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={newEntry.location}
                onChange={(e) =>
                  setNewEntry({ ...newEntry, location: e.target.value })
                }
                placeholder="Where do you want to do this? (or type 'Anywhere')"
              />
            </div>
            <div className="form-group">
              <Label htmlFor="imageUrl">Image URL</Label>
              <div className="image-upload-container">
                <Input
                  id="imageUrl"
                  value={newEntry.imageUrl}
                  onChange={(e) =>
                    setNewEntry({ ...newEntry, imageUrl: e.target.value })
                  }
                  placeholder="Link to an image (or leave for default)"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="upload-button"
                  onClick={triggerFileInput}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <Loader2 className="loader-icon" />
                  ) : (
                    <>
                      <ImageIcon className="icon-sm" />
                      <span className="upload-text">Upload Image</span>
                    </>
                  )}
                </Button>
              </div>
              {/* Hidden file input for image upload */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
              <div className="input-help-text">
                Leave empty to use a default image or upload your own image.
              </div>
              {isUploading && (
                <div className="upload-status">
                  Uploading image... please wait
                </div>
              )}
            </div>
            <div className="form-buttons btn-group">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="button" onClick={handleSaveEntry}>
                {isEditMode ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Authentication Dialog for Settings Actions */}
      <Dialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen}>
        <DialogContent className="dialog-content auth-dialog">
          <DialogHeader className="dialog-header">
            <DialogTitle className="dialog-title">
              {authAction === "edit" && "Edit Your Profile"}
              {authAction === "password" && "Change Your Password"}
              {authAction === "delete" && "Delete Your Account"}
            </DialogTitle>
            <DialogDescription className="dialog-description">
              {authAction === "edit" && "Update your profile information"}
              {authAction === "password" &&
                "Create a new password for your account"}
              {authAction === "delete" &&
                "Permanently remove your account and all data"}
            </DialogDescription>
          </DialogHeader>
          <div className="auth-form-container">
            {authAction === "edit" && (
              <div className="form-field-group">
                <Label htmlFor="newName">New First Name</Label>
                <Input
                  id="newName"
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Enter your new first name"
                  required
                />
              </div>
            )}

            {authAction === "password" && (
              <div className="form-field-group">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter your new password"
                  required
                />
              </div>
            )}

            <div className="form-field-group">
              <Label htmlFor="authPassword">Current Password</Label>
              <Input
                id="authPassword"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Verify with your current password"
                required
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="form-buttons">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAuthDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSettingsConfirm}
                disabled={
                  !password ||
                  loading ||
                  (authAction === "edit" && !newName) ||
                  (authAction === "password" && !newPassword)
                }
              >
                {loading ? (
                  <>
                    <Loader2 className="loader-icon" />
                    Please wait
                  </>
                ) : authAction === "delete" ? (
                  "Delete Account"
                ) : (
                  "Confirm"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          setIsDeleteDialogOpen(open);
          if (!open) {
            setEntryToDelete(null);
          }
        }}
      >
        <DialogContent className="dialog-content delete-dialog">
          <DialogHeader className="dialog-header">
            <DialogTitle className="dialog-title">Confirm Deletion</DialogTitle>
            <DialogDescription className="dialog-description">
              Are you sure you want to delete this entry? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <div className="form-buttons">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={confirmDeleteEntry}
              disabled={loading}
              variant="destructive"
            >
              {loading ? (
                <>
                  <Loader2 className="loader-icon" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Description Dialog */}
      <Dialog
        open={isDescriptionDialogOpen}
        onOpenChange={setIsDescriptionDialogOpen}
      >
        <DialogContent className="dialog-content description-dialog">
          <DialogHeader className="dialog-header">
            <DialogTitle className="dialog-title">
              {selectedEntryForDetails?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="description-dialog-content">
            {selectedEntryForDetails?.imageUrl && (
              <img
                src={selectedEntryForDetails.imageUrl}
                alt={selectedEntryForDetails.title}
                className="description-dialog-image"
              />
            )}
            <p>{selectedEntryForDetails?.description}</p>

            <div className="description-dialog-details">
              <div className="description-dialog-detail">
                <span className="description-dialog-label">Location</span>
                <span className="description-dialog-value">
                  {selectedEntryForDetails?.location}
                </span>
              </div>
              <div className="description-dialog-detail">
                <span className="description-dialog-label">Created</span>
                <span className="description-dialog-value">
                  {selectedEntryForDetails?.createdAt
                    ? formatDate(selectedEntryForDetails.createdAt)
                    : ""}
                </span>
              </div>
              {selectedEntryForDetails?.completed && (
                <div className="description-dialog-detail">
                  <span className="description-dialog-label">Completed On</span>
                  <span className="description-dialog-value">
                    {selectedEntryForDetails?.completedOn
                      ? formatDate(selectedEntryForDetails.completedOn)
                      : ""}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="form-buttons">
            <Button
              type="button"
              onClick={() => setIsDescriptionDialogOpen(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserPage;
