import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

export default function useCustomStyles() {
    const theme = useTheme();
    const isMdUp = useMediaQuery(theme.breakpoints.up("sm"));

    const tableSize: "small" | "medium" = isMdUp ? "medium" : "small";
    const pagePadding = isMdUp
        ? {
              padding: "16px",
              paddingTop: "80px",
          }
        : {
              padding: "8px",
              paddingTop: "72px",
          };

    return { tableSize, pagePadding };
}
