import { app } from "@tauri-apps/api";
import { defaultWindowIcon } from "@tauri-apps/api/app";
import type { Image } from "@tauri-apps/api/image";
import { Menu } from "@tauri-apps/api/menu";
import { TrayIcon } from "@tauri-apps/api/tray";
import { exit } from "@tauri-apps/plugin-process";
import type { PageLoad } from "./$types";
import { db } from "@/db/db";

export const load = (async () => {
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
    reminders
  };
}) satisfies PageLoad;

async function onTrayMenuClick(id: string): Promise<void> {
  if (id === "focus") app.show();
  else if (id === "quit") await exit(0);
}
