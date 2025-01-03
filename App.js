import "./global.css";
import { Button, View, StatusBar } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import HomeScreen from "./components/HomeScreen";
import GameResultScreen from "./components/GameResultScreen";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
  useForeground,
} from "react-native-google-mobile-ads";
import mobileAds from "react-native-google-mobile-ads";
import { InterstitialAd, AdEventType } from "react-native-google-mobile-ads";

const adUnitId_banner = __DEV__
  ? TestIds.ADAPTIVE_BANNER
  : "ca-app-pub-8376584919806803/4369080331";

const adUnitId_interstitial = __DEV__
  ? TestIds.INTERSTITIAL
  : "ca-app-pub-8376584919806803/4299332531";

const interstitial = InterstitialAd.createForAdRequest(adUnitId_interstitial, {
  keywords: ["fashion", "clothing"],
});

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("Home");
  const [screenProps, setScreenProps] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [thinkGameCount, setThinkGameCount] = useState(0);

  useForeground(() => {
    Platform.OS === "ios" && bannerRef.current?.load();
  });

  const showInterstitialAd = () => {
    if (loaded) {
      interstitial.show();
      setThinkGameCount(0);
      setLoaded(false);
    }
  };

  const handleThinkGamePress = () => {
    const newCount = thinkGameCount + 1;
    setThinkGameCount(newCount);

    if (newCount >= 4) {
      showInterstitialAd();
    }
  };

  const navigate = (screenName, props = {}) => {
    setCurrentScreen(screenName);
    setScreenProps(props);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "Home":
        return (
          <HomeScreen navigate={navigate} onThinkGame={handleThinkGamePress} />
        );
      case "GameResult":
        return (
          <GameResultScreen
            navigate={navigate}
            onThinkGame={handleThinkGamePress}
            {...screenProps}
          />
        );
      default:
        return (
          <HomeScreen navigate={navigate} onThinkGame={handleThinkGamePress} />
        );
    }
  };

  mobileAds().initialize();
  const bannerRef = useRef(null);

  useEffect(() => {
    const loadAd = () => {
      interstitial.load();
    };

    // 初回の広告読み込み
    loadAd();

    const unsubscribeLoaded = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        setLoaded(true);
      }
    );

    const unsubscribeOpened = interstitial.addAdEventListener(
      AdEventType.OPENED,
      () => {
        if (Platform.OS === "ios") {
          StatusBar.setHidden(true);
        }
      }
    );

    const unsubscribeClosed = interstitial.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        if (Platform.OS === "ios") {
          StatusBar.setHidden(false);
        }
        // 広告が閉じられた後に新しい広告を読み込む
        loadAd();
      }
    );

    // 広告の読み込みに失敗した場合の処理を追加
    const unsubscribeError = interstitial.addAdEventListener(
      AdEventType.ERROR,
      () => {
        setLoaded(false);
        // エラー後に再度読み込みを試みる
        loadAd();
      }
    );

    // Unsubscribe from events on unmount
    return () => {
      unsubscribeLoaded();
      unsubscribeOpened();
      unsubscribeClosed();
      unsubscribeError();
    };
  }, []);

  // No advert ready to show yet
  if (!loaded) {
    return null;
  }

  return (
    <View className="flex-1">
      {renderScreen()}
      <View className="absolute bottom-1 w-full">
        <BannerAd
          ref={bannerRef}
          unitId={adUnitId_banner}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        />
      </View>
    </View>
  );
}
