interface InterfacePosition {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

declare global {
  interface Window {
    Telegram: {
      WebApp: {
        safeAreaInset: InterfacePosition;
        contentSafeAreaInset: InterfacePosition;
      };
    };
  }
}

const getSafeArea = () => {
  const { safeAreaInset, contentSafeAreaInset } = window.Telegram.WebApp;
  return {
    safeAreaInset: {
      top: safeAreaInset.top,
      bottom: safeAreaInset.bottom,
    },
    contentSafeAreaInset: {
      top: contentSafeAreaInset.top,
      bottom: contentSafeAreaInset.bottom,
    },
  };
};

export const topSafeArea = () => {
  const safeArea = getSafeArea();
  return safeArea.contentSafeAreaInset.top + safeArea.safeAreaInset.top;
};

export const bottomSafeArea = () => {
  const safeArea = getSafeArea();
  return safeArea.contentSafeAreaInset.bottom + safeArea.safeAreaInset.bottom;
};
