import { app } from "@tauri-apps/api";
import type { LayoutLoad } from "./$types";
import { defaultWindowIcon } from "@tauri-apps/api/app";
import type { Image } from "@tauri-apps/api/image";
import { Menu } from "@tauri-apps/api/menu";
import { TrayIcon } from "@tauri-apps/api/tray";
import { db } from "@/db/db";
import { exit } from "@tauri-apps/plugin-process";

// See: https://v2.tauri.app/start/frontend/sveltekit/ for more info
export const prerender = true;
export const ssr = false;

export const load: LayoutLoad = async () => {
  const menu = await Menu.new({
    items: [
      {
        id: "focus",
        text: "Show",
        action: onTrayMenuClick,
      },
      {
        id: "quit",
        text: "Quit",
        action: onTrayMenuClick,
      },
    ],
  });

  const options = {
    icon: (await defaultWindowIcon()) as Image,
    menu,
    menuOnLeftClick: true,
  };

  //   const tray =
  await TrayIcon.new(options);

  const reminders = await db.selectFrom("reminders").selectAll().execute();

  return {
    reminders,
  };
};

async function onTrayMenuClick(id: string): Promise<void> {
  if (id === "focus") app.show();
  else if (id === "quit") await exit(0);
}
