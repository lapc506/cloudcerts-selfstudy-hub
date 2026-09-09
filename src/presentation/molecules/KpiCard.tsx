import { Avatar, Box, Card, CardContent, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

// Molécula: tarjeta KPI (avatar + etiqueta + valor). Compone átomos MUI.

interface KpiCardProps {
  icon: ReactNode;
  color: string;
  label: string;
  value: ReactNode;
}

export default function KpiCard({ icon, color, label, value }: KpiCardProps) {
  return (
    <Card>
      <CardContent>
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <Avatar sx={{ bgcolor: color }}>{icon}</Avatar>
          <Box>
            <Typography variant="body2" color="text.secondary">
              {label}
            </Typography>
            <Typography variant="h4">{value}</Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
