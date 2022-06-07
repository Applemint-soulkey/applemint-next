import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
import Link from "next/link";
import FiberNewIcon from "@mui/icons-material/FiberNew";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import SettingsIcon from "@mui/icons-material/Settings";
import FlagIcon from "@mui/icons-material/Flag";
import { NextPage } from "next";
import { useRecoilState } from "recoil";
import { drawerState } from "../store/common";
import { toggleDrawer } from "./common";

export const SideMenu: NextPage = () => {
  const [drawerOpen, setDrawerOpen] = useRecoilState(drawerState);

  return (
    <SwipeableDrawer
      anchor="left"
      open={drawerOpen}
      onClose={toggleDrawer(true, setDrawerOpen)}
      onOpen={toggleDrawer(false, setDrawerOpen)}
      PaperProps={{ style: { backgroundColor: "#00bcd4" } }}
    >
      <Box className="w-60" onClick={toggleDrawer(drawerOpen, setDrawerOpen)}>
        <List>
          <ListSubheader className="sm:my-2 my-1 bg-primary">
            <Typography
              className="font-pretend font-extrabold text-black"
              variant="h5"
            >
              Applemint
            </Typography>
          </ListSubheader>
        </List>

        <Divider />
        <List>
          {/* New */}
          <Link href={"new"}>
            <ListItemButton>
              <ListItemIcon>
                <FiberNewIcon sx={{ color: "black" }} />
              </ListItemIcon>
              <ListItem key={"New"} disablePadding>
                <ListItemText primary={"New"} />
              </ListItem>
            </ListItemButton>
          </Link>

          {/* Keep */}
          <Link href={"keep"}>
            <ListItemButton>
              <ListItemIcon>
                <FlagIcon sx={{ color: "black" }} />
              </ListItemIcon>
              <ListItem key={"Keep"} disablePadding>
                <ListItemText primary={"Keep"} />
              </ListItem>
            </ListItemButton>
          </Link>

          {/* Bookmark */}
          <Link href={"bookmark"}>
            <ListItemButton>
              <ListItemIcon>
                <BookmarksIcon sx={{ color: "black" }} />
              </ListItemIcon>
              <ListItem key={"Bookmark"} disablePadding>
                <ListItemText primary={"Bookmark"} />
              </ListItem>
            </ListItemButton>
          </Link>

          {/* Settings */}
          <Link href={"settings"}>
            <ListItemButton>
              <ListItemIcon>
                <SettingsIcon sx={{ color: "black" }} />
              </ListItemIcon>
              <ListItem key={"Settings"} disablePadding>
                <ListItemText primary={"Settings"} />
              </ListItem>
            </ListItemButton>
          </Link>
        </List>
      </Box>
    </SwipeableDrawer>
  );
};