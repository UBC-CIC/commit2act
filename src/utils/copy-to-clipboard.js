// Implementation grabbed from LogRocket blog post:
// https://blog.logrocket.com/implementing-copy-clipboard-react-clipboard-api/

export const copyToClipboard = async (textToCopy) => {
  if ('clipboard' in navigator) {
    return await navigator.clipboard.writeText(textToCopy);
  }
  console.log('no clipboard');
  // Fallback to execCommand if browser does not support clipboard API:
  // https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand
  return document.execCommand('copy', true, textToCopy);
};
