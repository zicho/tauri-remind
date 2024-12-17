import { WebviewWindow } from "@tauri-apps/api/webviewWindow";

export const openCreateReminderWindow = async () => {
  const currentWindow = WebviewWindow.getCurrent();
  const currentPosition = await currentWindow.outerPosition(); // Get the current window's position

  // Define the new window's position relative to the current window
  const xPos = currentPosition.x + 50; // Add some offset to the current window's x-coordinate
  const yPos = currentPosition.y + 50; // Add some offset to the current window's y-coordinate

  new WebviewWindow("reminder-modal", {
    url: "/create",
    title: "Create new reminder",
    height: 768,
    decorations: true,
    center: true,
    x: xPos, // Position on the x-axis
    y: yPos, // Position on the y-axis
    resizable: true,
  });
};

export const openEditReminderWindow = async (id: number) => {
  const currentWindow = WebviewWindow.getCurrent();
  const currentPosition = await currentWindow.outerPosition(); // Get the current window's position

  // Define the new window's position relative to the current window
  const xPos = currentPosition.x + 50; // Add some offset to the current window's x-coordinate
  const yPos = currentPosition.y + 50; // Add some offset to the current window's y-coordinate

  new WebviewWindow("reminder-modal", {
    url: `/edit/${id}`,
    title: "Edit reminder",
    height: 768,
    decorations: true,
    center: true,
    x: xPos, // Position on the x-axis
    y: yPos, // Position on the y-axis
    resizable: true,
  });
};