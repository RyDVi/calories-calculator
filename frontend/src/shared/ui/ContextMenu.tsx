import {
  ClickAwayListener,
  Grow,
  MenuList,
  Paper,
  Popper,
} from '@mui/material';
import { useRef } from 'react';
import { useBoolean } from 'shared/lib';

interface ContextMenuProps {
  anchorRef: ReturnType<typeof useRef<HTMLElement | undefined>>;
  open: () => void;
  close: () => void;
}

export const ContextMenu: React.FC<{
  children: (props: ContextMenuProps) => React.ReactNode;
  content: React.ReactElement;
}> = ({ children, content }) => {
  const anchorRef = useRef<HTMLElement>();
  const [isOpen, open, close] = useBoolean(false);
  return (
    <>
      {children({ open, close, anchorRef })}
      <Popper
        open={isOpen}
        anchorEl={anchorRef.current}
        role={undefined}
        placement="top"
        transition
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps}>
            <Paper>
              <ClickAwayListener
                onClickAway={(event) => {
                  if (
                    !event.target ||
                    !anchorRef.current?.contains(event.target as HTMLElement)
                  ) {
                    close();
                  }
                }}
              >
                <MenuList onKeyDown={close} onClick={close}>
                  {content}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};
