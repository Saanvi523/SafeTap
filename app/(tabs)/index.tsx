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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  title: {
    fontSize: 42,
    fontWeight: "bold",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 22,
    textAlign:"center",
    marginBottom: 8,
  },

  circle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 2,
    borderColor: "black",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 35,
  },

  shield: {
    fontSize: 80,
  },

  description: {
    fontSize: 20,
    textAlign: "center",
    lineHeight: 28,
    marginBottom: 40,
  },

  button: {
    width: "100%",
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 15,
    paddignVerical: 18,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 22,
    fontWeight: "bold",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 35,
  },
});
