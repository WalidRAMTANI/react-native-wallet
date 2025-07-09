import { Slot } from "expo-router";
import SafeScreen from "@/components/SafeScreen";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
export default function RootLayout() {
  return (
   <ClerkProvider tokenCache={tokenCache}r>
    <SafeScreen>
      <Slot/>
    </SafeScreen>
    </ClerkProvider>
)};
