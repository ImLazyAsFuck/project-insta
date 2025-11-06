import { useLoginMutation } from "@/hooks/useAuth";
import { FontAwesome } from "@expo/vector-icons"; // nếu dùng Expo
import { router } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
	const { mutate: login, isPending, isError, error, reset } = useLoginMutation();

  const isFormValid = identifier.trim().length > 0 && password.trim().length > 0;

  const handleLogin = () => {
    login({ email: identifier, password });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Instagram</Text>
		<TextInput
			style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        value={identifier}
			onChangeText={(v) => {
				if (isError) reset();
				setIdentifier(v);
			}}
      />
		{isError ? (
			<Text style={styles.errorText}>Email hoặc mật khẩu không chính xác</Text>
		) : null}
		<TextInput
			style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
			onChangeText={(v) => {
				if (isError) reset();
				setPassword(v);
			}}
      />
		{isError ? (
			<Text style={styles.errorText}>Email hoặc mật khẩu không chính xác</Text>
		) : null}
      <TouchableOpacity style={styles.forgotContainer}>
        <Text style={styles.forgotText}>Forgot password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.loginButton,
          (!isFormValid || isPending) && styles.loginButtonDisabled,
        ]}
        onPress={handleLogin}
        disabled={!isFormValid || isPending}
      >
        <Text style={styles.loginText}>
          {isPending ? "Logging in..." : "Log in"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.facebookButton}>
        <FontAwesome name="facebook-square" size={20} color="#3797EF" />
        <Text style={styles.facebookText}> Log in with Facebook</Text>
      </TouchableOpacity>

      <View style={styles.dividerContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>OR</Text>
        <View style={styles.line} />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
          <Text style={styles.signUp}>Sign up.</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.bottomText}>Instagram or Facebook</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  logo: {
    fontSize: 42,
    fontFamily: "Billabong",
    marginBottom: 40,
  },
  input: {
    width: "100%",
    height: 44,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    backgroundColor: "#fafafa",
    paddingHorizontal: 12,
    marginBottom: 10,
  },
	errorText: {
		width: "100%",
		color: "#FF3B30",
		fontSize: 13,
		marginBottom: 10,
	},
  forgotContainer: {
    alignSelf: "flex-end",
    marginBottom: 15,
  },
  forgotText: {
    color: "#3797EF",
    fontSize: 13,
  },
  loginButton: {
    backgroundColor: "#3797EF",
    paddingVertical: 12,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginBottom: 15,
  },
  loginButtonDisabled: {
    backgroundColor: "#B2DFFC",
    opacity: 0.6,
  },
  loginText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  facebookButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  facebookText: {
    color: "#3797EF",
    fontWeight: "600",
    fontSize: 15,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 25,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ddd",
  },
  orText: {
    marginHorizontal: 10,
    color: "#999",
    fontWeight: "500",
  },
  footer: {
    flexDirection: "row",
    marginBottom: 60,
  },
  footerText: {
    color: "#999",
  },
  signUp: {
    color: "#000",
    fontWeight: "600",
  },
  bottomText: {
    position: "absolute",
    bottom: 20,
    color: "#999",
    fontSize: 12,
  },
});
