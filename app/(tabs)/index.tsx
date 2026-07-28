import { Pressable, StyleSheet, Text, View } from "react-native";

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
      <View style={styles.footerItem}>
        <Text>🔒</Text>
        <Text style={styles.footerText}>Secure</Text>
        </View>
      <View style={styles.footerItem}>
        <Text>🛡️</Text>
        <Text style={styles.footerText}>Private</Text>
      </View>
      <View style={styles.footerItem}>
        <Text>👥</Text>
        <Text style={styles.footerText}>Reliable</Text>
      </View>
    </View>
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 70,
    paddingHorizontal: 30,
  },

  title: {
    fontSize: 46,
    fontWeight: "700",
    color: "#000",
    marginTop: 30,
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 18,
    textAlign:"center",
    color: "#444",
    lineHeight: 28,
    marginBottom: 25,
  },

  circle: {
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 2,
    borderColor: "black",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
  },

  shield: {
    fontSize: 95,
  },

  description: {
    fontSize: 18,
    textAlign: "center",
    color: '#444',
    lineHeight: 28,
    marginTop:5,
    marginBottom: 25,
  },

  button: {
    width: "92%",
    height:58,
    justifyContent:"center",
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 15,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "90%",
    position: "absolute",
    bottom: 25,
  },

  footerText: {
    fontSize: 12,
    marginTop:2,
    color: "#444",
  },

  footerItem: {
    alignItems: "center",
  },
});
