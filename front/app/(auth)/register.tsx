import { useRegisterMutation } from "@/hooks/useAuth";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const { mutate: register, isPending } = useRegisterMutation();

  const isFormValid =
    email.trim().length > 0 &&
    username.trim().length > 0 &&
    password.trim().length > 0 &&
    phoneNumber.trim().length > 0;

  const handleRegister = () => {
    register({
      email,
      password,
      ...(fullname.trim().length > 0 && { fullName: fullname }),
      username,
      phoneNumber,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Instagram</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#999"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Full name"
        placeholderTextColor="#999"
        value={fullname}
        onChangeText={setFullname}
      />

      <TextInput
        style={styles.input}
        placeholder="Phone number"
        placeholderTextColor="#999"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={[
          styles.signUpButton,
          (!isFormValid || isPending) && styles.signUpButtonDisabled,
        ]}
        onPress={handleRegister}
        disabled={!isFormValid || isPending}
      >
        <Text style={styles.signUpText}>
          {isPending ? "Signing up..." : "Sign up"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.facebookButton}>
        <FontAwesome name="facebook-square" size={20} color="#3797EF" />
        <Text style={styles.facebookText}> Sign up with Facebook</Text>
      </TouchableOpacity>

      <View style={styles.dividerContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>OR</Text>
        <View style={styles.line} />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
          <Text style={styles.loginLink}>Log in.</Text>
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
  signUpButton: {
    backgroundColor: "#3797EF",
    paddingVertical: 12,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginBottom: 15,
  },
  signUpButtonDisabled: {
    backgroundColor: "#B2DFFC",
    opacity: 0.6,
  },
  signUpText: {
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
  loginLink: {
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
