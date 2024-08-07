import React, { ReactNode, useRef } from "react";
import Tooltip, { tooltipClasses, TooltipProps } from "@mui/material/Tooltip";
import { Instance } from "@popperjs/core";
import { styled } from "@mui/material/styles";
import InfoIcon from "@mui/icons-material/Info";
import theme from "../theme";

interface DivWithTooltipProps {
  tooltipText: string;
  children: ReactNode;
  iconColor: string;
}

const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
  },
}));

const DivWithTooltip: React.FC<DivWithTooltipProps> = ({
  tooltipText,
  children,
  iconColor,
}) => {
  //   const positionRef = React.useRef<{ x: number; y: number }>({
  //     x: 0,
  //     y: 0,
  //   });
  //   const popperRef = React.useRef<Instance>(null);
  //   const areaRef = React.useRef<HTMLDivElement>(null);

  //   const handleMouseMove = (event: React.MouseEvent) => {
  //     positionRef.current = { x: event.clientX, y: event.clientY };

  //     if (popperRef.current != null) {
  //       popperRef.current.update();
  //     }
  //   };

  return (
    <div className="flex">
      {tooltipText != "" ? (
        <BootstrapTooltip title={tooltipText} placement="top">
          {/* <Tooltip
      title={tooltipText}
      placement="top"
      arrow
      PopperProps={{
        popperRef,
        anchorEl: {
          getBoundingClientRect: () => {
            return new DOMRect(
              positionRef.current.x,
              areaRef.current!.getBoundingClientRect().y,
              0,
              0,
            );
          },
        },
      }}
    > */}
          <div className="flex">
            {children}
            <div style={{ marginTop: "-10px" }}>
              <InfoIcon sx={{ fontSize: "100%", color: iconColor }} />
            </div>
          </div>
        </BootstrapTooltip>
      ) : (
        children
      )}
    </div>
  );
};

export default DivWithTooltip;
