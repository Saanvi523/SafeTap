import { Pressable, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>SafeTap</Text>
    
    <Text style={styles.subtitle}>
      Stay connected.{"\n"}
      Stay safe.
    </Text>

    {/* Shield Placeholder */}
    <View style={styles.circle}>
      <Text style={styles.shield}>🛡️</Text>
    </View>

    <Text style={styles.description}>
      One tap to let someone{"\n"}
      know you're safe.
    </Text>

    <Pressable style={styles.button}>
      <Text style={styles.buttonText}>GET STARTED</Text>
    </Pressable>

    <View style={styles.footer}>
      <Text>🔒 Secure</Text>
      <Text>🛡️ Private</Text>
      <Text>👥 Reliable</Text>
    </View>
  </View>
  );
}

const styles = {StyleSheet.create({})
