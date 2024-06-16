import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';

// Combine les props du Button et du RouterLink
type StyledRouterButtonProps = ButtonProps & RouterLinkProps;

const StyledRouterButton: React.FC<StyledRouterButtonProps> = (props) => {
  return <Button component={RouterLink} {...props} />;
};

export default StyledRouterButton;
