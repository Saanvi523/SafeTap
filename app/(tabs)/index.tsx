
import { LinearGradient } from "expo-linear-gradient";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <LinearGradient
      colors={["#FFFFFF", "#FCFDFF", "#F5FAFF", "#EDF7FF"]}
      locations={[0, 0.5, 0.75, 1]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y:1}}
      style={styles.container}>
      <Text style={styles.title}>SafeTap</Text>
    
    <Text style={styles.subtitle}>
      Stay connected.{"\n"}
      Stay safe.
    </Text>

    {/* Shield Placeholder */}
    <View style={styles.circle}>
      <Image
        source={require("../../assets/images/Shield 2.0. .png")}
        style={styles.shieldImage}
        resizeMode="contain"
        />
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
  </LinearGradient>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 70,
    paddingHorizontal: 30,
  },

  title: {
    fontSize: 46,
    fontWeight: "700",
    color: "#1E3A8A",
    marginTop: 30,
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 18,
    textAlign:"center",
    color: "#5E6D91",
    lineHeight: 28,
    marginBottom: 25,
  },

  circle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "#F9FCFF",
    borderWidth: 2,
    borderColor: "#D9E9FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,

    shadowColor: "#4F7DD9",
    shadowOpacity: 0.15,
    shadowRadius: 15,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    elevation: 8,
  },


  description: {
    fontSize: 18,
    textAlign: "center",
    color: '#5E6D91',
    lineHeight: 28,
    marginTop:5,
    marginBottom: 25,
  },

  button: {
    width: "92%",
    height:58,
    justifyContent:"center",
    backgroundColor: "#4F7DD9",
    borderWidth: 2,
    borderColor: "#4F7DD9",
    borderRadius: 15,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    color: "#FFFFFF",
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

  shieldImage: {
    width: 220,
    height: 220,
  },
});
