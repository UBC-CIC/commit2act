import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

const buttonStyles = {
  border: 'solid 0.1rem rgba(255,255,255,0.35)',
  borderRadius: '0.35rem',
  '&:not(:last-child)': {
    marginBottom: '0.75rem',
  },
  '&:hover, &:focus': {
    borderColor: 'white',
  },
};

export const MemberDialogAction = ({
  onSelectAction,
  actionLabel,
  actionIcon: ActionIcon,
  ...props
}) => {
  return (
    <ListItemButton onClick={onSelectAction} sx={buttonStyles} {...props}>
      <ListItemIcon>
        <ActionIcon alt="" />
      </ListItemIcon>
      <ListItemText>{actionLabel}</ListItemText>
    </ListItemButton>
  );
};
