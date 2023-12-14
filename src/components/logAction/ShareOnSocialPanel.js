import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import ActionButtons from './ActionButtons';
import useTranslation from '../customHooks/translations';
import { useUpdateSubmittedAction } from '../customHooks/use-update-submitted-action';
import { PAGE_PATHS } from '../../constants/page-paths';
import { formatCo2Saved } from '../../utils/format-co2-saved';
import { copyToClipboard } from '../../utils/copy-to-clipboard';
import { LogoInstagram } from '../LogoInstagram';
import { LogoTikTok } from '../LogoTikTok';

const socialLinks = [
  {
    key: 'instagram',
    link: 'https://www.instagram.com/',
    label: 'shareOnInstagram',
    icon: LogoInstagram,
  },
  {
    key: 'tiktok',
    link: 'https://www.tiktok.com/',
    label: 'shareOnTikTok',
    icon: LogoTikTok,
  },
];

const filterUpdateDataFromProps = (props) => ({
  actionDate: props.actionDate,
  actionId: props.actionId,
  firstQuizAnswerCorrect: props.firstQuizAnswerCorrect,
  quizAnswered: props.quizAnswered,
  quizId: props.quizId,
  totalCO2Saved: props.totalCO2Saved,
  userId: props.userId,
});

const ShareOnSocialPanel = ({ addAnotherAction, ...props }) => {
  const translation = useTranslation();
  const navigate = useNavigate();
  const formattedCo2Saved = formatCo2Saved(props.totalCO2Saved);
  const [copied, setCopied] = useState(false);

  // Update the current action with quiz info on init of this panel
  useUpdateSubmittedAction(filterUpdateDataFromProps(props), true);

  const shareSummary = translation.formatString(
    translation.logActionShareSummarySimple,
    formattedCo2Saved
  );
  const shareHashtag = translation.commit2ActHashtag;

  const onCopyAndShare = async () => {
    setCopied(false);
    const textToCopy = `${shareSummary} ${shareHashtag}`;
    try {
      await copyToClipboard(textToCopy);
      setCopied(true);
    } catch (e) {
      console.log('Could not copy text: ', e);
    }
  };

  return (
    <Box>
      <Box
        backgroundColor="white"
        border="solid 0.2em #33AF99"
        boxShadow="0.5em 0.5em 3em 0 rgba(117, 151, 5, 0.26)"
        borderRadius="0.35em"
        padding="0.75em 1em 1em"
        marginBottom="2.5rem"
        position="relative"
      >
        <Typography color="black" fontSize="1em">
          {shareSummary}
        </Typography>
        <Typography
          color="black"
          textTransform="uppercase"
          fontWeight="bold"
          marginTop="0.5em"
          fontSize="1em"
        >
          {shareHashtag}
        </Typography>
        <Button
          variant="contained"
          size="small"
          color={copied ? 'success' : 'info'}
          sx={{
            position: 'absolute',
            bottom: '0.2em',
            right: '0.2em',
            fontSize: '0.675em',
            fontWeight: 'bold',
            fontFamily: 'inherit',
          }}
          onClick={onCopyAndShare}
        >
          {translation[copied ? 'copyButtonCopied' : 'copyButtonCopy']}
        </Button>
      </Box>
      <Box marginBottom="2.5em">
        {socialLinks.map(({ link, key, label, icon: LinkIcon }) => (
          <Box key={key} margin="1.5em auto" width="85%">
            <Typography
              alignItems="center"
              component="a"
              display="flex"
              fontSize="1.25em"
              gap="0.75em"
              href={link}
              justifyContent="flex-start"
              target="_blank"
            >
              <LinkIcon aria-hidden="true" />
              <span>{translation[label]}</span>
            </Typography>
          </Box>
        ))}
      </Box>
      <ActionButtons
        backOnClick={addAnotherAction}
        backText={translation.logActionButtonAddAnother}
        forwardOnClick={() => navigate(PAGE_PATHS.DASHBOARD)}
        forwardText={translation.logActionButtonAllDone}
      />
    </Box>
  );
};

export default ShareOnSocialPanel;
