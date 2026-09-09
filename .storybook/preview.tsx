import type { Preview } from "@storybook/react-vite";
import { CssBaseline, ThemeProvider } from "@mui/material";
import type { Decorator } from "@storybook/react";
import React from "react";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import { buildTheme, DEFAULT_THEME_SETTINGS } from "../src/presentation/theme";

const muiDecorator: Decorator = (Story) => {
  const theme = React.useMemo(() => buildTheme(DEFAULT_THEME_SETTINGS), []);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Story />
    </ThemeProvider>
  );
};

const preview: Preview = {
  decorators: [muiDecorator],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
};

export default preview;
