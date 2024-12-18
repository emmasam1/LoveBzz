import React, { useCallback } from "react";
import { StyleSheet, View, SafeAreaView } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedRef,
  useAnimatedScrollHandler,
} from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Button from "@/components/Button";
import ListItem from "@/components/ListItem";
import PaginationElement from "@/components/PaginationElement";

const pages = [
  {
    text: "Pair with your loved one effortlessly",
    image: require("../assets/images/pair.png"),
  },
  {
    text: "Send a gentle buzz to show you care.",
    image: require("../assets/images/stay_connected.png"),
  },
  {
    text: "Stay connected, anytime, anywhere.",
    image: require("../assets/images/stay_connected.png"),
  },
];

type OnboardingScreenProps = {
  onComplete: () => void; // Callback when onboarding is complete
};

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const x = useSharedValue(0);
  const flatListIndex = useSharedValue(0);
  const flatListRef = useAnimatedRef<
    Animated.FlatList<{
      text: string;
      image: any;
    }>
  >();

  const scrollHandle = useAnimatedScrollHandler({
    onScroll: (event) => {
      x.value = event.contentOffset.x;
      flatListIndex.value = Math.floor(event.contentOffset.x / 375); // Assuming 375 is the width of each slide
    },
  });

  const onPressGetStarted = useCallback(async () => {
    // Save onboarding completion flag
    await AsyncStorage.setItem("onboardingComplete", "true");
    onComplete(); // Notify parent that onboarding is complete
  }, [onComplete]);

  const renderItem = useCallback(
    ({
      item,
      index,
    }: {
      item: { text: string; image: any };
      index: number;
    }) => {
      return <ListItem item={item} index={index} x={x} />;
    },
    [x]
  );

  return (
    <SafeAreaView style={styles.container}>
      <Animated.FlatList
        ref={flatListRef}
        onScroll={scrollHandle}
        horizontal
        scrollEventThrottle={16}
        pagingEnabled
        data={pages}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        bounces={false}
        showsHorizontalScrollIndicator={false}
      />
      <View style={styles.bottomContainer}>
        <PaginationElement length={pages.length} x={x} />
        <Button
          currentIndex={flatListIndex}
          length={pages.length}
          flatListRef={flatListRef}
          onComplete={onPressGetStarted} // Pass the callback here
        />
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
});
