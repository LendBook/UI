import React, { useState } from "react";
import { Box, Tabs, Tab, Paper } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";

type TabProps = {
    labels: string[];
};

const StyledTabs = styled(Tabs)(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    color: theme.palette.info.main,
}));

const StyledTab = styled(Tab)(({ theme }) => ({
    fontWeight: "bold",
    '&.Mui-selected': { // Style quand l'onglet est sélectionné
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
    },
    '&.Mui-focusVisible': { // Style lors de la focus
        backgroundColor: theme.palette.primary.light,
    }
}));

export default function TabsCustom({ labels }: TabProps) {
    const [value, setValue] = useState(0);
    const theme = useTheme();

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Paper elevation={4} sx={{ borderRadius: 1 }}>
                <StyledTabs
                    value={value}
                    onChange={handleChange}
                    aria-label="customized tabs"
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                >
                    {labels.map((label, index) => (
                        <StyledTab label={label} key={index} />
                    ))}
                </StyledTabs>
            </Paper>
        </Box>
    );
}
