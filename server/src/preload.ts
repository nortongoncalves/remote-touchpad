window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector: string, text?: string) => {
    const element = document.getElementById(selector);
    if (element && text) {
      element.innerText = text;
    }
  };

  // eslint-disable-next-line no-restricted-syntax
  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(
      `${type}-version`,
      process.versions[type as keyof NodeJS.ProcessVersions],
    );
  }
});
