import Header from "components/organisms/Header";
import TabBar from "components/organisms/TabBar";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />} initialRouteName="chat">
      <Tabs.Screen
        name="plan"
        options={{
          title: "Plan",
          header: () => <Header />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          header: () => <Header />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",
          header: () => <Header />,
        }}
      />
    </Tabs>
  );
}
